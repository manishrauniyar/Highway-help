import Booking from "../models/Booking.js";
import Mechanic from "../models/Mechanic.js";
import User from "../models/User.js";
import { generateOtp } from "../utils/otp.js";
import { ApiError } from "../utils/ApiError.js";

function emitToBooking(req, bookingId, event, payload) {
  const io = req.app.get("io");
  if (io) io.to(String(bookingId)).emit(event, payload);
}

export async function createBooking(req, res) {
  const { mechanicId, serviceType, customerLocation, locationLabel } = req.body;
  if (!mechanicId || !serviceType)
    throw new ApiError(400, "mechanicId and serviceType are required");

  const [customer, mechanic] = await Promise.all([
    User.findById(req.user.id),
    Mechanic.findById(mechanicId),
  ]);
  if (!customer) throw new ApiError(404, "Customer not found");
  if (!mechanic) throw new ApiError(404, "Mechanic not found");
  if (!mechanic.available)
    throw new ApiError(400, "This mechanic is not currently available");

  const booking = await Booking.create({
    customer: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    mechanic: mechanic.id,
    mechanicName: mechanic.name,
    mechanicPhoto: mechanic.photo,
    mechanicPhone: mechanic.phone,
    serviceType,
    otp: generateOtp(4),
    customerLocation,
    locationLabel,
    price: mechanic.price,
  });

  emitToBooking(req, booking.id, "booking_created", booking.toJSON());
  const io = req.app.get("io");
  if (io)
    io.to(`mechanic:${mechanic.id}`).emit("new_request", booking.toJSON());

  res.status(201).json(booking.toJSON());
}

async function loadOwnedBooking(id, field, ownerId) {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking[field]) !== String(ownerId))
    throw new ApiError(403, "Not your booking");
  return booking;
}

export async function acceptBooking(req, res) {
  const booking = await loadOwnedBooking(
    req.params.id,
    "mechanic",
    req.user.id,
  );
  if (booking.status !== "requested")
    throw new ApiError(400, "Booking is no longer pending");
  booking.status = "accepted";
  booking.acceptedAt = new Date();
  await booking.save();
  emitToBooking(req, booking.id, "status_changed", { status: booking.status });
  res.json(booking.toJSON());
}

export async function rejectBooking(req, res) {
  const booking = await loadOwnedBooking(
    req.params.id,
    "mechanic",
    req.user.id,
  );
  if (booking.status !== "requested")
    throw new ApiError(400, "Booking is no longer pending");
  booking.status = "rejected";
  await booking.save();
  emitToBooking(req, booking.id, "status_changed", { status: booking.status });
  res.json(booking.toJSON());
}

export async function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ["onway", "arrived"];
  if (!allowed.includes(status))
    throw new ApiError(400, `status must be one of: ${allowed.join(", ")}`);

  const booking = await loadOwnedBooking(
    req.params.id,
    "mechanic",
    req.user.id,
  );
  const validFrom = { onway: "accepted", arrived: "onway" };
  if (booking.status !== validFrom[status]) {
    throw new ApiError(
      400,
      `Cannot move to "${status}" from "${booking.status}"`,
    );
  }
  booking.status = status;
  await booking.save();
  emitToBooking(req, booking.id, "status_changed", { status: booking.status });
  res.json(booking.toJSON());
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  const booking = await loadOwnedBooking(
    req.params.id,
    "mechanic",
    req.user.id,
  );
  if (booking.status !== "arrived")
    throw new ApiError(400, "Mechanic must be marked arrived first");
  if (String(otp) !== String(booking.otp))
    throw new ApiError(400, "Incorrect OTP. Please try again.");

  booking.status = "started";
  await booking.save();
  emitToBooking(req, booking.id, "status_changed", { status: booking.status });
  res.json(booking.toJSON());
}

export async function completeBooking(req, res) {
  const { finalPrice } = req.body;
  if (finalPrice == null) throw new ApiError(400, "finalPrice is required");

  const booking = await loadOwnedBooking(
    req.params.id,
    "mechanic",
    req.user.id,
  );
  if (booking.status !== "started")
    throw new ApiError(400, "Service has not been started yet");

  booking.status = "completed";
  booking.finalPrice = Number(finalPrice);
  booking.paymentStatus = "pending";
  booking.completedAt = new Date();
  await booking.save();

  // Bump the mechanic's lifetime review count context (rating itself is
  // updated separately once the customer rates the job).
  emitToBooking(req, booking.id, "status_changed", {
    status: booking.status,
    finalPrice: booking.finalPrice,
  });
  res.json(booking.toJSON());
}

export async function submitPayment(req, res) {
  const { paymentMethod } = req.body;
  if (!["cash", "online"].includes(paymentMethod))
    throw new ApiError(400, "paymentMethod must be cash or online");

  const booking = await loadOwnedBooking(
    req.params.id,
    "customer",
    req.user.id,
  );
  if (booking.status !== "completed")
    throw new ApiError(400, "Booking is not completed yet");
  if (booking.paymentStatus !== "pending")
    throw new ApiError(400, "Payment has already been settled");

  booking.paymentMethod = paymentMethod;
  booking.paymentStatus = paymentMethod === "online" ? "paid" : "due";
  booking.paidAt = new Date();
  await booking.save();
  emitToBooking(req, booking.id, "payment_settled", {
    paymentStatus: booking.paymentStatus,
  });
  res.json(booking.toJSON());
}
// Mechanic confirms they received the cash from the customer.
export async function confirmCashReceived(req, res) {
  const booking = await loadOwnedBooking(
    req.params.id,
    "mechanic",
    req.user.id,
  );
  if (booking.status !== "completed")
    throw new ApiError(400, "Booking is not completed yet");
  if (booking.paymentMethod !== "cash" || booking.paymentStatus !== "due")
    throw new ApiError(400, "No cash payment is waiting for confirmation");

  booking.paymentStatus = "paid";
  booking.paidAt = new Date();
  await booking.save();
  emitToBooking(req, booking.id, "payment_settled", {
    paymentStatus: booking.paymentStatus,
  });
  res.json(booking.toJSON());
}

export async function submitRating(req, res) {
  const { rating, review } = req.body;
  if (!rating || rating < 1 || rating > 5)
    throw new ApiError(400, "rating must be between 1 and 5");

  const booking = await loadOwnedBooking(
    req.params.id,
    "customer",
    req.user.id,
  );
  if (booking.status !== "completed")
    throw new ApiError(400, "Booking is not completed yet");
  if (booking.rating != null)
    throw new ApiError(400, "This booking has already been rated");

  booking.rating = rating;
  booking.review = review || "";
  await booking.save();

  // Roll the new rating into the mechanic's running average.
  const mechanic = await Mechanic.findById(booking.mechanic);
  if (mechanic) {
    const totalScore = mechanic.rating * mechanic.reviewsCount + rating;
    mechanic.reviewsCount += 1;
    mechanic.rating = Number((totalScore / mechanic.reviewsCount).toFixed(2));
    await mechanic.save();
  }

  res.json(booking.toJSON());
}

export async function cancelBooking(req, res) {
  const booking = await loadOwnedBooking(
    req.params.id,
    "customer",
    req.user.id,
  );
  if (booking.status !== "requested")
    throw new ApiError(400, "Only a pending request can be cancelled");
  booking.status = "cancelled";
  await booking.save();
  emitToBooking(req, booking.id, "status_changed", { status: booking.status });
  res.json(booking.toJSON());
}

export async function getBookingById(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  const { id, role } = req.user;
  const isOwner =
    role === "admin" ||
    (role === "customer" && String(booking.customer) === String(id)) ||
    (role === "mechanic" && String(booking.mechanic) === String(id));
  if (!isOwner) throw new ApiError(403, "Not your booking");

  res.json(booking.toJSON());
}

export async function listCustomerBookings(req, res) {
  const bookings = await Booking.find({ customer: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(bookings.map((b) => b.toJSON()));
}

export async function listMechanicBookings(req, res) {
  const bookings = await Booking.find({ mechanic: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(bookings.map((b) => b.toJSON()));
}

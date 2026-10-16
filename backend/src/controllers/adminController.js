import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";
import Booking from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";

export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => u.toJSON()));
}

export async function listMechanics(req, res) {
  const mechanics = await Mechanic.find().sort({ createdAt: -1 });
  res.json(mechanics.map((m) => m.toJSON()));
}

export async function verifyMechanic(req, res) {
  const { verified } = req.body;
  const mechanic = await Mechanic.findByIdAndUpdate(
    req.params.id,
    { verified: Boolean(verified) },
    { new: true },
  );
  if (!mechanic) throw new ApiError(404, "Mechanic not found");
  res.json(mechanic.toJSON());
}

export async function listBookings(req, res) {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings.map((b) => b.toJSON()));
}

export async function listPayments(req, res) {
  const payments = await Booking.find({ status: "completed" }).sort({
    completedAt: -1,
  });
  res.json(payments.map((b) => b.toJSON()));
}

export async function getOverview(req, res) {
  const [userCount, mechanicCount, bookingCount, completedBookings] =
    await Promise.all([
      User.countDocuments(),
      Mechanic.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ status: "completed" }),
    ]);
  const revenue = completedBookings.reduce(
    (sum, b) => sum + (b.finalPrice || 0),
    0,
  );
  res.json({ userCount, mechanicCount, bookingCount, revenue });
}

import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import Mechanic from "../models/Mechanic.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function fileComplaint(req, res) {
  const { mechanicId, bookingId, subject, details } = req.body;
  if (!mechanicId || !subject)
    throw new ApiError(400, "mechanicId and subject are required");

  const [customer, mechanic] = await Promise.all([
    User.findById(req.user.id),
    Mechanic.findById(mechanicId),
  ]);
  if (!customer) throw new ApiError(404, "Customer not found");
  if (!mechanic) throw new ApiError(404, "Mechanic not found");

  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking || String(booking.customer) !== String(customer.id)) {
      throw new ApiError(403, "That booking does not belong to you");
    }
  }

  const complaint = await Complaint.create({
    from: customer.id,
    fromName: customer.name,
    against: mechanic.id,
    againstName: mechanic.name,
    booking: bookingId || undefined,
    subject,
    details,
  });
  res.status(201).json(complaint.toJSON());
}

export async function listComplaints(req, res) {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints.map((c) => c.toJSON()));
}

export async function resolveComplaint(req, res) {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: "resolved" },
    { new: true },
  );
  if (!complaint) throw new ApiError(404, "Complaint not found");
  res.json(complaint.toJSON());
}

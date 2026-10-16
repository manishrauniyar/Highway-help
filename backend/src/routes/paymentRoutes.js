import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import { requireAuth } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

async function ownedCompletedBooking(id, userId) {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking.customer) !== String(userId)) throw new ApiError(403, "Not your booking");
  if (booking.status !== "completed") throw new ApiError(400, "Booking is not completed yet");
  if (booking.paymentStatus !== "pending") throw new ApiError(400, "Payment has already been settled");
  return booking;
}

// Step 1: create a Razorpay order
router.post("/razorpay/order", requireAuth(["customer"]), async (req, res) => {
  const booking = await ownedCompletedBooking(req.body.bookingId, req.user.id);
  const order = await getRazorpay().orders.create({
    amount: Math.round(booking.finalPrice * 100), // paise
    currency: "INR",
    receipt: `bk_${booking.id}`,
  });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
});

// Step 2: verify the payment signature, then mark the booking paid
router.post("/razorpay/verify", requireAuth(["customer"]), async (req, res) => {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (expected !== razorpay_signature) throw new ApiError(400, "Payment verification failed");

  const booking = await ownedCompletedBooking(bookingId, req.user.id);
  booking.paymentMethod = "online";
  booking.paymentStatus = "paid";
  booking.paidAt = new Date();
  await booking.save();
  res.json(booking.toJSON());
});

export default router;
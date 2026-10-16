import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createBooking,
  acceptBooking,
  rejectBooking,
  updateStatus,
  verifyOtp,
  completeBooking,
  submitPayment,
  submitRating,
  cancelBooking,
  listCustomerBookings,
  listMechanicBookings,
  getBookingById,
} from "../controllers/bookingController.js";

const router = Router();

router.post("/", requireAuth(["customer"]), createBooking);
router.get("/customer", requireAuth(["customer"]), listCustomerBookings);
router.get("/mechanic", requireAuth(["mechanic"]), listMechanicBookings);
router.get("/:id", requireAuth(), getBookingById);

router.patch("/:id/accept", requireAuth(["mechanic"]), acceptBooking);
router.patch("/:id/reject", requireAuth(["mechanic"]), rejectBooking);
router.patch("/:id/status", requireAuth(["mechanic"]), updateStatus);
router.post("/:id/verify-otp", requireAuth(["mechanic"]), verifyOtp);
router.patch("/:id/complete", requireAuth(["mechanic"]), completeBooking);

router.post("/:id/payment", requireAuth(["customer"]), submitPayment);
router.post("/:id/rating", requireAuth(["customer"]), submitRating);
router.patch("/:id/cancel", requireAuth(["customer"]), cancelBooking);

export default router;

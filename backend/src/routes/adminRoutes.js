import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listUsers,
  listMechanics,
  verifyMechanic,
  listBookings,
  listPayments,
  getOverview,
} from "../controllers/adminController.js";
import {
  listComplaints,
  resolveComplaint,
} from "../controllers/complaintController.js";

const router = Router();
router.use(requireAuth(["admin"]));

router.get("/overview", getOverview);
router.get("/users", listUsers);
router.get("/mechanics", listMechanics);
router.patch("/mechanics/:id/verify", verifyMechanic);
router.get("/bookings", listBookings);
router.get("/payments", listPayments);
router.get("/complaints", listComplaints);
router.patch("/complaints/:id/resolve", resolveComplaint);

export default router;

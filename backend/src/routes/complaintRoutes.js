import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { fileComplaint } from "../controllers/complaintController.js";

const router = Router();
router.post("/", requireAuth(["customer"]), fileComplaint);
export default router;

import { Router } from "express";
import {
  registerCustomer,
  loginCustomer,
  registerMechanic,
  loginMechanic,
  loginAdmin,
  getMe,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.post("/mechanic/register", registerMechanic);
router.post("/mechanic/login", loginMechanic);
router.post("/admin/login", loginAdmin);
router.get("/me", requireAuth(), getMe);

export default router;

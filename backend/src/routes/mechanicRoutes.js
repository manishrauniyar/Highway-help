import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listMechanics,
  getMechanicById,
  getMyProfile,
  updateAvailability,
  updateLocation,
} from "../controllers/mechanicController.js";

const router = Router();

router.get("/", listMechanics);
router.get("/me/profile", requireAuth(["mechanic"]), getMyProfile);
router.patch("/me/availability", requireAuth(["mechanic"]), updateAvailability);
router.patch("/me/location", requireAuth(["mechanic"]), updateLocation);
router.get("/:id", getMechanicById);

export default router;

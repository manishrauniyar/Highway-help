import { Router } from "express";
import {
  listDistricts,
  getDistrictById,
} from "../controllers/districtController.js";

const router = Router();

router.get("/", listDistricts);
router.get("/:id", getDistrictById);

export default router;

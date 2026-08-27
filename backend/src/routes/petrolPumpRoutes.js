import { Router } from "express";
import { listPetrolPumps } from "../controllers/petrolPumpController.js";

const router = Router();
router.get("/", listPetrolPumps);
export default router;

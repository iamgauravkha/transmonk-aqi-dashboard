import express from "express";
import { getAverageData, getSensorData } from "../controllers/index.js";

const router = express.Router();

router.get("/sensor-data", getSensorData);
router.get("/average-data", getAverageData);

export default router;

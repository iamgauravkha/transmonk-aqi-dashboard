import express from "express";
import { getSensorData } from "../controllers/index.js";

const router = express.Router();

router.get("/sensor-data", getSensorData);

export default router;

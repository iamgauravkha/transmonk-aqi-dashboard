import express from "express";
import { getDeviceData, updateSettings } from "../controllers/index.js";

const router = express.Router();

router.get("/device-data/:id", getDeviceData);
router.post("/update-settings/:id", updateSettings);

export default router;

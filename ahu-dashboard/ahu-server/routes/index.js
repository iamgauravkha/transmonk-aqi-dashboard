import express from "express";
import {
  getDeviceData,
  updateBalanceAirFanAndValveSpeed,
  updateBalanceAirSettings,
  updateFanAndValveSpeed,
  updateSettings,
} from "../controllers/index.js";

const router = express.Router();

router.get("/device-data/:id", getDeviceData);

// for all devices except balance air
router.post("/update-settings/:id", updateSettings);

// for all devices except balance air
router.post("/update-fan-speed/:id", updateFanAndValveSpeed);

// for balance air
router.post("/update-ba-settings", updateBalanceAirSettings);

// for balance air
router.post("/update-ba-fan-speed", updateBalanceAirFanAndValveSpeed);

export default router;

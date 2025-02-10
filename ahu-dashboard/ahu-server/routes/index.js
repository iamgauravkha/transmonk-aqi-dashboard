import express from "express";
import { getDeviceData } from "../controllers/index.js";

const router = express.Router();

router.get("/device-data/:id", getDeviceData);

export default router;

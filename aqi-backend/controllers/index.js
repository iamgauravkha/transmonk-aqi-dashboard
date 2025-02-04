import sensorModel from "../models/sensor.js";

export const getSensorData = async (req, res) => {
  try {
    const data = await sensorModel.find({ deviceId: "TC-IOT0001" });
    res.json(data);
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

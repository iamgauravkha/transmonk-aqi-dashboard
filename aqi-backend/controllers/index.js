import sensorModel from "../models/sensor.js";
import averageModel from "../models/average.js";

export const getSensorData = async (req, res) => {
  try {
    const data = await sensorModel.find({ deviceId: "TC-IOT0001" });
    res.json(data);
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAverageData = async (req, res) => {
  try {
    const data = await averageModel
      .find({ deviceId: "TC-IOT0001" })
      .sort({ currentDay: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

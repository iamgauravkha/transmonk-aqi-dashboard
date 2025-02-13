import sensorModel from "../models/sensor.js";
import averageModel from "../models/average.js";

export const getSensorData = async (req, res) => {
  try {
    const data = await sensorModel.findOne({ deviceId: "TC-IOT0001" });
    if (!data) {
      return res.status(404).json({ error: "Device not found" });
    }
    // Extract latest values for each sensor
    const getLatestValue = (arr) =>
      arr?.length ? arr.sort((a, b) => b.timestamp - a.timestamp)[0] : null;
    
    const latestData = {
      deviceId: data.deviceId,
      cO2: getLatestValue(data.cO2),
      massConcentrationPm2p5: getLatestValue(data.massConcentrationPm2p5),
      massConcentrationPm10p0: getLatestValue(data.massConcentrationPm10p0),
      vocIndex: getLatestValue(data.vocIndex),
      ambientHumidity: getLatestValue(data.ambientHumidity),
      ambientTemperature: getLatestValue(data.ambientTemperature),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    res.json(latestData);
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

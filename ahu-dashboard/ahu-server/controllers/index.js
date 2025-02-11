import deviceModel from "../models/device.js";
import { mqttClient } from "../server.js";

export const getDeviceData = async (req, res) => {
  try {
    const data = await deviceModel.find({ deviceId: req.params.id });
    if (!data) {
      return res.status(404).json({ error: "Device not found" });
    }

    // Function to get the last element of an array
    const getLatestValue = (arr) => (arr?.length ? arr[arr.length - 1] : null);

    const latestData = {
      deviceId: data.deviceId,
      auto: getLatestValue(data.auto),
      setVoltOne: getLatestValue(data.setVoltOne),
      minVoltFan: getLatestValue(data.minVoltFan),
      manVoltFan: getLatestValue(data.manVoltFan),
      minTempOne: getLatestValue(data.minTempOne),
      maxTempOne: getLatestValue(data.maxTempOne),
      minTempTwo: getLatestValue(data.minTempTwo),
      maxTempTwo: getLatestValue(data.maxTempTwo),
      minVoltDamper: getLatestValue(data.minVoltDamper),
      maxVoltDamper: getLatestValue(data.maxVoltDamper),
      minCO2: getLatestValue(data.minCO2),
      maxCO2: getLatestValue(data.maxCO2),
      cO2: getLatestValue(data.cO2),
      dP: getLatestValue(data.dP),
      pM25: getLatestValue(data.pM25),
      pM10: getLatestValue(data.pM10),
      vocIndex: getLatestValue(data.vocIndex),
      ambientHumidity: getLatestValue(data.ambientHumidity),
      ambientTemperature: getLatestValue(data.ambientTemperature),
      avgTemperature: getLatestValue(data.avgTemperature),
      fanRPM: getLatestValue(data.fanRPM),
      fanACVoltage: getLatestValue(data.fanACVoltage),
      averageACC: getLatestValue(data.averageACC),
      setVoltTwo: getLatestValue(data.setVoltTwo),
      controlBy: getLatestValue(data.controlBy),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Device data fetched successfully",
      apiResponse: latestData,
    });
  } catch (err) {
    console.error("Error from 'getDeviceData' controller - ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      apiResponse: err,
    });
  }
};

export const updateDeviceData = async (req, res) => {
  try {
    const data = await deviceModel.find({ deviceId: req.params.id });
    if (!data) {
      return res.status(404).json({ error: "Device not found" });
    }

    // Function to get the last element of an array
    const getLatestValue = (arr) => (arr?.length ? arr[arr.length - 1] : null);

    const latestData = {
      deviceId: data.deviceId,
      auto: getLatestValue(data.auto),
      setVoltOne: getLatestValue(data.setVoltOne),
      minVoltFan: getLatestValue(data.minVoltFan),
      manVoltFan: getLatestValue(data.manVoltFan),
      minTempOne: getLatestValue(data.minTempOne),
      maxTempOne: getLatestValue(data.maxTempOne),
      minTempTwo: getLatestValue(data.minTempTwo),
      maxTempTwo: getLatestValue(data.maxTempTwo),
      minVoltDamper: getLatestValue(data.minVoltDamper),
      maxVoltDamper: getLatestValue(data.maxVoltDamper),
      minCO2: getLatestValue(data.minCO2),
      maxCO2: getLatestValue(data.maxCO2),
      cO2: getLatestValue(data.cO2),
      dP: getLatestValue(data.dP),
      pM25: getLatestValue(data.pM25),
      pM10: getLatestValue(data.pM10),
      vocIndex: getLatestValue(data.vocIndex),
      ambientHumidity: getLatestValue(data.ambientHumidity),
      ambientTemperature: getLatestValue(data.ambientTemperature),
      avgTemperature: getLatestValue(data.avgTemperature),
      fanRPM: getLatestValue(data.fanRPM),
      fanACVoltage: getLatestValue(data.fanACVoltage),
      averageACC: getLatestValue(data.averageACC),
      setVoltTwo: getLatestValue(data.setVoltTwo),
      controlBy: getLatestValue(data.controlBy),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Device data fetched successfully",
      apiResponse: latestData,
    });
  } catch (err) {
    console.error("Error from 'getDeviceData' controller - ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      apiResponse: err,
    });
  }
};

export const updateSettings = async (req, res) => {
  const {
    auto,
    minVoltFan,
    maxVoltFan,
    minTemp,
    maxTemp,
    minVoltDamper,
    maxVoltDamper,
    minCO2,
    maxCO2,
    controlBy,
  } = req.body;
  console.log("Request Body:", req.body);
  try {
    const topic = "transmonk/balanceair/site1/settings";
    const message = JSON.stringify({
      masterid: "1",
      deviceid: "1",
      type: "settings",
      Auto: auto,
      MinV_Fan: minVoltFan,
      MaxV_Fan: maxVoltFan,
      MinV_Dpr: minVoltDamper,
      MaxV_Dpr: maxVoltDamper,
      Min_temp1: minTemp,
      Max_temp1: maxTemp,
      Min_CO2: minCO2,
      Max_CO2: maxCO2,
      ctl: controlBy,
    });
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log(`Message sent to topic: ${topic}`);
      }
    });
    res.status(200).json({
      success: true,
      message: "Device settings updated successfully",
    });
  } catch (err) {
    console.error("Error from 'updateSettings' controller - ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      apiResponse: err,
    });
  }
};

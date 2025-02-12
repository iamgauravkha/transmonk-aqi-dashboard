import deviceModel from "../models/device.js";
import { mqttClient } from "../server.js";

export const getDeviceData = async (req, res) => {
  try {
    const data = await deviceModel.find({ deviceId: req.params.id });
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Device not found" });
    }

    // Function to get the last element of an array
    const getLatestValue = (arr) => (arr?.length ? arr[arr.length - 1] : null);

    const latestData = {
      deviceId: data.deviceId,
      auto: data.auto,
      setVoltOne: data.setVoltOne,
      minVoltFan: data.minVoltFan,
      manVoltFan: data.manVoltFan,
      minTempOne: data.minTempOne,
      maxTempOne: data.maxTempOne,
      minVoltDamper: data.minVoltDamper,
      maxVoltDamper: data.maxVoltDamper,
      minCO2: data.minCO2,
      maxCO2: data.maxCO2,
      cO2: getLatestValue(data.cO2),
      dP: data.dP,
      pM25: data.pM25,
      pM10: data.pM10,
      vocIndex: data.vocIndex,
      ambientHumidity: data.ambientHumidity,
      ambientTemperature: getLatestValue(data.ambientTemperature),
      avgTemperature: data.avgTemperature,
      fanRPM: data.fanRPM,
      fanACVoltage: data.fanACVoltage,
      averageACC: data.averageACC,
      setVoltTwo: data.setVoltTwo,
      controlBy: data.controlBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    console.log(data);

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

// for balance air only
export const updateBalanceAirFanAndValveSpeed = async (req, res) => {
  const { speedValue, valveValue } = req.body;
  try {
    const topic = "transmonk/balanceair/site1/command";
    const message = JSON.stringify({
      type: "command",
      speedpc: speedValue,
      damper: valveValue,
    });
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        res.status(500).json({
          success: true,
          message: "Something went wrong. Try again",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Device settings updated successfully",
        });
      }
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

// for any other device
export const updateFanAndValveSpeed = async (req, res) => {
  const { speedValue, valveValue } = req.body;
  try {
    const topic = "transmonk/hvac/demo/command";
    const message = JSON.stringify({
      deviceid: req.params.id,
      type: "command",
      speedpc: speedValue,
      damper: valveValue,
    });
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        res.status(500).json({
          success: true,
          message: "Something went wrong. Try again",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Device settings updated successfully",
        });
      }
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

// for balance air only
export const updateBalanceAirSettings = async (req, res) => {
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
  try {
    const topic = "transmonk/balanceair/site1/settings";
    const message = JSON.stringify({
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
        res.status(500).json({
          success: true,
          message: "Something went wrong. Try again",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Device settings updated successfully",
        });
      }
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

// for any other device
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
  try {
    const topic = "transmonk/hvac/demo/settings";
    const message = JSON.stringify({
      masterid: "1",
      deviceid: req.params.id,
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
        res.status(500).json({
          success: true,
          message: "Something went wrong. Try again",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Device settings updated successfully",
        });
      }
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

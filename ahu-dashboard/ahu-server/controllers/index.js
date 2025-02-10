import deviceModel from "../models/device.js";

export const getDeviceData = async (req, res) => {
  try {
    const data = await deviceModel.find({ deviceId: req.params.id });
    res.status(200).json({
      success: true,
      message: "Device data fetched successfully",
      apiResponse: data,
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

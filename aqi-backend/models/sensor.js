import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true },
    cO2: [{ value: Number, timestamp: Date }],
    massConcentrationPm2p5: [{ value: Number, timestamp: Date }],
    massConcentrationPm10p0: [{ value: Number, timestamp: Date }],
    vocIndex: [{ value: Number, timestamp: Date }],
    ambientHumidity: [{ value: Number, timestamp: Date }],
    ambientTemperature: [{ value: Number, timestamp: Date }],
    timestamps: [{ type: Date }],
  },
  {
    timestamps: true,
  }
);

const deviceModel = mongoose.model("device", deviceSchema);

export default deviceModel;

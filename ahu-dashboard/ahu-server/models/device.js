import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true },
    auto: Number,
    setVoltOne: Number,
    minVoltFan: Number,
    maxVoltFan: Number,
    minTempOne: Number,
    maxTempOne: Number,
    minVoltDamper: Number,
    maxVoltDamper: Number,
    minCO2: Number,
    maxCO2: Number,
    cO2: [{ value: Number, timestamp: Date }],
    dP: Number,
    pM25: Number,
    pM10: Number,
    vocIndex: Number,
    ambientHumidity: Number,
    ambientTemperature: [{ value: Number, timestamp: Date }],
    avgTemperature: Number,
    fanRPM: Number,
    fanACVoltage: Number,
    averageACC: Number,
    setVoltTwo: Number,
    controlBy: Number,
  },
  {
    timestamps: true,
  }
);

const deviceModel = mongoose.model("device", deviceSchema);

export default deviceModel;

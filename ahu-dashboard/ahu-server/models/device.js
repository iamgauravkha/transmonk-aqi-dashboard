import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true },
    auto: [{ value: Number, timestamp: Date }],
    // setVoltOne: [{ value: Number, timestamp: Date }], //fan speed and fan capicity
    minVoltFan: [{ value: Number, timestamp: Date }], // valve
    maxVoltFan: [{ value: Number, timestamp: Date }],
    minTempOne: [{ value: Number, timestamp: Date }],
    maxTempOne: [{ value: Number, timestamp: Date }],
    // minTempTwo: [{ value: Number, timestamp: Date }],
    // maxTempTwo: [{ value: Number, timestamp: Date }],
    minVoltDamper: [{ value: Number, timestamp: Date }],
    maxVoltDamper: [{ value: Number, timestamp: Date }],
    minCO2: [{ value: Number, timestamp: Date }],
    maxCO2: [{ value: Number, timestamp: Date }],
    cO2: [{ value: Number, timestamp: Date }],
    dP: [{ value: Number, timestamp: Date }], //presuuure
    pM25: [{ value: Number, timestamp: Date }],
    pM10: [{ value: Number, timestamp: Date }],
    vocIndex: [{ value: Number, timestamp: Date }],
    ambientHumidity: [{ value: Number, timestamp: Date }], // rh
    ambientTemperature: [{ value: Number, timestamp: Date }], //temp
    avgTemperature: [{ value: Number, timestamp: Date }],
    fanRPM: [{ value: Number, timestamp: Date }], //fan rpm
    fanACVoltage: [{ value: Number, timestamp: Date }],
    averageACC: [{ value: Number, timestamp: Date }],
    setVoltTwo: [{ value: Number, timestamp: Date }],
    controlBy: [{ value: Number, timestamp: Date }],
  },
  {
    timestamps: true,
  }
);

const deviceModel = mongoose.model("device", deviceSchema);

export default deviceModel;

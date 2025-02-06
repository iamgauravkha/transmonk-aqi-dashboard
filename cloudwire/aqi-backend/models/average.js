import mongoose from "mongoose";

const averageSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    currentDay: { type: String, required: true }, // YYYY-MM-DD format
    hours: [
      {
        hour: Number, // 0-23
        cO2: Number,
        massConcentrationPm2p5: Number,
        massConcentrationPm10p0: Number,
        vocIndex: Number,
        ambientHumidity: Number,
        ambientTemperature: Number,
      },
    ],
  },
  { timestamps: true }
);

const AverageModel = mongoose.model("Average", averageSchema);

export default AverageModel;

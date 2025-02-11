import mongoose from "mongoose";

const averageSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    currentDay: { type: String, required: true }, // YYYY-MM-DD format
    hours: [
      {
        hour: Number, // 0-23
        // ...
        sensorName: Number,
        // ...
      },
    ],
  },
  { timestamps: true }
);

const AverageModel = mongoose.model("Average", averageSchema);

export default AverageModel;

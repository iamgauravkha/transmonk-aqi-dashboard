import mongoose from "mongoose";

const minuteDataSchema = new mongoose.Schema({
  minute: Number, // 0-59
  cO2: Number,
  massConcentrationPm2p5: Number,
  massConcentrationPm10p0: Number,
  vocIndex: Number,
  ambientHumidity: Number,
  ambientTemperature: Number,
});

const minuteWiseDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  date: { type: Date, required: true },
  minutes: [minuteDataSchema], // Stores 60 entries per hour
});

const minuteWiseData = mongoose.model("minuteWiseData", minuteWiseDataSchema);
export default minuteWiseData;

import mongoose from "mongoose";

const daywiseEntriesSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Stores date in YYYY-MM-DD
  hourlyData: [
    {
      timestamp: { type: Date, required: true },
      avgCO2: Number,
      avgPm2p5: Number,
      avgPm10p0: Number,
      avgvocIndex: Number,
      avgTemp: Number,
      avgHumidity: Number,
      // avgFanRPM: Number,
    },
  ],
});
export default mongoose.model("daywiseEntries", daywiseEntriesSchema);

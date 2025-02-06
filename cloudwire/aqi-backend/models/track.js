import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    average: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const trackModel = mongoose.model("track", trackingSchema);

export default trackModel;

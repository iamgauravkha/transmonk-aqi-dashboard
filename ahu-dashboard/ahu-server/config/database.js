import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    process.env.DEV_MODE === "active" && console.log("Database connected.");
  } catch (error) {
    process.env.DEV_MODE === "active" &&
      console.log("Database connection failed.");
    process.env.DEV_MODE === "active" && console.error(error);
  }
};

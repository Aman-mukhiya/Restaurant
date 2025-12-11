import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Connected to DB successfully!!!");
  } catch (error) {
    console.error("Something went wrong while connecting to DB", error);
    process.exit(1);
  }
};

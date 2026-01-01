import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // If already connected, no need to reconnect
  if (isConnected) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    // MongoDB connection options
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB,
    });
    isConnected = true;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed.");
  }
};

export default connectDB;

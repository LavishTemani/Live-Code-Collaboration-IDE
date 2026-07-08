const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("No MONGO_URI provided. Skipping MongoDB connection in development.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

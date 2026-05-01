import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;

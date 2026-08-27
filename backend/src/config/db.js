import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

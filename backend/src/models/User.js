import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    vehicle: {
      type: String,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer"],
      default: "customer",
    },
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
  }
);

export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    workshop: {
      type: String,
      trim: true,
    },

    photo: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    services: [
      {
        type: String,
      },
    ],

    vehicleTypes: [
      {
        type: String,
        enum: ["bike", "car"],
      },
    ],

    districtId: {
      type: String,
      ref: "District",
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    price: {
      min: {
        type: Number,
        default: 100,
      },

      max: {
        type: Number,
        default: 1000,
      },
    },

    available: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    role: {
      type: String,
      default: "mechanic",
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
  }
);

export default mongoose.model("Mechanic", mechanicSchema);
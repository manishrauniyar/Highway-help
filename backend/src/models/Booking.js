import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

export const STATUS_FLOW = [
  "requested",
  "accepted",
  "onway",
  "arrived",
  "started",
  "completed",
];

export const STATUSES = [
  ...STATUS_FLOW,
  "cancelled",
  "rejected",
];

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
    },

    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },

    mechanicName: {
      type: String,
      required: true,
    },

    mechanicPhoto: {
      type: String,
    },

    mechanicPhone: {
      type: String,
    },

    serviceType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: STATUSES,
      default: "requested",
    },

    otp: {
      type: String,
      required: true,
    },

    locationLabel: {
      type: String,
    },

    customerLocation: {
      lat: Number,
      lng: Number,
    },

    distanceKm: {
      type: Number,
    },

    etaMin: {
      type: Number,
    },

    price: {
      min: Number,
      max: Number,
    },

    finalPrice: {
      type: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "due", "paid"],
      default: "pending",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
    },

    acceptedAt: Date,
    completedAt: Date,
    paidAt: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: true,
    },
    toJSON: toJSONOptions,
  }
);

bookingSchema.index({
  customer: 1,
  createdAt: -1,
});

bookingSchema.index({
  mechanic: 1,
  createdAt: -1,
});

export default mongoose.model("Booking", bookingSchema);
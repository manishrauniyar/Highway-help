import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

const complaintSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fromName: {
      type: String,
      required: true,
    },

    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },

    againstName: {
      type: String,
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    subject: {
      type: String,
      required: true,
    },

    details: {
      type: String,
    },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: false,
    },
    toJSON: toJSONOptions,
  }
);

export default mongoose.model("Complaint", complaintSchema);
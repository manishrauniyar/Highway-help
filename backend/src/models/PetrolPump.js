import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

const petrolPumpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
    },

    distanceKm: {
      type: Number,
    },

    address: {
      type: String,
    },

    open24Hours: {
      type: Boolean,
      default: false,
    },

    fuels: [
      {
        type: String,
      },
    ],

    districtId: {
      type: String,
      ref: "District",
    },
  },
  {
    toJSON: toJSONOptions,
  }
);

export default mongoose.model("PetrolPump", petrolPumpSchema);
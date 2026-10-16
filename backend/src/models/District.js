import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

const districtSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },

    name: {
      type: String,
      required: true,
    },

    highways: [
      {
        type: String,
      },
    ],
  },
  {
    toJSON: toJSONOptions,
  }
);

export default mongoose.model("District", districtSchema);
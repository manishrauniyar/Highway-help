import mongoose from "mongoose";
import { toJSONOptions } from "../utils/schemaHelpers.js";

const serviceSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    icon: { type: String },
    desc: { type: String },
  },
  { toJSON: toJSONOptions },
);

export default mongoose.model("Service", serviceSchema);

import District from "../models/District.js";
import { ApiError } from "../utils/ApiError.js";

export async function listDistricts(req, res) {
  const districts = await District.find().sort({ name: 1 });
  res.json(districts.map((d) => d.toJSON()));
}

export async function getDistrictById(req, res) {
  const district = await District.findById(req.params.id);
  if (!district) throw new ApiError(404, "District not found");
  res.json(district.toJSON());
}

import Mechanic from "../models/Mechanic.js";
import { ApiError } from "../utils/ApiError.js";

// Haversine distance in km — used when the customer's lat/lng is supplied,
// so "nearby" is computed for real instead of relying on a static mock number.
function distanceKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some((v) => v == null)) return null;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export async function listMechanics(req, res) {
  const { service, vehicleType, districtId, highway, available, lat, lng } =
    req.query;

  const filter = { verified: true };
  if (service) filter.services = service;
  if (vehicleType) filter.vehicleTypes = vehicleType;
  if (districtId) filter.districtId = districtId;
  if (available === "true") filter.available = true;

  let mechanics = await Mechanic.find(filter).limit(100);

  if (highway) {
    // Highway lives on the District document, not the mechanic, so filter
    // in memory against the small set already returned.
    const District = (await import("../models/District.js")).default;
    const matchingDistricts = await District.find({ highways: highway }).select(
      "_id",
    );
    const ids = new Set(matchingDistricts.map((d) => d._id));
    mechanics = mechanics.filter((m) => ids.has(m.districtId));
  }

  const userLat = lat ? Number(lat) : null;
  const userLng = lng ? Number(lng) : null;

  const withDistance = mechanics.map((m) => {
    const json = m.toJSON();
    if (userLat != null && userLng != null && m.location?.lat != null) {
      json.distanceKm = Number(
        distanceKm(userLat, userLng, m.location.lat, m.location.lng).toFixed(1),
      );
    }
    return json;
  });

  withDistance.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  res.json(withDistance);
}

export async function getMechanicById(req, res) {
  const mechanic = await Mechanic.findById(req.params.id);
  if (!mechanic) throw new ApiError(404, "Mechanic not found");
  res.json(mechanic.toJSON());
}

export async function getMyProfile(req, res) {
  const mechanic = await Mechanic.findById(req.user.id);
  if (!mechanic) throw new ApiError(404, "Mechanic not found");
  res.json(mechanic.toJSON());
}

export async function updateAvailability(req, res) {
  const { available } = req.body;
  const mechanic = await Mechanic.findByIdAndUpdate(
    req.user.id,
    { available: Boolean(available) },
    { new: true },
  );
  if (!mechanic) throw new ApiError(404, "Mechanic not found");
  res.json(mechanic.toJSON());
}

export async function updateLocation(req, res) {
  const { lat, lng } = req.body;
  if (lat == null || lng == null)
    throw new ApiError(400, "lat and lng are required");
  const mechanic = await Mechanic.findByIdAndUpdate(
    req.user.id,
    { location: { lat, lng } },
    { new: true },
  );
  if (!mechanic) throw new ApiError(404, "Mechanic not found");
  res.json(mechanic.toJSON());
}

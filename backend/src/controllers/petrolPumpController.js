import PetrolPump from "../models/PetrolPump.js";

export async function listPetrolPumps(req, res) {
  const { districtId } = req.query;
  const filter = districtId ? { districtId } : {};
  const pumps = await PetrolPump.find(filter).sort({ distanceKm: 1 });
  res.json(pumps.map((p) => p.toJSON()));
}

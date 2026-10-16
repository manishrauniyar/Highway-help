import Service from "../models/Service.js";

export async function listServices(req, res) {
  const services = await Service.find();
  res.json(services.map((s) => s.toJSON()));
}

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";
import { signToken } from "../utils/token.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export async function registerCustomer(req, res) {
  const { name, email, phone, vehicle, password } = req.body;
  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "name, email, phone and password are required");
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, vehicle, passwordHash });
  const token = signToken({ id: user.id, role: "customer" });
  res.status(201).json({ token, user: user.toJSON() });
}

export async function loginCustomer(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(401, "Invalid credentials");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const token = signToken({ id: user.id, role: "customer" });
  res.json({ token, user: user.toJSON() });
}

export async function registerMechanic(req, res) {
  const {
    name,
    phone,
    workshop,
    services,
    vehicleTypes,
    districtId,
    password,
  } = req.body;
  if (!name || !phone || !password) {
    throw new ApiError(400, "name, phone and password are required");
  }
  const existing = await Mechanic.findOne({ phone });
  if (existing) throw new ApiError(409, "Phone number already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const mechanic = await Mechanic.create({
    name,
    phone,
    workshop,
    services: services || [],
    vehicleTypes: vehicleTypes || [],
    districtId,
    passwordHash,
    verified: false,
    available: false,
  });
  const token = signToken({ id: mechanic.id, role: "mechanic" });
  res.status(201).json({ token, mechanic: mechanic.toJSON() });
}

export async function loginMechanic(req, res) {
  const { phone, password } = req.body;
  if (!phone || !password)
    throw new ApiError(400, "phone and password are required");

  const mechanic = await Mechanic.findOne({ phone });
  if (!mechanic) throw new ApiError(401, "Invalid credentials");
  const valid = await bcrypt.compare(password, mechanic.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const token = signToken({ id: mechanic.id, role: "mechanic" });
  res.json({ token, mechanic: mechanic.toJSON() });
}

export async function loginAdmin(req, res) {
  const { email, password } = req.body;
  if (email !== env.adminEmail || password !== env.adminPassword) {
    throw new ApiError(401, "Invalid admin credentials");
  }
  const token = signToken({ id: "admin", role: "admin" });
  res.json({
    token,
    admin: { id: "admin", name: "Admin", email, role: "admin" },
  });
}

export async function getMe(req, res) {
  const { id, role } = req.user;
  if (role === "customer") {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return res.json({ role, user: user.toJSON() });
  }
  if (role === "mechanic") {
    const mechanic = await Mechanic.findById(id);
    if (!mechanic) throw new ApiError(404, "Mechanic not found");
    return res.json({ role, mechanic: mechanic.toJSON() });
  }
  return res.json({ role, id });
}

import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";

import District from "../models/District.js";
import Service from "../models/Service.js";
import Mechanic from "../models/Mechanic.js";
import User from "../models/User.js";
import PetrolPump from "../models/PetrolPump.js";
import Complaint from "../models/Complaint.js";

import { districtsData } from "./districtsData.js";

const servicesData = [
  {
    _id: "bike-repair",
    name: "Bike Repair",
    icon: "bike",
    desc: "On-spot two-wheeler fixes",
  },
  {
    _id: "car-repair",
    name: "Car Repair",
    icon: "car",
    desc: "Engine, brake & general repair",
  },
  {
    _id: "battery",
    name: "Battery",
    icon: "battery",
    desc: "Jumpstart or replacement",
  },
  {
    _id: "puncture",
    name: "Puncture",
    icon: "puncture",
    desc: "Quick puncture fixing",
  },
  {
    _id: "tyre",
    name: "Tyre",
    icon: "tyre",
    desc: "Tyre change & replacement",
  },
  {
    _id: "towing",
    name: "Towing",
    icon: "towing",
    desc: "Flatbed & winch towing",
  },
];

// Demo login password for every seeded mechanic and customer.
const DEMO_PASSWORD = "password123";

const mechanicsData = [
  {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    photo: "https://i.pravatar.cc/150?img=51",
    rating: 4.8,
    reviewsCount: 214,
    available: true,
    verified: true,
    experienceYears: 9,
    services: ["Bike Repair", "Battery", "Puncture"],
    vehicleTypes: ["bike"],
    location: { lat: 26.7606, lng: 83.3732 },
    districtId: "gorakhpur",
    price: { min: 150, max: 600 },
  },
  {
    name: "Suresh Yadav",
    phone: "+91 91234 56789",
    photo: "https://i.pravatar.cc/150?img=12",
    rating: 4.6,
    reviewsCount: 168,
    available: true,
    verified: true,
    experienceYears: 6,
    services: ["Car Repair", "Battery", "Tyre"],
    vehicleTypes: ["car"],
    location: { lat: 26.755, lng: 83.38 },
    districtId: "gorakhpur",
    price: { min: 300, max: 1500 },
  },
  {
    name: "Amit Verma",
    phone: "+91 90000 11223",
    photo: "https://i.pravatar.cc/150?img=33",
    rating: 4.9,
    reviewsCount: 342,
    available: true,
    verified: true,
    experienceYears: 12,
    services: ["Towing", "Car Repair", "Tyre"],
    vehicleTypes: ["car", "bike"],
    location: { lat: 26.8467, lng: 80.9462 },
    districtId: "lucknow",
    price: { min: 500, max: 3000 },
  },
  {
    name: "Vikram Singh",
    phone: "+91 98888 77665",
    photo: "https://i.pravatar.cc/150?img=15",
    rating: 4.3,
    reviewsCount: 89,
    available: false,
    verified: true,
    experienceYears: 4,
    services: ["Bike Repair", "Puncture", "Tyre"],
    vehicleTypes: ["bike"],
    location: { lat: 26.77, lng: 83.365 },
    districtId: "gorakhpur",
    price: { min: 100, max: 500 },
  },
  {
    name: "Deepak Chauhan",
    phone: "+91 97777 66554",
    photo: "https://i.pravatar.cc/150?img=60",
    rating: 4.7,
    reviewsCount: 256,
    available: true,
    verified: true,
    experienceYears: 8,
    services: ["Battery", "Car Repair", "Towing"],
    vehicleTypes: ["car"],
    location: { lat: 25.3176, lng: 82.9739 },
    districtId: "varanasi",
    price: { min: 250, max: 2000 },
  },
  {
    name: "Rajeev Tiwari",
    phone: "+91 96000 12233",
    photo: "https://i.pravatar.cc/150?img=8",
    rating: 4.5,
    reviewsCount: 132,
    available: true,
    verified: true,
    experienceYears: 7,
    services: ["Car Repair", "Tyre", "Towing"],
    vehicleTypes: ["car"],
    location: { lat: 27.1767, lng: 78.0081 },
    districtId: "agra",
    price: { min: 300, max: 2500 },
  },
  {
    name: "Sanjay Pandey",
    phone: "+91 95555 44332",
    photo: "https://i.pravatar.cc/150?img=22",
    rating: 4.4,
    reviewsCount: 97,
    available: true,
    verified: true,
    experienceYears: 5,
    services: ["Bike Repair", "Battery", "Puncture"],
    vehicleTypes: ["bike"],
    location: { lat: 26.4499, lng: 80.3319 },
    districtId: "kanpur-nagar",
    price: { min: 150, max: 700 },
  },
  {
    name: "Manoj Dubey",
    phone: "+91 94444 33221",
    photo: "https://i.pravatar.cc/150?img=45",
    rating: 4.8,
    reviewsCount: 178,
    available: true,
    verified: true,
    experienceYears: 10,
    services: ["Car Repair", "Battery", "Towing", "Tyre"],
    vehicleTypes: ["car", "bike"],
    location: { lat: 25.4358, lng: 81.8463 },
    districtId: "prayagraj",
    price: { min: 250, max: 2800 },
  },
];

const customersData = [
  {
    name: "Aditya Sharma",
    email: "aditya@example.com",
    phone: "+91 90011 22334",
    vehicle: "Bike - Pulsar 150",
  },
  {
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 90022 33445",
    vehicle: "Car - Swift",
  },
  {
    name: "Rohit Gupta",
    email: "rohit@example.com",
    phone: "+91 90033 44556",
    vehicle: "Bike - Activa",
  },
];

const petrolPumpsData = [
  {
    name: "Indian Oil - NH27 Highway Point",
    brand: "Indian Oil",
    distanceKm: 1.8,
    address: "NH27, Near Turkmanpur",
    open24Hours: true,
    fuels: ["Petrol", "Diesel"],
    districtId: "gorakhpur",
  },
  {
    name: "HP Petrol Pump - Golghar",
    brand: "HP",
    distanceKm: 2.6,
    address: "Golghar Main Road",
    open24Hours: false,
    fuels: ["Petrol", "Diesel", "CNG"],
    districtId: "gorakhpur",
  },
  {
    name: "Bharat Petroleum - City Center",
    brand: "Bharat Petroleum",
    distanceKm: 3.4,
    address: "Civil Lines",
    open24Hours: true,
    fuels: ["Petrol", "Diesel"],
    districtId: "gorakhpur",
  },
  {
    name: "Shell - Bypass Road",
    brand: "Shell",
    distanceKm: 4.1,
    address: "Bypass Road Junction",
    open24Hours: true,
    fuels: ["Petrol", "Diesel"],
    districtId: "gorakhpur",
  },
];

async function seed() {
  await connectDB();
  console.log("Connected. Seeding...");

  await Promise.all([
    District.deleteMany({}),
    Service.deleteMany({}),
    Mechanic.deleteMany({}),
    User.deleteMany({}),
    PetrolPump.deleteMany({}),
    Complaint.deleteMany({}),
  ]);

  await District.insertMany(districtsData);
  console.log(`Seeded ${districtsData.length} districts`);

  await Service.insertMany(servicesData);
  console.log(`Seeded ${servicesData.length} services`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const mechanics = await Mechanic.insertMany(
    mechanicsData.map((m) => ({ ...m, passwordHash })),
  );
  console.log(`Seeded ${mechanics.length} mechanics`);

  const users = await User.insertMany(
    customersData.map((c) => ({ ...c, passwordHash })),
  );
  console.log(`Seeded ${users.length} customers`);

  await PetrolPump.insertMany(petrolPumpsData);
  console.log(`Seeded ${petrolPumpsData.length} petrol pumps`);

  const complaints = [
    {
      fromName: "Aditya Sharma",
      againstName: "Vikram Singh",
      subject: "Arrived late without update",
      status: "open",
    },
    {
      fromName: "Priya Singh",
      againstName: "Suresh Yadav",
      subject: "Overcharged for battery jumpstart",
      status: "resolved",
    },
    {
      fromName: "Rohit Gupta",
      againstName: "Ramesh Kumar",
      subject: "Mechanic was courteous, minor delay",
      status: "open",
    },
  ];
  const byName = (arr, name) => arr.find((x) => x.name === name);
  await Complaint.insertMany(
    complaints.map((c) => ({
      from: byName(users, c.fromName).id,
      fromName: c.fromName,
      against: byName(mechanics, c.againstName).id,
      againstName: c.againstName,
      subject: c.subject,
      status: c.status,
    })),
  );
  console.log(`Seeded ${complaints.length} complaints`);

  console.log(
    "\nDemo login password for all seeded customers & mechanics:",
    DEMO_PASSWORD,
  );
  console.log("Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

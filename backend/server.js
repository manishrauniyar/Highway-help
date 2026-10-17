import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { registerSockets } from "./src/sockets/index.js";

import authRoutes from "./src/routes/authRoutes.js";
import mechanicRoutes from "./src/routes/mechanicRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import districtRoutes from "./src/routes/districtRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import petrolPumpRoutes from "./src/routes/petrolPumpRoutes.js";
import complaintRoutes from "./src/routes/complaintRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import mapRoutes from "./src/routes/mapRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";


const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
if (env.nodeEnv !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/petrol-pumps", petrolPumpRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.clientUrl, credentials: true },
});
app.set("io", io);
registerSockets(io);

async function start() {
  await connectDB();
  server.listen(env.port, () => {
    console.log(`Highway-help API running on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

// GET /api/maps/route?fromLat=..&fromLng=..&toLat=..&toLng=..
router.get("/route", requireAuth(), async (req, res) => {
  const { fromLat, fromLng, toLat, toLng } = req.query;
  const [a, b, c, d] = [fromLat, fromLng, toLat, toLng].map(Number);
  if ([a, b, c, d].some(Number.isNaN))
    throw new ApiError(400, "fromLat, fromLng, toLat and toLng are required");
  if (!process.env.GOOGLE_MAPS_SERVER_KEY)
    throw new ApiError(500, "Maps is not configured on the server");

  const r = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_SERVER_KEY,
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: a, longitude: b } } },
      destination: { location: { latLng: { latitude: c, longitude: d } } },
      travelMode: "DRIVE",
    }),
  });
  if (!r.ok) throw new ApiError(502, "Could not get the route from Google");
  const route = (await r.json()).routes?.[0];
  if (!route) throw new ApiError(404, "No route found");

  res.json({
    distanceKm: Number((route.distanceMeters / 1000).toFixed(1)),
    durationMin: Math.max(1, Math.round(parseInt(route.duration, 10) / 60)),
    polyline: route.polyline?.encodedPolyline || null,
  });
});

export default router;

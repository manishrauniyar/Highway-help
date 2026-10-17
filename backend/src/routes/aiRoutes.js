import { Router } from "express";
import Service from "../models/Service.js";
import { requireAuth } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

// Very small in-memory rate limit: 8 questions per user per minute.
const hits = new Map();
function allowed(userId) {
  const now = Date.now();
  const recent = (hits.get(userId) || []).filter((t) => now - t < 60000);
  if (recent.length >= 8) return false;
  recent.push(now);
  hits.set(userId, recent);
  return true;
}

// POST /api/ai/diagnose  { description: "my bike will not start..." }
router.post("/diagnose", requireAuth(["customer"]), async (req, res) => {
  const description = String(req.body.description || "").trim().slice(0, 500);
  if (description.length < 5)
    throw new ApiError(400, "Please describe the problem in a few words");
  if (!process.env.GEMINI_API_KEY)
    throw new ApiError(500, "AI is not configured on the server");
  if (!allowed(req.user.id))
    throw new ApiError(429, "Too many questions. Please try again in a minute.");

  const services = await Service.find().lean();
  const list = services.map((s) => `${s._id} = ${s.name}`).join("\n");
  const system =
    "You are a roadside vehicle breakdown assistant for Indian highways. " +
    "Read the driver's description and reply ONLY with JSON in this shape: " +
    '{"serviceId": "<one id from the list>", "urgency": "low|medium|high", ' +
    '"likelyIssue": "<short sentence>", "tips": ["<up to 3 short safety or quick-check tips>"], ' +
    '"callEmergency": <true only for accident, injury or fire>}. ' +
    "Never give dangerous repair instructions. Services:\n" + list;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: description }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      }),
    },
  );
  if (!r.ok) throw new ApiError(502, "The AI service is not available right now");

  const data = await r.json();
  let out;
  try {
    out = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
  } catch {
    throw new ApiError(502, "The AI gave an unreadable answer. Please try again.");
  }

  const svc = services.find((s) => s._id === out.serviceId);
  res.json({
    serviceId: svc?._id || null,
    serviceName: svc?.name || null,
    urgency: ["low", "medium", "high"].includes(out.urgency) ? out.urgency : "medium",
    likelyIssue: String(out.likelyIssue || "").slice(0, 200),
    tips: Array.isArray(out.tips) ? out.tips.slice(0, 3).map((t) => String(t).slice(0, 200)) : [],
    callEmergency: Boolean(out.callEmergency),
  });
});

export default router;

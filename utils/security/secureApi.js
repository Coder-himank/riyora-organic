
import { rateLimit } from "@/utils/security/rateLimit";
import connectDB from "@/server/db";

export function validateOrigin(req, allowedOrigin) {
  if (!allowedOrigin) return true;

  const origin = req.headers.origin || req.headers.referer || "";

  const normalize = (url) =>
    String(url).replace(/\/$/, "").replace(/^https?:\/\/(www\.)?/, "");

  return normalize(origin) === normalize(allowedOrigin);
}

export async function setupBase(req, res, key, points = 20, duration = 60) {
  await connectDB();
  await rateLimit(req, res, { key, points, duration });
}
// NOTE: For production, use Redis-based rate limiting.
// This is a simple per-process fallback.

const buckets = new Map();

export async function rateLimit(req, res, { key, points = 30, duration = 60 }) {
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString();
    const bucketKey = `${key}:${ip}`;
    const now = Date.now();

    let bucket = buckets.get(bucketKey);
    if (!bucket || bucket.reset < now) {
        bucket = { remaining: points, reset: now + duration * 1000 };
    }

    bucket.remaining -= 1;
    buckets.set(bucketKey, bucket);

    if (bucket.remaining < 0) {
        const retry = Math.ceil((bucket.reset - now) / 1000);
        res.setHeader("Retry-After", String(retry));
        throw res.status(429).json({ error: "Too many requests. Please slow down." });
    }
}

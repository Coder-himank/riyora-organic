// pages/api/secure/feedback.js

import connectDB from "@/server/db";
import Feedback from "@/server/models/Feedback";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    /** ✅ Step 1: Authenticate user via session (optional for guests) */
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || null;

    /** ✅ Step 2: Rate limit (max 5 feedbacks per 5 min per IP or user) */
    await rateLimit(req, res, {
      key: `feedback-${userId || req.headers["x-forwarded-for"] || "guest"}`,
      points: 5,
      duration: 300,
    });

    /** ✅ Step 3: Validate and sanitize input */
    const { name, email, message } = req.body || {};

    const safeName = String(name || "").trim().slice(0, 100);
    const safeEmail = String(email || userEmail || "").trim().toLowerCase();
    const safeMessage = String(message || "").trim().slice(0, 2000);

    if (!safeName || !safeEmail || !safeMessage) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    /** ✅ Step 4: Create and save feedback securely */
    const feedback = new Feedback({
      userId,
      name: safeName,
      email: safeEmail,
      message: safeMessage,
      createdAt: new Date(),
    });

    await feedback.save();

    /** ✅ Step 5: Respond cleanly */
    return res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Feedback API Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}

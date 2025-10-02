// pages/api/send-otp.js
import redis from "@/server/redis";
import { sendSms } from "@/server/twilio";

/**
 * API Route: Send OTP via SMS
 *
 * Flow:
 *  - Validates phone and countryCode
 *  - Prevents repeated requests using cooldown
 *  - Generates and stores OTP in Redis with expiry
 *  - Sends OTP via Twilio SMS
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { phone, countryCode } = req.body;

  // Validate input
  if (!phone || !countryCode) {
    return res.status(400).json({ success: false, message: "Phone and country code are required" });
  }

  const redisKey = `otp:${countryCode}${phone}`;
  const cooldownKey = `otpCooldown:${countryCode}${phone}`;

  try {
    // Enforce cooldown: block new OTP requests if one was recently sent
    const cooldown = await redis.get(cooldownKey);
    if (cooldown) {
      return res.status(429).json({
        success: false,
        message: "OTP recently sent. Please wait before requesting again."
      });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP with a 5-minute expiry
    await redis.set(redisKey, otp, "EX", 300);

    // Store cooldown flag with a 1-minute expiry
    await redis.set(cooldownKey, "true", "EX", 25);

    // Send SMS via Twilio
    await sendSms(`+${countryCode}${phone}`, `Your OTP is ${otp}`);

    return res.status(200).json({ success: true, message: "OTP sent successfully", otp  });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}
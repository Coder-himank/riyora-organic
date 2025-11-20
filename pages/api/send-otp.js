// pages/api/send-otp.js
import redis from "@/server/redis";

/**
 * API Route: Send OTP via Fast2SMS
 *
 * Flow:
 *  - Validates phone and countryCode
 *  - Prevents repeated requests using cooldown
 *  - Generates and stores OTP in Redis with expiry
 *  - Sends OTP via Fast2SMS HTTP API
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { phone, countryCode } = req.body;

  if (!phone || !countryCode) {
    return res.status(400).json({ success: false, message: "Phone and country code are required" });
  }

  const redisKey = `otp:${countryCode}${phone}`;
  const cooldownKey = `otpCooldown:${countryCode}${phone}`;

  try {
    // Enforce cooldown
    const cooldown = await redis.get(cooldownKey);
    if (cooldown) {
      return res.status(429).json({
        success: false,
        message: "OTP recently sent. Please wait before requesting again."
      });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in Redis (5 min expiry)
    await redis.set(redisKey, otp, "EX", 300);

    // Store cooldown (25 sec)
    await redis.set(cooldownKey, "true", "EX", 25);

    // Send SMS via Fast2SMS
    const fast2smsApiKey = process.env.FAST2SMS_API_KEY; // Store in .env
    const message = `Your OTP is ${otp}`;
    const url = `https://www.fast2sms.com/dev/bulkV2`;

    const payload = {
      route: "v3",
      sender_id: "FSTSMS",
      message: message,
      language: "english",
      flash: 0,
      numbers: `${countryCode}${phone}`
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "authorization": fast2smsApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.return) {
      return res.status(200).json({ success: true, message: "OTP sent successfully", otp });
    } else {
      console.error("Fast2SMS error:", data);
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }

  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}

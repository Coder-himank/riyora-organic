import redis from "@/server/redis";
import { sendSms } from "@/server/twilio";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { phone, countryCode } = req.body;
    if (!phone || !countryCode) {
        return res.status(400).json({ success: false, message: "Phone and country code required" });
    }

    const redisKey = `otp:${countryCode}${phone}`;
    const cooldownKey = `otpCooldown:${countryCode}${phone}`;

    try {
        // Check cooldown
        const cooldown = await redis.get(cooldownKey);
        if (cooldown) {
            return res.status(429).json({ success: false, message: "OTP recently sent. Please wait before requesting again." });
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Store OTP (5 min) and cooldown (1 min)
        await redis.set(redisKey, otp, "EX", 300);
        await redis.set(cooldownKey, "true", "EX", 5);

        // Send SMS
        await sendSms(`+${countryCode}${phone}`, `Your OTP is ${otp}`);

        return res.status(200).json({ success: true, message: "OTP sent", otp });
    } catch (err) {
        console.error("Send OTP error:", err);
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
}

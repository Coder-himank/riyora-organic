import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { createClient } from "redis";

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

try {
    const client = twilio(accountSid, authToken);
} catch (error) {
    console.error("Twilio Initialization Error:", error);
    throw new Error("Failed to initialize Twilio client");
}
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { phone, countryCode } = req.body;

    if (!phone || !countryCode) {
        return res.status(400).json({ error: "Phone and countryCode are required" });
    }

    const parsedPhone = parsePhoneNumberFromString(phone, countryCode);
    if (!parsedPhone?.isValid()) {
        return res.status(400).json({ error: "Invalid phone number" });
    }

    const formattedPhone = parsedPhone.format("E.164");

        const redis = createClient({ url: process.env.REDIS_URL });

        console.log("stage 1");
        try {
            await redis.connect();
            console.log("stage 2");
        } catch (err) {
            console.error("Redis Connection Error:", err);
            return res.status(500).json({
                error: "Redis connection failed",
                source: "Redis",
                details: err.message,
            });
        }



        try {
            const requestCountKey = `otp:count:${formattedPhone}`;
            const count = await redis.incr(requestCountKey);

            if (count === 1) {
                await redis.expire(requestCountKey, 3600); // Set TTL to 1 hour
            }

            // if (count > 3) {
            //     return res.status(429).json({ error: "Too many OTP requests. Try again later." });
            // }

            const otp = Math.floor(100000 + Math.random() * 900000);

            await redis.set(`otp:${formattedPhone}`, otp, { EX: 300 }); // 5 minutes

        
        try {
            // Uncomment in production
            // await client.messages.create({
            //     body: `Your verification code is ${otp}`,
            //     from: twilioPhone,
            //     to: formattedPhone,
            // });

            console.log("OTP sent to", formattedPhone, "OTP:", otp);

            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                // Remove `otp` in production responses
                otp,
            });

        } catch (twilioErr) {
            console.error("Twilio Error:", twilioErr);

            return res.status(500).json({
                error: "Failed to send OTP",
                source: "Twilio",
                message: twilioErr.message,
                code: twilioErr.code || "TWILIO_ERROR",
                moreInfo: twilioErr.moreInfo || "No additional info",
            });
        }

    } catch (redisOpErr) {
        console.error("Redis Operation Error:", redisOpErr);

        return res.status(500).json({
            error: "Internal server error",
            source: "Redis Operation",
            message: redisOpErr.message,
        });

    }
}

import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { createClient } from "redis";


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const redis = createClient({
        url: process.env.REDIS_URL,
    });

    await redis.connect();

    const { phone, countryCode } = req.body;

    if (!phone || !countryCode) {
        return res.status(400).json({ error: "Phone and countryCode required" });
    }

    const parsedPhone = parsePhoneNumberFromString(phone, countryCode);
    if (!parsedPhone?.isValid()) {
        return res.status(400).json({ error: "Invalid phone number" });
    }

    const formattedPhone = parsedPhone.format("E.164");

    // Rate limiting: Max 3 OTPs per hour
    const requestCountKey = `otp:count:${formattedPhone}`;
    const count = await redis.incr(requestCountKey);
    if (count === 1) await redis.expire(requestCountKey, 3600); // 1 hour

    if (count > 3) {
        return res.status(429).json({ error: "Too many OTP requests. Try later." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await redis.set(`otp:${formattedPhone}`, otp, { EX: 300 }); // 5 mins

    try {
        // await client.messages.create({
        //     body: `Your verification code is ${otp}`,
        //     from: twilioPhone,
        //     to: formattedPhone,
        // });

        return res.status(200).json({ success: true, message: "OTP sent!", otp });

    } catch (error) {
        console.error("Twilio Error:", error);

        res.status(500).json({
            error: "Failed to send OTP",
            details: error.message || "Unknown error",
            status: error.status || 500,
            code: error.code || "NO_CODE",
            moreInfo: error.moreInfo || "No additional details",
        });
    }
}

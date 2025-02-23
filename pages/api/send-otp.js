import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let { phone, countryCode } = req.body;

    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });


    }

    // Validate and format phone number
    const parsedPhone = parsePhoneNumberFromString(phone, countryCode);

    if (!parsedPhone || !parsedPhone.isValid()) {
        return res.status(400).json({ error: "Invalid phone number" });
    }

    phone = parsedPhone.format("E.164"); // Standardize to +<CountryCode><Number>
    try {
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        console.log("OTP : ", otp);

        // Send OTP via Twilio SMS
        // const message = await client.messages.create({
        //     body: `Your verification code is ${otp}`,
        //     from: twilioPhone,
        //     to: phone,
        // });

        // console.log("Twilio Message Sent:", message.sid);

        // Store OTP in database or cache (e.g., Redis)
        // Example: await redis.set(phone, otp, "EX", 300); // Expires in 5 minutes

        res.status(200).json({ success: true, message: "OTP sent successfully!", otp });
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

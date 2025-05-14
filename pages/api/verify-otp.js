// export default async function handler(req, res) {
//     if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

//     const { phone, otp, storedOtp } = req.body; // `storedOtp` should be fetched from DB/session

//     if (!otp || !storedOtp) return res.status(400).json({ error: "OTP is required" });

//     if (otp === storedOtp) {
//       return res.status(200).json({ success: true, message: "OTP verified successfully!" });
//     }

//     return res.status(400).json({ error: "Invalid OTP" });
//   }

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { createClient } from "redis";

const redis = createClient(
  {
    url: process.env.REDIS_URL
  }
);
await redis.connect();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { phone, countryCode, otp } = req.body;

  if (!phone || !countryCode || !otp) {
    return res.status(400).json({ error: "Phone, countryCode, and OTP are required" });
  }

  const parsedPhone = parsePhoneNumberFromString(phone, countryCode);
  if (!parsedPhone?.isValid()) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  const formattedPhone = parsedPhone.format("E.164");
  const key = `otp:${formattedPhone}`;

  const storedOtp = await redis.get(key);

  if (!storedOtp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (storedOtp !== otp) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  await redis.del(key); // One-time use

  // ✅ You can now mark the user as verified in DB

  return res.status(200).json({ success: true, message: "Phone verified successfully!" });
}

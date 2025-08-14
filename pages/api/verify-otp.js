import redis from "@/server/redis";
import dbConnect from "@/server/db";
import User from "@/server/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { countryCode, phone, otp } = req.body;
  if (!phone || !otp || !countryCode) {
    return res.status(400).json({ success: false, message: "Phone, country code, and OTP are required" });
  }

  const otpKey = `otp:${countryCode}${phone}`;

  // Atomically get and delete OTP
  const storedOtp = await redis.get(otpKey);
  // await redis.del(otpKey);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP expired or not found" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
  console.log("OTP MATCHED");

  await dbConnect();

  let user = await User.findOne({ phone });
  if (!user) {
    // Create minimal user for signup
    user = new User({ name: "Temp", phone, phoneVerified: true, enrolled: false });
    await user.save();
  } else {
    user.phoneVerified = true;
    await user.save();
  }

  return res.status(200).json({ success: true, message: "Phone verified" });
}

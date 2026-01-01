// pages/api/send-otp-whatsapp.js
import redis from "@/server/redis";
import User from "@/server/models/User";
import dbConnect from "@/server/db";
import sendMail from "@/utils/sendMail";

/* ---------------- UTILS ---------------- */

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/* ---------------- EMAIL SENDER ---------------- */

const otpOnMail = async (email, otp) => {
  await sendMail(email, "otpAuth",otp)
};

/* ---------------- DB ---------------- */

export const SearchUserByPhone = async (phone) => {
  await dbConnect();
  return await User.findOne({ phone });
};

/* ---------------- API HANDLER ---------------- */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { phone, countryCode, method, email } = req.body;

  if (!phone || !countryCode) {
    return res.status(400).json({

      success: false,
      message: "Phone and country code are required",
    });
  }

  try {
    /* ---------------- LOGIN FLOW ---------------- */
    let user = null;

    if (method === "login") {
      user = await SearchUserByPhone(phone);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please sign up first.",
        });
      }

      if (!user.email) {
        console.log("no email linked");
        return res.status(400).json({
          success: false,
          message: "No email linked with this account",
        });
      }
    }

    const redisKey = `otp:${countryCode}${phone}`;
    const cooldownKey = `otpCooldown:${countryCode}${phone}`;

    /* ---------------- COOLDOWN CHECK ---------------- */
    const cooldown = await redis.get(cooldownKey);
    if (cooldown) {
      return res.status(429).json({
        success: false,
        message: "OTP recently sent. Please wait before requesting again.",
      });
    }

    /* ---------------- GENERATE OTP ---------------- */
    const otp = generateOtp();

    /* ---------------- SAVE OTP ---------------- */
    await redis.set(redisKey, otp, "EX", 300); // 5 min
    await redis.set(cooldownKey, "true", "EX", 25); // 25 sec cooldown

    /* ---------------- SEND OTP ON EMAIL ---------------- */
    await otpOnMail(email || user.email, otp);
    let secretMail = email || user.email; // fallback
    secretMail = secretMail.replace(/(.).*(..)(@.+)/, "$1*******$2$3");

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${secretMail}`,
    });


  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
}

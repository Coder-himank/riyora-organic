// pages/api/verify-otp.js
import redis from "@/server/redis";
import dbConnect from "@/server/db";
import User from "@/server/models/User";

/**
 * API Route: Verify OTP for phone number authentication
 *
 * - Accepts POST requests with phone, country code, and OTP
 * - Validates OTP stored in Redis
 * - Marks user as phone verified, or creates a new user if not found
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { countryCode, phone, otp } = req.body;

  // Validate required fields
  if (!phone || !otp || !countryCode) {
    return res.status(400).json({
      success: false,
      message: "Phone, country code, and OTP are required",
    });
  }

  const otpKey = `otp:${countryCode}${phone}`;

  try {
    // Retrieve OTP from Redis
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Optionally delete OTP after successful verification
    // await redis.del(otpKey);

    // Connect to database
    await dbConnect();

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: "Temp", // Placeholder name until user completes profile
        phone,
        // phoneVerified: true,
        emailVerified: true,
        enrolled: false,
      });
      await user.save();
    } else {
      // user.phoneVerified = true;
              user.emailVerified = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Phone verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
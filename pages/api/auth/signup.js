// pages/api/auth/signup.js
import dbConnect from "@/server/db";
import User from "@/server/models/User";

/**
 * API Route: User Signup
 *
 * - Accepts POST requests
 * - Requires `name` and `phone`
 * - Ensures the phone number is verified before enrollment
 * - Handles user creation or profile completion after phone verification
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, email, phone } = req.body;

  // Validate input
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone are required",
    });
  }

  try {
    // Ensure DB connection
    await dbConnect();

    const existingUser = await User.findOne({ phone });

    // Case 1: User already exists, fully verified and enrolled
    if (existingUser && existingUser.phoneVerified && existingUser.enrolled) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Case 2: User exists but phone is not verified
    if (existingUser && !existingUser.phoneVerified) {
      return res.status(400).json({
        success: false,
        message: "Phone number not verified",
      });
    }

    // Case 3: User exists, phone verified but not enrolled → update profile
    if (existingUser && existingUser.phoneVerified && !existingUser.enrolled) {
      const updatedUser = await User.findOneAndUpdate(
        { phone },
        {
          name,
          email: email || existingUser.email, // Update email if provided
          phoneVerified: true,
          enrolled: true,
        },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        user: updatedUser,
      });
    }

    // Case 4: No valid case found (potential suspicious request)
    return res.status(401).json({
      success: false,
      message: "Suspicious user state",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
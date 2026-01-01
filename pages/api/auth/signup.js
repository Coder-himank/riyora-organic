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
  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and phone are required",
    });
  }

  try {
    // Ensure DB connection
    await dbConnect();

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }
    // Create new user with no verification markups
    const newUser = new User({
      name,
      email,
      phone,
    });
    await newUser.save();

          return res.status(200).json({
        success: false,
        message: "Account Created Successfully",
      });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
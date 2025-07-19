import dbConnect from "@/server/db";
import User from "@/server/models/User";
import bcrypt from "bcryptjs";

/**
 * Utility function to handle errors consistently.
 * Logs the error and returns a structured response.
 */
const handleError = (res, statusCode, message, error = null) => {
  console.error("Error:", message, error || ""); // Log error details for debugging
  return res.status(statusCode).json({ success: false, message });
};

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return handleError(res, 405, "Method Not Allowed");
  }

  try {
    // Connect to database
    await dbConnect();


    // Destructure request body
    const { fullName, email, password, phone, address, city, country, phoneVerified } = req.body;


    // Validation: Ensure all required fields are present
    if (!fullName || !email || !password || !phone) {
      return handleError(res, 400, "All fields are required!");
    }

    if (!phoneVerified) {

      return handleError(res, 400, "Phone Verification is Required");
    }

    // Validation: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleError(res, 400, "Invalid email format!");
    }

    // Validation: Enforce strong password (minimum 6 characters)
    if (password.length < 6) {
      return handleError(res, 400, "Password must be at least 6 characters long!");
    }

    // Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleError(res, 400, "User with this email already exists!");
    }

    // Secure password hashing with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      // userid: email, // Using email as a unique identifier
      name: fullName,
      phoneVerified,
      phone,
      password: hashedPassword || "",
      email,
      cartData: [], // Initialize empty cart
      wishlistData: [], // Initialize empty wishlist
      addresses: []
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });

  } catch (error) {
    // console.log(error.errorResponse)
    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return handleError(res, 400, "Invalid user data provided!", error);
    }

    // Handle duplicate email error (MongoDB unique index)
    if (error.code === 11000) {
      return handleError(res, 400, "Email is already in use!", error);
    }

    // Generic server error fallback
    return handleError(res, 500, "Something went wrong. Please try again later.", error);
  }
}

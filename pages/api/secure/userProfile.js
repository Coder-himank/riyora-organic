// pages/api/secure/user.js

import connectDB from "@/server/db";
import User from "@/server/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

export default async function handler(req, res) {
  await connectDB();

  // ✅ Step 1: Authenticate the session
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;
  console.log(req.body);

  try {
    // ✅ Step 2: Apply rate limiting per user to prevent abuse
    await rateLimit(req, res, { key: `user-${userId}`, points: 30, duration: 60 });

    // ✅ Step 3: Handle API methods securely
    switch (req.method) {
      /** --------------------- 📍 GET: Fetch Logged-in User --------------------- */
      case "GET": {
        const user = await User.findById(userId).select("-password -__v");

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({user});
      }

      /** --------------------- 🏠 POST: Add Address --------------------- */
      case "POST": {
        const { address } = req.body;
        if (!address) {
          return res.status(400).json({ message: "Address is required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Limit number of addresses (optional safety)
        if (user.addresses.length >= 5) {
          return res
            .status(400)
            .json({ message: "Maximum 5 addresses allowed per user" });
        }

        // Sanitize address fields
        const safeAddress = {
          name: String(address?.name || "").trim(),
          street: String(address?.street || "").trim(),
          city: String(address?.city || "").trim(),
          state: String(address?.state || "").trim(),
          country: String(address?.country || "").trim(),
          postalCode: String(address?.postalCode || "").trim(),
          phone: String(address?.phone || "").trim(),
          pincode: String(address?.pincode || "").trim(),
          address: String(address?.address || "").trim(),
        };

        user.addresses.push(safeAddress);
        await user.save();

        return res
          .status(200)
          .json({ message: "Address added successfully", addresses: user.addresses });
      }

      /** --------------------- ✏️ PUT: Update User Fields --------------------- */
      case "PUT": {
        const { updates } = req.body;
        if (!updates) {
          return res.status(400).json({ message: "Updates object is required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Only allow specific fields to be updated
        const allowedFields = ["name", "phone", "avatar", "preferences"];
        for (const key of Object.keys(updates)) {
          if (allowedFields.includes(key) && updates[key] !== undefined) {
            user[key] = updates[key];
          }
        }

        await user.save();

        return res.status(200).json({
          message: "User updated successfully",
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            preferences: user.preferences,
          },
        });
      }

      /** --------------------- ❌ Default --------------------- */
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("User API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

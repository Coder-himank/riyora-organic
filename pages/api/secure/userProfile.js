// pages/api/secure/user.js

import connectDB from "@/server/db";
import User from "@/server/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.user.id;

  try {
    await rateLimit(req, res, { key: `user-${userId}`, points: 30, duration: 60 });

    switch (req.method) {
      /** ------------------ GET USER ------------------ */
      case "GET": {
        const user = await User.findById(userId).select("-password -__v");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user });
      }

      /** ------------------ ADD ADDRESS ------------------ */
      case "POST": {
        const { address } = req.body;
        if (!address) return res.status(400).json({ message: "Address required" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.addresses.length >= 5)
          return res.status(400).json({ message: "Max 5 addresses allowed" });

        user.addresses.push({
          address: String(address.address).trim(),
          city: String(address.city).trim(),
          country: String(address.country).trim(),
          pincode: String(address.pincode).trim(),
          label: String(address.label || "Other").trim(),
        });

        await user.save();

        return res.status(200).json({ message: "Address added", addresses: user.addresses });
      }

      /** ------------------ UPDATE USER ------------------ */
      case "PUT": {
        const { updates } = req.body;
        if (!updates) return res.status(400).json({ message: "Updates object missing" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const allowedFields = ["name", "email", "phone", "avatar", "preferences"];

        for (const key of allowedFields) {
          if (updates[key] !== undefined) user[key] = updates[key];
        }

        // ✅ Replace full addresses array (edit/add/delete)
        if (Array.isArray(updates.addresses)) {
          user.addresses = updates.addresses.map(addr => ({
            address: String(addr.address || "").trim(),
            city: String(addr.city || "").trim(),
            country: String(addr.country || "").trim(),
            pincode: String(addr.pincode || "").trim(),
            label: String(addr.label || "Other").trim(),
          }));
        }

        await user.save();

        return res.status(200).json({
          message: "User updated successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            preferences: user.preferences,
            addresses: user.addresses,
          },
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err) {
    console.error("User API Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

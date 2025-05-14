import connectDB from "@/server/db";
import User from "@/server/models/User";
// import { authMiddleware } from "@/server/authMiddleware"
export default async function handler(req, res) {
    await connectDB();

    // const validUser = await authMiddleware(req, res);
    // if (!validUser) res.status(401).json({ message: "unauthorised user" })

    if (req.method === "GET") {
        try {
            const { userId } = req.query;
            if (!userId) return res.status(400).json({ message: "User ID is required" });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    else if (req.method === "POST") {
        try {
            const { userId, address } = req.body;
            if (!userId || !address) return res.status(400).json({ message: "User ID and Address are required" });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            // Add the new address
            user.addresses.push(address);
            await user.save();

            res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
        } catch (error) {
            console.error("Error updating address:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const { userId, updates } = req.body;
            if (!userId || !updates) return res.status(400).json({ message: "User ID and updates are required" });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            // Update only the provided fields
            Object.keys(updates).forEach((key) => {
                if (updates[key] !== undefined) {
                    user[key] = updates[key];
                }
            });

            await user.save();

            res.status(200).json({ message: "User updated successfully", user });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}

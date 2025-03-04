import jwt from "jsonwebtoken";
import User from "@/server/models/User";
import dbConnect from "@/server/db";
// import { getSession } from "next-auth/client";

export const authMiddleware = async (req, res) => {
    // try {
    //     await dbConnect();

    //     const token = req.headers.authorization?.split(" ")[1];
    //     if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     const user = await User.findById(decoded.userId);
    //     if (!user) return res.status(404).json({ message: "User not found" });

    //     req.user = user; // Attach user to request
    // } catch (error) {
    //     console.error("Auth error:", error);
    //     return res.status(401).json({ message: "Unauthorized: Invalid token" });
    // }

    // const valid = await getSession({ req })
    // if (!valid) res.status(401).json({ message: "Unauthroised user" })
    // res.status(200).json({ message: 'Success' })

};

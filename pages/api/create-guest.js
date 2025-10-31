import connectDB from "@/server/db";
import User from "@/server/models/User";
import { rateLimit } from "@/utils/rateLimit";
const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
    try {
    // ===== Step 1: Connect DB =====
    await connectDB();
    // ===== Step 2: Rate limit per IP/session =====
    await rateLimit(req, res, { key: "createguest", points: 20, duration: 60 });
    // ===== Step 3: Create guest user =====

    const {name, phone, address} = req.body;
    if(!phone || phone.length < 10){
      return res.status(400).json({ error: "Valid phone number and name is required" });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(200).json({ message: "user exists", user: existingUser });
    }

    const guestUser = new User({ phone, name, addresses: [address], isGuest: true });
    await guestUser.save();
    return res.status(201).json({ user:guestUser });
  } catch (error) {
    console.error("Create Guest User Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
};
export default handler;
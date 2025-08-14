import dbConnect from "@/server/db";
import User from "@/server/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "Name and phone required" });
  }

  await dbConnect();

  const existing = await User.findOne({ phone });
  if (existing && existing.phoneVerified && existing.enrolled) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }
  if (existing && !existing.phoneVerified) {
    return res.status(400).json({ success: false, message: "Phone not verified" });
  }

  if (existing && existing.phoneVerified && !existing.enrolled) {
    const user = await User.findOneAndUpdate(
      { phone },
      {
        name,
        email,
        phone,
        phoneVerified: true,
        enrolled: true
      },
      { new: true }
    );

    return res.status(201).json({ success: true, user });
  }
  return res.status(401).json({ success: false, message: "suspesios user" });

}

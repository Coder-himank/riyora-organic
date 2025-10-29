// pages/api/secure/complaint.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import connectDB from "@/server/db";
import Complaint from "@/server/models/Complaint";
import Order from "@/server/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // adjust if large images are sent as base64
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed." });

  try {
    // ✅ Secure authentication: get logged-in user
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const userId = session.user.id; // derived from session, not client input
    await connectDB();

    const { orderId, reason, complaintText, images, productId } = req.body;

    // ✅ Basic input validation
    if (!orderId || !reason || !complaintText || !productId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 🧾 Verify that the order belongs to this user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(403).json({ message: "You can only submit complaints for your own orders." });
    }

    // 💾 Create complaint document
    const complaint = new Complaint({
      orderId,
      userId,
      reason,
      complaintText,
      images,
      productId,
    });

    await complaint.save();

    // 🛠️ Update the product entry in the order that matches the productId/variantId
    order.products = order.products.map((prod) => {
      const isVariantMatch =
        prod.variantId && prod.variantId.toString() === productId;
      const isProductMatch =
        !prod.variantId && prod.productId.toString() === productId;

      if (isVariantMatch || isProductMatch) {
        prod.complaintId = complaint._id;
      }
      return prod;
    });

    await order.save();

    return res.status(201).json({ success: true, complaint });
  } catch (error) {
    console.error("Complaint API Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}

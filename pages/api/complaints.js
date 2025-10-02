import formidable from "formidable";
import fs from "fs";
import path from "path";
import connectDB from "@/server/db";
import Complaint from "@/server/models/Complaint";
import Order from "@/server/models/Order";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();


  console.log(req.body);
    const { orderId, userId, reason, complaintText, images, productId } = req.body;


    try {
      const complaint = new Complaint({
        orderId,
        userId,
        reason,
        complaintText,
        images,
        productId
      });

      await complaint.save();

      // updating the status for complaint in the order nots and the the product that is reported

      const order = await Order.findById(orderId);
      if (order) {
        order.products = order.products.map((prod) => {
  if (prod.variantId && prod.variantId.toString() === productId) {
    prod.complaintId = complaint._id;
  } else if (!prod.variantId && prod.productId.toString() === productId) {
    prod.complaintId = complaint._id;
  }
  return prod;
});

        await order.save();
      }
      return res.status(201).json({ success: true, complaint });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to save complaint" });
    }
  
}

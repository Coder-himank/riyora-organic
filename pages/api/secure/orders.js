// api/secure/orders.js

import connectDB from "@/server/db";
import Order from "@/server/models/Order";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  try {
    const { method } = req;

    if (method === "GET") {
      const { orderId, userId, status } = req.query;

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      let orders;

      // Fetch orders by status
      if (status && status !== "undefined") {
        orders = await Order.find({
          userId,
          "statusHistory.status": status,
        });
        return res.status(200).json({ success: true, orders });
      }

      // Fetch a single order or all orders
      if (orderId && orderId !== "undefined") {
        if (orderId === "all") {
          orders = await Order.find({ userId });
          return res.status(200).json({ success: true, orders });
        }

        // Convert orderId to ObjectId if valid
        let objectId = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
          objectId = new mongoose.Types.ObjectId(orderId);
        }

        const order = await Order.findOne({
          userId,
          $or: [
            { _id: objectId },
            { razorpayOrderId: orderId }
          ]
        });

        if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ success: true, order });
      }

      // Fetch all orders for the user
      orders = await Order.find({ userId });
      return res.status(200).json({ success: true, orders });
    }

    else if (method === "PUT") {
      const { orderId } = req.query;
      const updateFields = req.body;

      if (!orderId) {
        return res.status(400).json({ success: false, message: "Order ID is required" });
      }

      // Convert orderId to ObjectId if valid
      let objectId = null;
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        objectId = new mongoose.Types.ObjectId(orderId);
      }

      const order = await Order.findOne({
        $or: [
          { _id: objectId },
          { razorpayOrderId: orderId }
        ]
      });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const updateQuery = { $set: { ...updateFields } };

      // Handle status history update
      if (
        updateFields.status &&
        ["pending", "shipped", "delivered", "cancelled"].includes(updateFields.status)
      ) {
        updateQuery.$push = {
          statusHistory: { status: updateFields.status, updatedAt: new Date() },
        };
        delete updateQuery.$set.status;
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id },
        updateQuery,
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      });
    }

    else {
      return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Order API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

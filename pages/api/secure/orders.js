import connectDB from "@/server/db";
import Order from "@/server/models/Order";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const { orderId, userId, status } = req.query;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }

      let orders;

      if (status && status !== "undefined") {
        // ✅ Fetch orders by status
        orders = await Order.find({
          userId,
          "statusHistory.status": status,
        });
      } else if (orderId && orderId !== "undefined") {
        
        if (orderId === "all") {
          const orders = await Order.find({
          userId
        });

        return res.status(200).json({ success: true, orders });
      }

        
        // ✅ Validate ObjectId if orderId is MongoDB _id


        if (!mongoose.Types.ObjectId.isValid(orderId)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid orderId" });
        }

        // ✅ Fetch single order by orderId (or _id if required)
        const order = await Order.findOne({
          userId,
          _id: orderId,
        });

        if (!order) {
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ success: true, order });
      } else {
        // ✅ Fetch all orders for user
        orders = await Order.find({ userId });
      }

      return res.status(200).json({ success: true, orders });
    }

    else if (req.method === "PUT") {
      const { orderId } = req.query;
      const updateFields = req.body;

      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "Order ID is required" });
      }

      const order = await Order.findOne({ orderId });
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const updateQuery = { $set: { ...updateFields } };

      // ✅ Handle status history update
      if (
        updateFields.status &&
        ["pending", "shipped", "delivered", "cancelled"].includes(
          updateFields.status
        )
      ) {
        updateQuery.$push = {
          statusHistory: { status: updateFields.status, updatedAt: new Date() },
        };
        delete updateQuery.$set.status;
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
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
      res
        .status(405)
        .json({ success: false, message: `Method ${req.method} Not Allowed` });
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

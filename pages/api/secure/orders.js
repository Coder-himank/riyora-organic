// pages/api/secure/orders.js

import connectDB from "@/server/db";
import Order from "@/server/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

export default async function handler(req, res) {
  await connectDB();

  // ✅ Step 1: Authenticate session — derive user identity securely
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userId = session.user.id;
  const { method } = req;

  try {
    // ✅ Step 2: Apply rate limiting
    await rateLimit(req, res, { key: `orders-${userId}`, points: 20, duration: 60 });

    switch (method) {
      /** ----------------------------------------------------------------------
       * 🟢 GET — Fetch orders for logged-in user (optionally by status or orderId)
       * ---------------------------------------------------------------------- */
      case "GET": {
        const { orderId, status } = req.query;

        // Build a base query scoped to this user
        const query = { userId };

        // Filter by status (optional)
        if (status && status !== "undefined") {
          query["orderHistory.status"] = status;
        }

        // Single order fetch
        if (orderId && orderId !== "undefined") {
          let order;
          if (orderId === "all") {
            const orders = await Order.find(query).sort({ createdAt: -1 });
            return res.status(200).json({ success: true, orders });
          }

          let objectId = null;
          if (mongoose.Types.ObjectId.isValid(orderId)) {
            objectId = new mongoose.Types.ObjectId(orderId);
          }

          order = await Order.findOne({
            userId,
            $or: [{ _id: objectId }, { razorpayOrderId: orderId }],
          });

          if (!order) {
            return res
              .status(404)
              .json({ success: false, message: "Order not found" });
          }

          return res.status(200).json({ success: true, order });
        }

        // All orders for user
        const orders = await Order.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, orders });
      }

      /** ----------------------------------------------------------------------
       * 🟡 PUT — Allow user to update limited order fields (status / cancellation)
       * ---------------------------------------------------------------------- */
      case "PUT": {
        const { orderId } = req.query;
        const updateFields = req.body || {};

        if (!orderId) {
          return res
            .status(400)
            .json({ success: false, message: "Order ID is required" });
        }

        // Only allow safe status transitions (e.g., cancel, return)
        const allowedStatuses = [
          "cancelled",
          "returned",
          "delivered",
        ];

        const requestedStatus = updateFields.status;
        if (requestedStatus && !allowedStatuses.includes(requestedStatus)) {
          return res.status(403).json({
            success: false,
            message: "You are not allowed to change this order status.",
          });
        }

        // Fetch user’s own order only
        let objectId = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
          objectId = new mongoose.Types.ObjectId(orderId);
        }

        const order = await Order.findOne({
          userId,
          $or: [{ _id: objectId }, { razorpayOrderId: orderId }],
        });

        if (!order) {
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });
        }

        // Users can only cancel or mark as returned (cannot modify admin-only fields)
        const updateQuery = {};

        if (requestedStatus) {
          updateQuery.status = requestedStatus;
          order.orderHistory.push({
            status: requestedStatus,
            date: new Date(),
            note: updateFields.note || "",
            updatedBy: "user",
          });
        }

        // Save the changes if any
        if (Object.keys(updateQuery).length > 0) {
          Object.assign(order, updateQuery);
          await order.save();
        }

        return res.status(200).json({
          success: true,
          message: "Order updated successfully",
          order,
        });
      }

      /** ----------------------------------------------------------------------
       * ❌ Unsupported methods
       * ---------------------------------------------------------------------- */
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res
          .status(405)
          .json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Order API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

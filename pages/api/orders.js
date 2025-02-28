import connectDB from "../../server/db";
import Order from "@/server/models/Order";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const { orderId, userId, status } = req.query;

            if (!userId) {
                return res.status(400).json({ message: "Missing Details" });
            }

            let orderDetails;

            if (status !== undefined & status !== "undefined") {
                orderDetails = await Order.find({
                    userId,
                    "statusHistory.status": status  // Correct way to filter nested arrays
                });
            } else if (orderId & orderId !== undefined) {
                orderDetails = await Order.findOne({ userId, _id: orderId });
                orderDetails = orderDetails ? [orderDetails] : [];
            } else {
                orderDetails = await Order.find({ userId });
            }
            return res.status(200).json({ orderDetails });
        } catch (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }



    else if (req.method === "PUT") {
        try {
            const { orderId } = req.query;
            const updateFields = req.body;

            // Validate if orderId is provided
            if (!orderId) {
                return res.status(400).json({ success: false, message: "Order ID is required" });
            }

            // Check if order exists
            const order = await Order.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            // Handle status history updates if status is provided
            if (updateFields.status && ['pending', 'shipped', 'delivered', 'cancelled'].includes(updateFields.status)) {
                updateFields.$push = { statusHistory: { status: updateFields.status, updatedAt: new Date() } };
                delete updateFields.status; // Remove status to avoid overriding history array
            }

            // Use findOneAndUpdate for better efficiency
            const updatedOrder = await Order.findOneAndUpdate(
                { orderId },
                { $set: updateFields }, // Update only provided fields
                { new: true } // Return updated document
            );

            res.json({ success: true, message: "Order updated successfully", order: updatedOrder });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
        }
    }

    else {
        res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}

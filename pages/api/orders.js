import connectDB from "../../server/db";
import Order from "@/server/models/Order";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({ message: "Missing Order Id" })
        }

        const orderDetails = await Order.findOne({ orderId })


        res.status(200).json({ orderDetails })
    }
    if (req.method === "POST") {
        try {
            // Extract only required fields (without defaults)
            const { orderId, userId, amount, customerName, customerPhone, customerEmail, products } = req.body;

            // Validate required fields
            if (!orderId || !userId || !amount || !customerName || !customerPhone || !customerEmail || !products?.length) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const newOrder = new Order({
                orderId,
                userId,
                amount,
                customerName,
                customerPhone,
                customerEmail,
                products
            });

            await newOrder.save();
            res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
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

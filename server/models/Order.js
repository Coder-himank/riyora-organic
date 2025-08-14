import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        name: String,
        imageUrl: String,
        price: Number,
        quantity: Number,
    },
    { _id: false }
);

const AmountsSchema = new mongoose.Schema(
    {
        beforeTaxAmount: Number,
        discount: Number,
        taxedAmount: Number,
        deliveryCharges: Number,
        finalAmount: Number,
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },
        items: [OrderItemSchema],
        amounts: AmountsSchema,
        addressId: { type: String, default: null },
        status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
        razorpayOrderId: { type: String, index: true },
        razorpayPaymentId: String,
        razorpaySignature: String,
        paidAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

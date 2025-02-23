import { models, model, Schema } from "mongoose";

const orderSchema = new Schema({
    orderId: { type: String, required: true },
    placedOn: { type: Date, required: true, default: () => new Date() },
    expectedDelivery: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) // Adds 8 days
    },
    paymentStatus: { type: String, enum: ['paid', 'unpaid', 'pending'], required: true, default: "pending" },
    userId: { type: String, required: true },
    paymentType: { type: String, required: true, default: "not_set" },
    amount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            quantity_demanded: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    discountCode: { type: String, default: "None" },
    discountAmount: { type: Number, default: 0 },
    notes: { type: String },
    shippingInfo: {
        trackingNumber: { type: String },
        carrier: { type: String },
        shippingMethod: { type: String },
        shippingCost: { type: Number }
    },
    refundStatus: { type: String, enum: ['none', 'partially_refunded', 'fully_refunded'], default: "none" },
    refundAmount: { type: Number, default: 0 },
    cancellationReason: { type: String, default: "none" },
    paymentDetails: {
        transactionId: { type: String },
        paymentGateway: { type: String },
        paymentDate: { type: Date }
    },
    shippingAddress: {
        label: { type: String },
        address: { type: String },
        city: { type: String },
        country: { type: String },
        pincode: { type: String }
    },
    statusHistory: [
        {
            status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true, default: 'pending' },
            updatedAt: { type: Date, required: true, default: () => new Date() }
        }
    ]
}, { timestamps: true });

// Create and export the model
const Order = models.Order || model('Order', orderSchema);
export default Order;

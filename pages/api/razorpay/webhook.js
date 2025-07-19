// pages/api/razorpay/webhook.js

import crypto from 'crypto';
import dbConnect from '@/server/db';
import Order from '@/server/models/Order';
export const config = {
    api: {
        bodyParser: false,
    },
};

const buffer = (req) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const rawBody = await buffer(req);
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    // console.log('Received webhook:', {
    //     rawBody: rawBody.toString(),
    //     signature: signature,
    //     expectedSignature,
    // });

    if (
        !signature ||
        expectedSignature.length !== signature.length ||
        !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
    ) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payment = event?.payload?.payment?.entity;

    if (!payment) {
        console.error("No payment entity found in webhook");
        return res.status(400).send("Malformed webhook");
    }

    const notes = payment.notes;

    // console.log("notes", JSON.stringify(notes));

    try {
        await dbConnect();

        const alreadyExists = await Order.findOne({ razorpayOrderId: payment.order_id });
        if (alreadyExists) {
            return res.status(200).send('Order already exists');
        }
        if (!['payment.captured', 'payment.failed'].includes(eventType)) {
            return res.status(400).send('Invalid event type');
        }


        // Common order data



        const orderData = {
            userId: notes.userId,
            products: notes.products || '[]',
            address: notes.address || '{}',
            amountBreakDown: notes.amountBreakDown || '{}',
            promocode: notes.promocode || null,
            amount: payment.amount / 100,
            currency: payment.currency,
            paymentId: payment.id,
            signature,
            razorpayOrderId: payment.order_id,
            paymentStatus: eventType === 'payment.captured' ? 'paid' : 'failed',
            paymentDetails: {
                transactionId: payment.id,
                paymentGateway: 'Razorpay',
                paymentDate: new Date(payment.created_at * 1000),
            },
            status: eventType === 'payment.captured' ? 'confirmed' : 'payment_failed',
        };

        try {
            await Order.create(orderData);
        } catch (err) {
            console.error("Error saving order to DB", JSON.stringify(err));
            return res.status(500).send("DB Save Error");
        }

        return res.status(200).send('Order saved');
    } catch (error) {
        console.error('Webhook processing error:', JSON.stringify(error));
        return res.status(500).send('Internal server error');
    }
}

// pages/api/razorpay/create-order.js
import Razorpay from 'razorpay';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { amount, currency, receipt, notes } = req.body;

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: parseInt(amount * 100), // amount in the smallest currency unit
            currency,
            receipt,
            notes
        };

        try {
            const order = await razorpay.orders.create(options);
            res.status(200).json(order);
        } catch (error) {
            console.log('Error creating Razorpay order:', error);

            res.status(500).json({ error: 'Order creation failed' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

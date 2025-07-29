import connectDB from "@/server/db";
import Product from '@/server/models/Product';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'POST') {
        try {
            const data = req.body;

            // Optional: Auto-set lastModifiedAt
            data.lastModifiedAt = new Date();

            const product = await Product.create(data);
            res.status(201).json({ message: 'Product created', product });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

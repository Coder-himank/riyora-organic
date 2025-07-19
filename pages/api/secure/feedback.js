import { MongoClient, ObjectId } from 'mongodb';
import connectDB from '@/server/db';
import Product from '@/server/models/Product';

export default async function handler(req, res) {
    await connectDB();
    // console.log(req.body);

    if (req.method === 'POST') {
        const { productId, name, userId, comment, rating } = req.body;
        if (!productId || !name || !userId || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const review = {
                name,
                userId,
                comment,
                rating,
                createdAt: new Date(),
            };

            // Step 1: Push the new review
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            product.reviews.push(review);

            // Step 2: Recalculate average rating and total reviews
            const totalReviews = product.reviews.length;
            const averageRating =
                product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

            // Step 3: Update fields
            product.averageRating = averageRating;
            product.numReviews = totalReviews;

            // Step 4: Save the updated product
            await product.save();

            res.status(201).json({ message: 'Feedback submitted', reviewId: review._id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to submit feedback' });
        }
    }

    else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
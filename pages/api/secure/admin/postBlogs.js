import { dbConnect } from '@/server/dbConnect';
import Blog from '@/server/models/Blogs';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const data = req.body;

            // Optional: Auto-set lastModifiedAt
            data.updatedAt = new Date();

            const blog = await Blog.create(data);
            res.status(201).json({ message: 'Blog created', blog });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

import Blog from "@/server/models/Blogs";
import connectDB from "@/server/db";
export const handler = async (req, res) => {
    await connectDB()
    if (req.method === 'GET') {
        try {
            const blogId = req.query.blogId;
            if (blogId) {
                const blog = await Blog.findById(blogId);
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                return res.status(200).json(blog);
            }

            const blogs = await Blog.find()


            res.status(200).json(blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            res.status(500).json({ message: 'Error fetching blogs' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
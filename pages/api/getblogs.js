// pages/api/getblogs.js
import Blog from "@/server/models/Blogs";
import connectDB from "@/server/db";

/**
 * API Route: Get Blogs
 *
 * Handles fetching blogs from the database.
 * Supports:
 *  - GET /api/getblogs          → Fetch all blogs
 *  - GET /api/getblogs?blogId=x → Fetch a single blog by ID
 */
const handler = async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { blogId } = req.query;

      // Fetch single blog by ID
      if (blogId) {
        const blog = await Blog.findById(blogId);


        // if (!blog || !blog?.visible) {
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json(blog);
      }

      // Fetch all blogs
      const blogs = await Blog.find();
      return res.status(200).json(blogs);

    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ message: "Error fetching blogs" });
    }
  }

  // Handle unsupported HTTP methods
  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
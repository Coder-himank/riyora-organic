// pages/api/getProducts.js
import connectDB from "@/server/db";
import Product from "@/server/models/Product";
import mongoose from "mongoose";

/**
 * API Route: Get Products
 *
 * Supports:
 *  - GET /api/getProducts                     → Fetch all products
 *  - GET /api/getProducts?ids=1,2,3           → Fetch products by IDs
 *  - GET /api/getProducts?type=featured       → Fetch featured products (limited to 4)
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Ensure database connection
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ message: "Unable to connect to the database" });
  }

  try {
    const { ids, type } = req.query;
    let products = [];

    // Case 1: Fetch specific products by IDs
    if (ids) {
      const idsArray = ids.includes(",") ? ids.split(",") : [ids];

      // Validate MongoDB ObjectIds
      const allIdsValid = idsArray.every(id => mongoose.Types.ObjectId.isValid(id));
      if (!allIdsValid) {
        return res.status(400).json({ message: "Invalid product IDs" });
      }

      products = await Product.find({ _id: { $in: idsArray } , visible : true });
      // products = await Product.find({ _id: { $in: idsArray }, visible:true });
    } else {
      // Case 2: Fetch all products
      // products = await Product.find({visible:true});
      products = await Product.find({visible:true});
    }

    // Case 3: Apply filters (e.g., featured products)
    if (type) {
      if (type === "featured") {
        products = products.filter(product => product.isFeatured);
      }
      // Limit results to 4 when filtering by type
      products = products.slice(0, 4);
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Error fetching products", error });
  }
}
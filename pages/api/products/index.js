import connectDB from "../../../server/db";
import Product from "../../../server/models/Product";

export default async function handler(req, res) {

  try {
    await connectDB();

  } catch (error) {
    res.status(500).json({ message: "unable to connect to the database" })
  }

  if (req.method === "GET") {
    try {
      const { ids } = req.query;
      let products = [];

      if (ids) {
        const idsArray = ids.includes(",") ? ids.split(",") : [ids];
        products = await Product.find({ _id: { $in: idsArray } });
      } else {
        products = await Product.find();
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching products", error });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, price, description, category } = req.body;

      if (!name || !price || !description || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newProduct = new Product(req.body);
      await newProduct.save();
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: "Error creating product", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

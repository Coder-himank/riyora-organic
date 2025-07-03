import connectDB from "@/server/db";
import Product from "@/server/models/Product";

export default async function handler(req, res) {


  if (req.method === "GET") {
    try {
      await connectDB();

    } catch (error) {
      res.status(500).json({ message: "unable to connect to the database" })
    }
    try {
      const { ids, type } = req.query;
      let products = [];

      if (ids) {
        const idsArray = ids.includes(",") ? ids.split(",") : [ids];
        products = await Product.find({ _id: { $in: idsArray } });
      } else {
        products = await Product.find();
      }

      if (type) {
        if (type === "featured") {
          products = products.filter(product => product.isFeatured);
        }
        products = products.slice(0, 4);
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching products", error });
    }
  }


  return res.status(405).json({ message: "Method Not Allowed" });
}

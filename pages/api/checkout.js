import connectDB from "../../server/db";
import User from "../../server/models/User";
import Product from "../../server/models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") return res.status(405).end();

  const { userId, cartItems } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  for (let item of cartItems) {
    let product = await Product.findById(item.productId);
    if (product.availableQuantity < item.quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}` });
    }
    product.availableQuantity -= item.quantity;
    await product.save();
  }

  user.cartData = [];
  await user.save();
  
  res.status(200).json({ message: "Checkout successful!" });
}

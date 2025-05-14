import connectDB from "@/server/db";
import User from "@/server/models/User";

export default async function handler(req, res) {
  await connectDB();

  try {
    const { userId } = req.method === "GET" ? req.query : req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    switch (req.method) {
      case "GET":
        return res.status(200).json(user.cartData);

      case "POST": {
        const { productId, quantity } = req.body;
        if (!productId || quantity === undefined || quantity < 1) {
          return res.status(400).json({ message: "Valid Product ID and quantity are required." });
        }

        // Check if the product already exists in the cart
        const existingItem = user.cartData.find(item => item.productId.toString() === productId);

        if (existingItem) {
          existingItem.quantity_demanded += quantity;
        } else {
          user.cartData.push({ productId, quantity_demanded: quantity });
        }

        await user.save();
        return res.status(201).json(user.cartData);
      }

      case "PUT": {
        const { productId, quantity } = req.body;
        if (!productId || quantity === undefined || quantity < 1) {
          return res.status(400).json({ message: "Valid Product ID and updated quantity are required." });
        }

        const cartItem = user.cartData.find(item => item.productId.toString() === productId);
        if (!cartItem) {
          return res.status(404).json({ message: "Product not found in cart." });
        }

        cartItem.quantity_demanded = quantity;
        await user.save();
        return res.status(200).json(user.cartData);
      }

      case "DELETE": {
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).json({ message: "Product ID is required." });
        }

        user.cartData = user.cartData.filter(item => item.productId.toString() !== productId);
        await user.save();

        return res.status(200).json(user.cartData);
      }

      default:
        return res.status(405).json({ message: "Method Not Allowed." });
    }
  } catch (error) {
    console.error("Cart API Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}

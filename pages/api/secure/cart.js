// pages/api/secure/cart.js

import connectDB from "@/server/db";
import User from "@/server/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  try {
    const { userId } = req.method === "GET" ? req.query : req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const { productId, quantity, variantId } = req.body;

    // Convert variantId to ObjectId if valid, otherwise null
    let variantObjectId = null;
    if (variantId) {

      console.log("VArian id", req.body);
      if (!mongoose.Types.ObjectId.isValid(variantId))
        return res.status(400).json({ message: "Invalid variantId." });
      variantObjectId = new mongoose.Types.ObjectId(variantId);
    }

    // Helper to check if two variantIds match
    const isSameVariant = (id1, id2) => {
      if (!id1 && !id2) return true; // both null/undefined
      if (id1 && id2) return id1.toString() === id2.toString();
      return false;
    };

    switch (req.method) {
      case "GET":
        return res.status(200).json(user.cartData);

      case "POST":
        if (!productId || quantity === undefined || quantity < 1)
          return res.status(400).json({ message: "Valid Product ID and quantity are required." });

        const existingItem = user.cartData.find(
          (item) => item.productId.toString() === productId && isSameVariant(item.variantId, variantObjectId)
        );

        if (existingItem) {
          existingItem.quantity_demanded += quantity;
        } else {
          user.cartData.push({ productId, quantity_demanded: quantity, variantId: variantObjectId });
        }

        await user.save();
        return res.status(201).json(user.cartData);

      case "PUT":
        if (!productId || quantity === undefined || quantity < 1)
          return res.status(400).json({ message: "Valid Product ID and updated quantity are required." });

        const cartItem = user.cartData.find(
          (item) => item.productId.toString() === productId && isSameVariant(item.variantId, variantObjectId)
        );

        if (!cartItem) return res.status(404).json({ message: "Product not found in cart." });

        cartItem.quantity_demanded = quantity;
        await user.save();
        return res.status(200).json(user.cartData);

      case "DELETE":
        if (!productId) return res.status(400).json({ message: "Product ID is required." });

        user.cartData = user.cartData.filter(
          (item) => !(item.productId.toString() === productId && isSameVariant(item.variantId, variantObjectId))
        );

        await user.save();
        return res.status(200).json(user.cartData);

      default:
        return res.status(405).json({ message: "Method Not Allowed." });
    }
  } catch (error) {
    console.error("Cart API Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}

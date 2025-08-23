// pages/api/secure/cart.js

import connectDB from "@/server/db";
import User from "@/server/models/User";

/**
 * API Route: Cart Management
 *
 * Supports the following operations for a user's cart:
 * - GET:    Fetch the user's cart
 * - POST:   Add a new product or increase quantity
 * - PUT:    Update the quantity of an existing product
 * - DELETE: Remove a product from the cart
 */
export default async function handler(req, res) {
  await connectDB();

  try {
    // Extract userId depending on request method
    const { userId } = req.method === "GET" ? req.query : req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    switch (req.method) {
      /**
       * GET: Return all cart items for the user
       */
      case "GET": {
        return res.status(200).json(user.cartData);
      }

      /**
       * POST: Add a product to cart
       * - If product already exists, increment its quantity
       * - Otherwise, push a new product entry
       */
      case "POST": {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined || quantity < 1) {
          return res
            .status(400)
            .json({ message: "Valid Product ID and quantity are required." });
        }

        const existingItem = user.cartData.find(
          (item) => item.productId.toString() === productId
        );

        if (existingItem) {
          existingItem.quantity_demanded += quantity;
        } else {
          user.cartData.push({ productId, quantity_demanded: quantity });
        }

        await user.save();
        return res.status(201).json(user.cartData);
      }

      /**
       * PUT: Update the quantity of an existing product in cart
       */
      case "PUT": {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined || quantity < 1) {
          return res
            .status(400)
            .json({ message: "Valid Product ID and updated quantity are required." });
        }

        const cartItem = user.cartData.find(
          (item) => item.productId.toString() === productId
        );

        if (!cartItem) {
          return res
            .status(404)
            .json({ message: "Product not found in cart." });
        }

        cartItem.quantity_demanded = quantity;
        await user.save();

        return res.status(200).json(user.cartData);
      }

      /**
       * DELETE: Remove a product from the cart
       */
      case "DELETE": {
        const { productId } = req.body;

        if (!productId) {
          return res.status(400).json({ message: "Product ID is required." });
        }

        user.cartData = user.cartData.filter(
          (item) => item.productId.toString() !== productId
        );

        await user.save();
        return res.status(200).json(user.cartData);
      }

      /**
       * Unsupported method handler
       */
      default: {
        return res.status(405).json({ message: "Method Not Allowed." });
      }
    }
  } catch (error) {
    console.error("Cart API Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
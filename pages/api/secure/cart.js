// pages/api/secure/cart.js
import connectDB from "@/server/db";
import User from "@/server/models/User";
import mongoose from "mongoose";
import Product from "@/server/models/Product";

const CART_ITEM_LIMIT = 5;

const validateProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const product = await Product.findById(id);
  return !!product;
};

const validateVariant = async (productId, variantId) => {
  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(variantId)) return false;

  const product = await Product.findOne(
    { _id: productId, "variants._id": variantId },
    { "variants.$": 1 }
  );
  return !!product;
};

export default async function handler(req, res) {
  await connectDB();

  try {
    const { userId } = req.method === "GET" ? req.query : req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const { productId, quantity, variantId } = req.body;

    let variantObjectId = null;
    if (variantId) {
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

    // 🔎 Helper to validate and clean cart
    const validateAndCleanCart = async (user) => {
      const validCart = [];
      for (let item of user.cartData) {
        const productValid = await validateProduct(item.productId);
        if (!productValid) continue; // skip invalid product

        if (item.variantId) {
          if(item.variantId.toString() !== item.productId.toString()){

            const variantValid = await validateVariant(item.productId, item.variantId);
            if (!variantValid) continue; // skip invalid variant
          }
        }

        if(item.quantity_demanded > CART_ITEM_LIMIT){
          item.quantity_demanded = CART_ITEM_LIMIT; // enforce limit
        }

        validCart.push(item);
      }
      user.cartData = validCart;
      await user.save();
      return user.cartData;
    };

    switch (req.method) {
      case "GET": {
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(200).json(cleanedCart);
      }

      case "POST": {
        if (!productId || quantity === undefined || quantity < 1)
          return res.status(400).json({ message: "Valid Product ID and quantity are required." });

        // Validate product/variant before adding

        const productValid = await validateProduct(productId);
        if (!productValid) {
          await validateAndCleanCart(user);
          return res.status(400).json({ message: "Invalid product." });
        }

        if(String(productId) !== String(variantId)){

          if (variantObjectId) {
            const variantValid = await validateVariant(productId, variantObjectId);
            if (!variantValid) {
              await validateAndCleanCart(user);
              return res.status(400).json({ message: "Invalid variant." });
            }
          }
          
        }
        const existingItem = user.cartData.find(
          (item) => item.productId.toString() === productId && isSameVariant(item.variantId, variantObjectId)
        );

        if(quantity > CART_ITEM_LIMIT){
          return res.status(400).json({ message: `Cannot add more than ${CART_ITEM_LIMIT} items of the same product.` });
        }

        if (existingItem) {
          if(existingItem.quantity_demanded + quantity > CART_ITEM_LIMIT){
            return res.status(400).json({ message: `Cannot add more than ${CART_ITEM_LIMIT} items of the same product.` });
          }
          existingItem.quantity_demanded += quantity;
        } else {
          user.cartData.push({ productId, quantity_demanded: quantity, variantId: variantObjectId });
        }

        await user.save();
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(201).json(cleanedCart);
      }

      case "PUT": {
        if (!productId || quantity === undefined || quantity < 1)
          return res.status(400).json({ message: "Valid Product ID and updated quantity are required." });

        // Validate product/variant before updating
        const productValid = await validateProduct(productId);
        if (!productValid) {
          await validateAndCleanCart(user);
          return res.status(400).json({ message: "Invalid product." });
        }

        if (variantObjectId) {
          const variantValid = await validateVariant(productId, variantObjectId);
          if (!variantValid) {
            await validateAndCleanCart(user);
            return res.status(400).json({ message: "Invalid variant." });
          }
        }

        const cartItem = user.cartData.find(
          (item) => item.productId.toString() === productId && isSameVariant(item.variantId, variantObjectId)
        );

        if (!cartItem) return res.status(404).json({ message: "Product not found in cart." });
        
        if(quantity > CART_ITEM_LIMIT){
          return res.status(400).json({ message: `Cannot add more than ${CART_ITEM_LIMIT} items of the same product.` });
        }
        cartItem.quantity_demanded = quantity;
        await user.save();
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(200).json(cleanedCart);
      }

      case "DELETE": {
        if (!productId) return res.status(400).json({ message: "Product ID is required." });

        user.cartData = user.cartData.filter(
          (item) => !(item.productId.toString() === productId && isSameVariant(item.variantId, variantObjectId))
        );

        await user.save();
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(200).json(cleanedCart);
      }

      default:
        return res.status(405).json({ message: "Method Not Allowed." });
    }
  } catch (error) {
    console.error("Cart API Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}

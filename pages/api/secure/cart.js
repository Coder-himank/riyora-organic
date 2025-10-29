// pages/api/secure/cart.js
import connectDB from "@/server/db";
import User from "@/server/models/User";
import mongoose, {Types} from "mongoose";
import Product from "@/server/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // adjust path if your auth file is located elsewhere

const CART_ITEM_LIMIT = 5;

/**
 * Check that product with given id exists
 * @param {string|ObjectId} id
 * @returns {Promise<boolean>}
 */
const validateProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) return false;
  const exists = await Product.exists({ _id: id });
  return !!exists;
};

/**
 * Validate a variant belongs to a product.
 * If variantId equals productId (single-variant or product-as-variant cases),
 * we treat it as valid when product exists.
 * @param {string|ObjectId} productId
 * @param {string|ObjectId} variantId
 * @returns {Promise<boolean>}
 */
const validateVariant = async (productId, variantId) => {
  if (!mongoose.Types.ObjectId.isValid(String(productId)) || !mongoose.Types.ObjectId.isValid(String(variantId))) return false;

  // If they are same id — treat as valid if product exists
  if (String(productId) === String(variantId)) {
    const exists = await Product.exists({ _id: productId });
    return !!exists;
  }

  // Check if product contains this variant (assumes variants are stored under "variants._id")
  const exists = await Product.exists({ _id: productId, "variants._id": variantId });
  return !!exists;
};

/**
 * Compare two variant ids which may be null/undefined or ObjectIds
 */
const isSameVariant = (id1, id2) => {
  if (!id1 && !id2) return true;
  if (!id1 || !id2) return false;
  return String(id1) === String(id2);
};

export default async function handler(req, res) {
  await connectDB();

  try {
    // Authenticate user using NextAuth session (prevents trusting client-provided userId)
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const userId = session.user.id;

    // Load user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // common parsed inputs
    const { productId: rawProductId, quantity: rawQuantity, variantId: rawVariantId } = req.method === "GET" ? req.query : req.body;

    // Convert quantity (if provided) to number
    const quantity = rawQuantity !== undefined ? Number(rawQuantity) : undefined;

    // Normalize productId/variantId (don't require them for GET)
    const productId = rawProductId ? String(rawProductId) : undefined;
    const variantId = rawVariantId ? String(rawVariantId) : undefined;

    // Convert variantId to ObjectId if present and valid
    let variantObjectId = null;
    if (variantId) {
      if (!mongoose.Types.ObjectId.isValid(variantId)) {
        return res.status(400).json({ message: "Invalid variantId." });
      }
      variantObjectId = new mongoose.Types.ObjectId(variantId);
    }

    // Helper: validate & clean cart; only save if changed
    const validateAndCleanCart = async (userDoc) => {
      const original = (userDoc.cartData || []).map(item => ({
        productId: String(item.productId),
        variantId: item.variantId ? String(item.variantId) : null,
        quantity_demanded: item.quantity_demanded
      }));

      const validCart = [];
      for (let item of userDoc.cartData || []) {
        const pid = String(item.productId);
        const vid = item.variantId ? String(item.variantId) : null;

        const productValid = await validateProduct(pid);
        if (!productValid) continue;

        if (vid) {
          // If variantId different than productId, ensure variant exists for product
          if (vid !== pid) {
            const variantValid = await validateVariant(pid, vid);
            if (!variantValid) continue;
          }
        }

        // enforce item limit
        if (item.quantity_demanded > CART_ITEM_LIMIT) {
          item.quantity_demanded = CART_ITEM_LIMIT;
        }

        validCart.push({
          productId: item.productId,
          variantId: item.variantId ? item.variantId : null,
          quantity_demanded: item.quantity_demanded
        });
      }

      const normalizedNew = validCart.map(item => ({
        productId: String(item.productId),
        variantId: item.variantId ? String(item.variantId) : null,
        quantity_demanded: item.quantity_demanded
      }));

      // save only when changed
      const changed = JSON.stringify(original) !== JSON.stringify(normalizedNew);
      if (changed) {
        userDoc.cartData = validCart;
        await userDoc.save();
      }
      return userDoc.cartData;
    };

    switch (req.method) {
      case "GET": {
        // Return cleaned cart for authenticated user
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(200).json(cleanedCart);
      }

      case "POST": {
        // Add item to cart
        if (!productId || quantity === undefined || isNaN(quantity) || quantity < 1) {
          return res.status(400).json({ message: "Valid Product ID and quantity are required." });
        }

        // enforcement
        if (quantity > CART_ITEM_LIMIT) {
          return res.status(400).json({ message: `Cannot add more than ${CART_ITEM_LIMIT} items of the same product.` });
        }

        // Validate product exists
        const productValid = await validateProduct(productId);
        if (!productValid) {
          await validateAndCleanCart(user);
          return res.status(400).json({ message: "Invalid product." });
        }

        // Validate variant only if provided and different from productId
        if (variantObjectId && String(variantObjectId) !== String(productId)) {
          const variantValid = await validateVariant(productId, variantObjectId);
          if (!variantValid) {
            await validateAndCleanCart(user);
            return res.status(400).json({ message: "Invalid variant." });
          }
        }

        // Find existing item in cart (corrected logic)
        const existingItem = user.cartData.find(
          (item) =>
            String(item.productId) === String(productId) &&
            isSameVariant(item.variantId, variantObjectId)
        );

        if (existingItem) {
          if (existingItem.quantity_demanded + quantity > CART_ITEM_LIMIT) {
            return res.status(400).json({ message: `Cannot add more than ${CART_ITEM_LIMIT} items of the same product.` });
          }
          existingItem.quantity_demanded += quantity;
        } else {
          // push a new item. store variantId as ObjectId or null

user.cartData.push({
  productId: Types.ObjectId.isValid(productId) ? new Types.ObjectId(productId) : productId,
  quantity_demanded: quantity,
  variantId: variantObjectId && Types.ObjectId.isValid(variantObjectId)
    ? new Types.ObjectId(variantObjectId)
    : null
});

        }

        await user.save();
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(201).json(cleanedCart);
      }

      case "PUT": {
        // Update item quantity
        if (!productId || quantity === undefined || isNaN(quantity) || quantity < 1) {
          return res.status(400).json({ message: "Valid Product ID and updated quantity are required." });
        }

        if (quantity > CART_ITEM_LIMIT) {
          return res.status(400).json({ message: `Cannot set more than ${CART_ITEM_LIMIT} items of the same product.` });
        }

        // Validate product
        const productValid = await validateProduct(productId);
        if (!productValid) {
          await validateAndCleanCart(user);
          return res.status(400).json({ message: "Invalid product." });
        }

        // Validate variant if present
        if (variantObjectId && String(variantObjectId) !== String(productId)) {
          const variantValid = await validateVariant(productId, variantObjectId);
          if (!variantValid) {
            await validateAndCleanCart(user);
            return res.status(400).json({ message: "Invalid variant." });
          }
        }

        const cartItem = user.cartData.find(
          (item) => String(item.productId) === String(productId) && isSameVariant(item.variantId, variantObjectId)
        );

        if (!cartItem) return res.status(404).json({ message: "Product not found in cart." });

        cartItem.quantity_demanded = quantity;
        await user.save();
        const cleanedCart = await validateAndCleanCart(user);
        return res.status(200).json(cleanedCart);
      }

      case "DELETE": {
        if (!productId) return res.status(400).json({ message: "Product ID is required." });

        user.cartData = (user.cartData || []).filter(
          (item) => !(String(item.productId) === String(productId) && isSameVariant(item.variantId, variantObjectId))
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

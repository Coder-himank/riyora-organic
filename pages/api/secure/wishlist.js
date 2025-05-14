import connectDB from "@/server/db";
import User from "@/server/models/User";

export default async function handler(req, res) {
  await connectDB();

  // await authMiddleware(res, req);

  try {
    const { userId } = req.method === "GET" ? req.query : req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.wishlistData = user.wishlistData || []; // Ensure wishlistData is an array

    switch (req.method) {
      case "POST": {
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).json({ message: "Product ID is required." });
        }

        // Check if product is already in wishlist
        const alreadyExists = user.wishlistData.some(item => item.productId.toString() === productId);
        if (alreadyExists) {
          return res.status(200).json({ message: "Product already in wishlist.", wishlist: user.wishlistData });
        }

        user.wishlistData.push({ productId, addedAt: new Date() });
        await user.save();

        return res.status(200).json({ message: "Added to wishlist.", wishlist: user.wishlistData });
      }

      case "GET":
        return res.status(200).json({ wishlist: user.wishlistData });

      case "DELETE": {
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).json({ message: "Product ID is required." });
        }

        const updatedWishlist = user.wishlistData.filter(item => item.productId.toString() !== productId);
        if (updatedWishlist.length === user.wishlistData.length) {
          return res.status(404).json({ message: "Product not found in wishlist." });
        }

        user.wishlistData = updatedWishlist;
        await user.save();

        return res.status(200).json({ message: "Removed from wishlist.", wishlist: user.wishlistData });
      }

      default:
        return res.status(405).json({ message: "Method Not Allowed." });
    }
  } catch (error) {
    console.error("Wishlist API Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}

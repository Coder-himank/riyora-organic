// pages/api/secure/review.js

import connectDB from "@/server/db";
import Product from "@/server/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    /** Step 1: Auth — derive user identity from server session */
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const userName = session.user.name || "Anonymous";

    /** Step 2: Rate-limit per user (to prevent spam) */
    await rateLimit(req, res, { key: `review-${userId}`, points: 10, duration: 60 });

    /** Step 3: Validate input */
    const { productId, comment, rating, images } = req.body || {};

    if (!productId || !comment) {
      return res.status(400).json({ error: "Product ID and comment are required." });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5." });
    }

    const safeComment = String(comment).trim().slice(0, 1000); // limit length

    /** Step 4: Fetch and verify product */
    const product = await Product.findById(productId);
    if (!product || product.deleted) {
      return res.status(404).json({ error: "Product not found." });
    }

    /** Step 5: Prevent duplicate review by same user */
    const alreadyReviewed = product.reviews.some(
      (r) => r.userId?.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: "You have already reviewed this product." });
    }

    /** Step 6: Create review object */
    const review = {
      // _id: new Date().getTime().toString(), // local unique ID for client reference
      name: userName,
      userId,
      comment: safeComment,
      rating: numericRating,
      images: Array.isArray(images) ? images.slice(0, 5) : [],
      createdAt: new Date(),
    };

    /** Step 7: Add review and recalculate rating */
    product.reviews.push(review);

    const totalReviews = product.reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            product.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
            totalReviews
          ).toFixed(2)
        : 0;

    product.averageRating = Number(averageRating);
    product.numReviews = totalReviews;

    /** Step 8: Save product */
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: {
        name: review.name,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
      },
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
  } catch (err) {
    console.error("Review API Error:", err);
    return res.status(500).json({ error: "Failed to submit review." });
  }
}

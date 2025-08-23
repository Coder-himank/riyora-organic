// pages/api/sitemap.xml.js
import { MongoClient } from "mongodb";
import connectDB from "@/server/db";

/**
 * API Route: Generate XML Sitemap
 *
 * - Supports static pages and product pages
 * - Uses MongoDB to fetch product IDs dynamically
 * - Returns an XML sitemap compliant with search engine requirements
 */
export default async function handler(req, res) {
  try {
    const baseUrl = process.env.BASE_URL || "https://organic-robust.vercel.app";

    // Supported locales (expand in the future if multi-language is needed)
    const locales = ["en"];

    // Ensure DB connection
    await connectDB();
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Fetch product IDs (only fetch _id for efficiency)
    const products = await db.collection("products").find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray();

    await client.close();

    // Static pages included in sitemap
    const staticPages = [
      "",
      "about",
      "contact",
      "products",
      "privacy-policy",
      "services",
      "authenticate"
    ];

    // Generate XML for static pages
    const staticUrls = staticPages
      .map(
        (page) => `
        <url>
          <loc>${baseUrl}/${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>`
      )
      .join("");

    // Generate XML for product pages
    const productUrls = products
      .map(
        (product) => `
        <url>
          <loc>${baseUrl}/products/${product._id.toString()}</loc>
          <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`
      )
      .join("");

    // Final XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
              xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${staticUrls}
        ${productUrls}
      </urlset>`;

    // Respond with XML content
    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
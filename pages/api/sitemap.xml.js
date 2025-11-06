// pages/api/sitemap.xml.js
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import connectDB from "@/server/db";

export default async function handler(req, res) {
  try {
    const baseUrl = "http://localhost:3000" || process.env.BASE_URL || "https://organic-robust.vercel.app";

    // --- 1️⃣ Connect to DB ---
    await connectDB();
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // --- 2️⃣ Fetch product data ---
    const products = await db
      .collection("products")
      .find({visible : true}, { projection: { slug: 1, updatedAt: 1 } })
      .toArray();
    const blogs = await db
      .collection("blogs")
      .find({visible : true}, { projection: { slug: 1, updatedAt: 1 } })
      .toArray();

    await client.close();

    // --- 3️⃣ Define static routes (based on your screenshot) ---
    const staticPages = [
      "",
      "about",
      "authenticate",
      "career",
      "cart",
      "checkout",
      "contact",
      "customer-care",
      "dashboard",
      "Faqs",
      "privacy-policy",
      "refund-policy",
      "services",
      "shipping-policy",
      "support",
      "termsAndCondition",
      "visionAndMission",
      "blogs",
    ];

    // --- 4️⃣ Dynamic routes (expand if more exist later) ---
    // Assuming user pages like /[userId]
    const dynamicUsers = []; // fetch from DB if applicable

    // --- 5️⃣ Generate XML for static pages ---
    const staticUrls = staticPages
      .map(
        (page) => `
        <url>
          <loc>${baseUrl}/${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>`
      )
      .join("");

    // --- 6️⃣ Generate XML for product pages ---
    const productUrls = products
      .map(
        (p) => `
        <url>
          <loc>${baseUrl}/products/${p.slug || p._id}</loc>
          <lastmod>${new Date(p.updatedAt || Date.now()).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1</priority>
        </url>`
      )
      .join("");

    // --- 6 Generate XML for blogs pages ---
    const blogUrls = blogs
      .map(
        (b) => `
        <url>
          <loc>${baseUrl}/blogs/${b.slug || b._id}</loc>
          <lastmod>${new Date(b.updatedAt || Date.now()).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>`
      )
      .join("");

    // --- 7️⃣ Generate XML for user pages (optional) ---
    const userUrls = dynamicUsers
      .map(
        (userId) => `
        <url>
          <loc>${baseUrl}/${userId}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>`
      )
      .join("");

    // --- 8️⃣ Combine into final XML sitemap ---
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticUrls}
        ${productUrls}
        ${blogUrls}
        ${userUrls}
      </urlset>`;

    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

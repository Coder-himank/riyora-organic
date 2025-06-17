import { MongoClient } from "mongodb";
import connectDB from "@/server/db";

export default async function handler(req, res) {
    try {
        // Define the base URL (fallback for local testing)
        const baseUrl = process.env.BASE_URL || "https://organic-robust.vercel.app";

        // Supported languages for internationalization (i18n)
        const locales = ["en"];

        // Connect to MongoDB
        await connectDB();
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        // Fetch products from MongoDB (only necessary fields)
        const products = await db.collection("products").find({}, "_id").toArray();

        // Close the database connection
        await client.close();

        // Static pages to include in the sitemap
        const staticPages = [
            "",
            "about",
            "contact",
            "products",
            "privacy-policy",
            "services",
            "authenticate"
        ];

        // Generate XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
                xmlns:xhtml="http://www.w3.org/1999/xhtml">
            
            ${staticPages.map((page) =>
            `<url>
                                    <loc>${baseUrl}/${page}</loc>
                                    <lastmod>${new Date().toISOString()}</lastmod>
 
                                </url>
                            `

        )
                .join("")}

            ${products
                .map((product) =>
                    `
                                <url>
                                    <loc>${baseUrl}/products/${product._id.toString()}</loc>
                                    <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>
                                    <changefreq>weekly</changefreq>
                                    <priority>0.8</priority>
                                    
                                </url>
                            `
                )
                .join("")}
        </urlset>`;

        // Set response headers and send the sitemap
        res.setHeader("Content-Type", "text/xml");
        return res.status(200).send(sitemap);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

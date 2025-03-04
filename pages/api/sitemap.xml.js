import { MongoClient } from "mongodb";
import connectDB from '@/server/db'
export default async function handler(req, res) {
    const baseUrl = process.env.BASE_URL // Change this to your actual domain

    // Supported languages
    const locales = ["en", "hi"]; // Add all languages you support

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Fetch products from MongoDB
    const products = await db.collection("products").find().toArray();

    client.close();

    // Static pages
    const staticPages = [
        "",
        "about",
        "contact",
        "products",
        "privacy-policy",
        "services",
        "cart",
        "wishlist",
        "authenticate"
    ];

    // Generate XML sitemap with language variations
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${staticPages
            .map((page) =>
                locales
                    .map((locale) => `
                        <url>
                            <loc>${baseUrl}/${locale}/${page}</loc>
                            ${locales
                            .map(
                                (altLang) => `<xhtml:link 
                                        rel="alternate" 
                                        hreflang="${altLang}" 
                                        href="${baseUrl}/${altLang}/${page}" />`
                            )
                            .join("")}
                        </url>
                    `)
                    .join("")
            )
            .join("")}
        ${products
            .map((product) =>
                locales
                    .map((locale) => `
                        <url>
                            <loc>${baseUrl}/${locale}/products/${product._id}</loc>
                            ${locales
                            .map(
                                (altLang) => `<xhtml:link 
                                        rel="alternate" 
                                        hreflang="${altLang}" 
                                        href="${baseUrl}/${altLang}/products/${product._id}" />`
                            )
                            .join("")}
                        </url>
                    `)
                    .join("")
            )
            .join("")}
    </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
}

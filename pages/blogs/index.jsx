import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Blog from '@/components/blog';
import styles from '@/styles/blogs.module.css';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const brandName = "Riyora Organic";
    const pageTitle = `${brandName} Hair Oil Blogs | Natural Hair Care Tips & Benefits`;
    const pageDescription = "Discover expert tips, benefits, and guides about Riyora Organic Hair Oil. Learn how our natural ingredients promote healthy, shiny hair. Read the latest blogs for hair care inspiration.";
    const pageUrl = "https://riyoraorganic.com/blogs";
    const logoUrl = "https://riyoraorganic.com/logo.png";

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`/api/getblogs`);
                const data = response.data;
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <>
            {/* SEO & Social Meta Tags */}
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="Riyora Organic, Hair Oil, Hair Care Tips, Natural Hair Care, Ayurvedic Hair Oil, Herbal Hair Oil, Healthy Hair, Blog" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={pageUrl} />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:image" content={logoUrl} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={logoUrl} />

                {/* Structured Data for the Blog Page */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            "name": pageTitle,
                            "description": pageDescription,
                            "url": pageUrl,
                            "publisher": {
                                "@type": "Organization",
                                "name": brandName,
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": logoUrl
                                }
                            },
                            "mainEntityOfPage": pageUrl
                        })
                    }}
                />
            </Head>

            <main>
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <h1>{brandName} Hair Care Blog</h1>
                    <p>Explore expert tips, Ayurvedic hair care guides, and insights for naturally healthy, shiny hair.</p>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading blogs...</p>
                ) : (
                    <motion.section
                        className={styles.blog_container}
                        viewport={{ once: true }}
                        aria-label="Latest Blog Posts"
                    >
                        <div className={styles.blogs_wrap}>
                            {blogs.map((blog, index) => (
                                <article key={index} className={styles.blog_card}>
                                    {/* Individual Blog Structured Data */}
                                    <Head>
                                        <script
                                            type="application/ld+json"
                                            dangerouslySetInnerHTML={{
                                                __html: JSON.stringify({
                                                    "@context": "https://schema.org",
                                                    "@type": "BlogPosting",
                                                    "headline": blog.title,
                                                    "description": blog.summary,
                                                    "url": `${pageUrl}/${blog.slug}`,
                                                    "datePublished": blog.publishedAt,
                                                    "author": {
                                                        "@type": "Person",
                                                        "name": blog.author || brandName
                                                    },
                                                    "publisher": {
                                                        "@type": "Organization",
                                                        "name": brandName,
                                                        "logo": {
                                                            "@type": "ImageObject",
                                                            "url": logoUrl
                                                        }
                                                    },
                                                    "image": blog.image || logoUrl,
                                                    "mainEntityOfPage": `${pageUrl}/${blog.slug}`
                                                })
                                            }}
                                        />
                                    </Head>

                                    {/* Blog Component */}
                                    <Blog {...blog} />
                                </article>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Hidden preloaded logo for SEO & performance */}
                <div style={{ display: 'none' }}>
                    <Image src={logoUrl} alt={`${brandName} Logo`} width={120} height={120} priority />
                </div>
            </main>
        </>
    );
};

export default Blogs;

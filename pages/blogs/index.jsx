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


    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`/api/getblogs`);
                // console.log(response);

                const data = await response.data;
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);
    const brandName = "Riyora Organic";
    const pageTitle = `${brandName} Hair Oil Blogs | Natural Hair Care Tips & Benefits`;
    const pageDescription = "Discover expert tips, benefits, and guides about Riyora Organic Hair Oil. Learn how our natural ingredients promote healthy, shiny hair. Read the latest blogs for hair care inspiration.";
    const pageUrl = "https://riyora-organic.vercel.app/blogs";
    const logoUrl = "https://riyora-organic.vercel.app/logo.png";

    <>
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:image" content={logoUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={logoUrl} />
            <link rel="canonical" href={pageUrl} />
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
                        "image": logoUrl,
                        "mainEntityOfPage": pageUrl
                    })
                }}
            />
        </Head>
        <div style={{ display: 'none' }}>
            <Image src={logoUrl} alt={`${brandName} Logo`} width={120} height={120} priority />
        </div>
    </>
    return (
        <>
            {/* <div className="navHolder"></div> */}
            <div>
                <center><h1>Blogs</h1></center>
                {loading ? (
                    <p>Loading...</p>
                ) : (

                    <motion.section className={styles.blog_container} viewport={{ once: true }}>
                        <div className={styles.blogs_wrap}>

                            {blogs.map((blog, index) => (
                                <Blog key={index} {...blog} />
                            ))}
                        </div>
                    </motion.section>

                )}
            </div>
        </>
    );

};


export default Blogs;
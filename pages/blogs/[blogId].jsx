import axios from 'axios';
import styles from '@/styles/blogPage.module.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const BlogPage = ({ blogId }) => {
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const siteUrl = "https://riyoraorganic.com";
    const brandName = "Riyora Organic";

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/getblogs?blogId=${blogId}`);
                const blogData = res.data;
                if (!blogData) {
                    setError("Blog Not Found : Invalid Blog Id");
                } else {
                    setBlog(blogData);
                    setError(null);
                }
            } catch (err) {
                setError("Error Fetching Blog Data");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
    }, [blogId]);

    const renderSection = (secData, index) => {
        const sectionId = secData.heading?.toLowerCase().replace(/\s+/g, '-');
        switch (secData.type) {
            case 'text':
            case 'quote':
                return (
                    <section key={index} id={sectionId} className={styles.sections}>
                        {secData.images?.[0]?.url && (
                            <div className={styles.sectionImageWrapper}>
                                <Image
                                    src={secData.images[0].url}
                                    width={400}
                                    height={400}
                                    alt={secData.heading || 'Section Image'}
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className={styles.sectionContent}>
                            {secData.heading && <h2>{secData.heading}</h2>}
                            <p>{secData.content}</p>
                        </div>
                    </section>
                );
            case 'image':
                return (
                    <section key={index} id={sectionId} className={styles.sections}>
                        {secData.images?.[0]?.url && (
                            <div className={styles.sectionImageWrapper}>
                                <Image
                                    src={secData.images[0].url}
                                    width={800}
                                    height={400}
                                    alt={secData.heading || 'Image Section'}
                                    loading="lazy"
                                />
                            </div>
                        )}
                        {secData.heading && <h2>{secData.heading}</h2>}
                    </section>
                );
            case 'list':
                return (
                    <section key={index} id={sectionId} className={styles.sections}>
                        {secData.heading && <h2>{secData.heading}</h2>}
                        <ul className={styles.listSection}>
                            {secData.listItems?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </section>
                );
            case 'code':
                return (
                    <section key={index} className={styles.sections}>
                        {secData.heading && <h2>{secData.heading}</h2>}
                        <pre className={styles.codeBlock}>
                            <code>{secData.content}</code>
                        </pre>
                    </section>
                );
            default:
                return null;
        }
    };

    const blogUrl = blog ? `${siteUrl}/blogs/${blog.slug}` : siteUrl;
    const blogImage = blog?.imageUrl || `${siteUrl}/logo.png`;
    const blogDescription = blog?.description.slice(0, 150) + '...' || "Discover natural hair care tips and benefits of Riyora Organic Hair Oil. Read our latest blog articles for healthy, beautiful hair.";

    return (
        <>
            {/* SEO & Social Meta Tags */}
            <Head>
                <title>{blog ? `${blog.title} | ${brandName}` : `${brandName} Blog`}</title>
                <meta name="description" content={blogDescription} />
                <meta name="keywords" content={`Riyora Organic, Hair Oil, ${blog?.title || ''}, Natural Hair Care, Ayurvedic Hair Oil, Herbal Hair Oil, Healthy Hair`} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={blogUrl} />

                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={blog ? `${blog.title} | ${brandName}` : `${brandName} Blog`} />
                <meta property="og:description" content={blogDescription} />
                <meta property="og:url" content={blogUrl} />
                <meta property="og:image" content={blogImage} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog ? `${blog.title} | ${brandName}` : `${brandName} Blog`} />
                <meta name="twitter:description" content={blogDescription} />
                <meta name="twitter:image" content={blogImage} />

                {/* Structured Data */}
                {blog && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BlogPosting",
                                "headline": blog.title,
                                "description": blogDescription,
                                "url": blogUrl,
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
                                        "url": `${siteUrl}/logo.png`
                                    }
                                },
                                "image": blogImage,
                                "mainEntityOfPage": blogUrl
                            })
                        }}
                    />
                )}
            </Head>

            <main>
                {loading ? (
                    <center><h1>Loading...</h1></center>
                ) : error ? (
                    <center><h1>{error}</h1></center>
                ) : (
                    <article className={styles.blog_container}>
                        <div className={styles.mainContentBox}>
                            {blog.imageUrl && (
                                <div className={styles.bannerImageWrapper}>
                                    <Image
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        width={1200}
                                        height={400}
                                        priority
                                        className={styles.bannerImage}
                                    />
                                </div>
                            )}
                            <div className={styles.textWrapper}>
                                <h1>{blog.title}</h1>
                                <p className={styles.description}>{blog.description}</p>
                            </div>
                        </div>

                        {/* Render dynamic blog sections */}
                        {blog.sections?.map((secData, idx) => renderSection(secData, idx))}

                        <footer style={{ marginTop: '2rem' }}>
                            <p>
                                Read more <Link href="/blogs">blogs</Link> from {brandName}.
                            </p>
                        </footer>
                    </article>
                )}
            </main>
        </>
    );
};

export async function getStaticPaths() {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/api/getblogs`);
        const blogs = res.data;

        const paths = blogs.map(blog => ({
            params: { blogId: blog._id.toString() }
        }));

        return { paths, fallback: true };
    } catch (error) {
        console.error('Error fetching blog paths:', error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps({ params }) {
    return { props: { blogId: params.blogId } };
}

export default BlogPage;

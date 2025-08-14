import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/blogPage.module.css'; // Adjust the path as necessary
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
const BlogPage = ({ blogId }) => {
    const [blog, setBlog] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchBlogdata = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/api/getblogs?blogId=${blogId}`);
                const blog = res.data;
                if (!blog) {
                    setError("Blog Not Found : Invalid Blog Id")
                } else {
                    setBlog(blog)
                    setError(null)
                }
            } catch (error) {
                setError("Error Fetching Blog Data")
            } finally {
                setLoading(false)
            }

        }
        fetchBlogdata();
    }, [])


    return (
        <>
            <Head>
                <title>{blog ? `${blog.title} | Riyora Organic Hair Oil` : 'Riyora Organic Hair Oil Blog'}</title>
                <meta name="description" content={blog ? blog.description.slice(0, 150) + '...' : 'Discover natural hair care tips and benefits of Riyora Organic Hair Oil. Read our latest blog articles for healthy, beautiful hair.'} />
                <meta name="keywords" content="Riyora Organic, Hair Oil, Organic Hair Oil, Hair Care, Natural Hair, Hair Growth, Herbal Oil, Healthy Hair, Blog" />
                <meta property="og:title" content={blog ? `${blog.title} | Riyora Organic Hair Oil` : 'Riyora Organic Hair Oil Blog'} />
                <meta property="og:description" content={blog ? blog.description.slice(0, 150) + '...' : 'Discover natural hair care tips and benefits of Riyora Organic Hair Oil.'} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://riyora-organic.vercel.app/blogs/${blogId}`} />
                <meta property="og:site_name" content="Riyora Organic Hair Oil" />
                <meta property="og:image" content={blog && blog.imgUrl ? blog.imgUrl : 'https://riyora-organic.vercel.app/default-og-image.jpg'} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": blog ? blog.title : "Riyora Organic Hair Oil Blog",
                            "description": blog ? blog.description.slice(0, 150) + '...' : "Discover natural hair care tips and benefits of Riyora Organic Hair Oil.",
                            "image": blog && blog.imgUrl ? blog.imgUrl : "https://riyora-organic.vercel.app/default-og-image.jpg",
                            "author": {
                                "@type": "Organization",
                                "name": "Riyora Organic"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Riyora Organic",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://riyora-organic.vercel.app/logo.png"
                                }
                            },
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": `https://riyora-organic.vercel.app/blogs/${blogId}`
                            },
                            "datePublished": blog && blog.date ? blog.date : undefined
                        })
                    }}
                />
            </Head>
            <div>
                <div className="navHolder"></div>
                {loading ? (
                    <center> <h1>loading</h1> </center>
                ) : error ? (
                    <h1>{error}</h1>
                ) : (
                    <div className={styles.blog_container}>
                        <div className={styles.header}>


                        </div>

                        <div className={`${styles.mainSection} ${styles.sections}`}>

                            {blog.imgUrl && (
                                <Image
                                    src={blog.imgUrl}
                                    alt={blog.title}
                                    width={800}
                                    height={400}
                                    priority
                                    className={styles.bannerImage} />
                            )}
                            <div className={`${styles.mainContentBox} ${styles.sectionContent}`}>
                                <h1>{blog.title}</h1>
                                <p className={styles.description}>{blog.description}</p>
                            </div>
                        </div>

                        {blog?.sections && blog.sections.map((secData, index) => (
                            <section className={styles.sections}>
                                <div className={styles.sectionImageWrapper}>
                                    <Image
                                        src={secData.image}
                                        width={400}
                                        height={400}
                                        alt={secData.heading}
                                    />
                                </div>
                                <div className={styles.sectionContent}>
                                    <h2>{secData.heading}</h2>
                                    <p>{secData.text}</p>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export async function getStaticPaths() {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/api/getblogs`);
        const blogs = res.data;

        const paths = blogs.map((blog) => ({
            params: { blogId: blog._id.toString() },
        }));

        (paths);
        return {
            paths,
            fallback: true,
        };
    } catch (error) {
        console.error('Error fetching blog paths:', error);
        return {
            paths: [],
            fallback: true,
        };
    }
}

export async function getStaticProps({ params }) {
    return { props: { blogId: params.blogId } }
}

export default BlogPage;

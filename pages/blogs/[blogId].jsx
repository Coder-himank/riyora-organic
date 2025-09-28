import axios from 'axios';
import styles from '@/styles/blogPage.module.css';
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
    }, [blogId])

    const renderSection = (secData, index) => {
        switch (secData.type) {
            case 'text':
            case 'quote':
                return (
                    <section key={index} className={styles.sections}>
                        {secData.images?.[0]?.url && (
                            <div className={styles.sectionImageWrapper}>
                                <Image
                                    src={secData.images[0].url}
                                    width={400}
                                    height={400}
                                    alt={secData.heading || 'Section Image'}
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
                    <section key={index} className={styles.sections}>
                        {secData.images?.[0]?.url && (
                            <div className={styles.sectionImageWrapper}>
                                <Image
                                    src={secData.images[0].url}
                                    width={800}
                                    height={400}
                                    alt={secData.heading || 'Image Section'}
                                />
                            </div>
                        )}
                        {secData.heading && <h2>{secData.heading}</h2>}
                    </section>
                );
            case 'list':
                return (
                    <section key={index} className={styles.sections}>
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
    }

    return (
        <>
            <Head>
                <title>{blog ? `${blog.title} | Riyora Organic Hair Oil` : 'Riyora Organic Hair Oil Blog'}</title>
                <meta name="description" content={blog ? blog.description.slice(0, 150) + '...' : 'Discover natural hair care tips and benefits of Riyora Organic Hair Oil. Read our latest blog articles for healthy, beautiful hair.'} />
                <meta property="og:title" content={blog ? `${blog.title} | Riyora Organic Hair Oil` : 'Riyora Organic Hair Oil Blog'} />
                <meta property="og:description" content={blog ? blog.description.slice(0, 150) + '...' : 'Discover natural hair care tips and benefits of Riyora Organic Hair Oil.'} />
            </Head>

            <div className="navHolder"></div>

            {loading ? (
                <center><h1>Loading...</h1></center>
            ) : error ? (
                <h1>{error}</h1>
            ) : (
                <div className={styles.blog_container}>
                    <div className={styles.mainContentBox}>
                        {blog.imageUrl && (
                            <div className={styles.bannerImageWrapper}>
                                <Image
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    width={1200}
                                    height={400}
                                    priority
                                    className={styles.bannerImage} />
                            </div>
                        )}

                        <div className={styles.textWrapper}>

                            <h1>{blog.title}</h1>
                            <p className={styles.description}>{blog.description}</p>
                        </div>
                    </div>

                    {blog.sections?.map((secData, idx) => renderSection(secData, idx))}
                </div>
            )}
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
    return { props: { blogId: params.blogId } }
}

export default BlogPage;

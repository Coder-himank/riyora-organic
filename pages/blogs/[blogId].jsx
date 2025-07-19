import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/blogPage.module.css'; // Adjust the path as necessary
import { useEffect, useState } from 'react';
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
        <div>
            <div className="navHolder"></div>
            {loading ? (<center> <h1>loading</h1> </center>) : error ? <h1>{error}</h1> : (

                <div className={styles.blog_container}>

                    <h1>{blog.title}</h1>
                    <p>{blog.content}</p>

                </div>
            )}
        </div>
    );
};

export async function getStaticPaths() {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/api/getblogs`);
        const blogs = res.data;

        const paths = blogs.map((blog) => ({
            params: { blogId: blog.id.toString() },
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

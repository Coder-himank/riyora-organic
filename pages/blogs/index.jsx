import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import Blog from '@/components/blog';
import styles from '@/styles/blogs.module.css';
import axios from 'axios';
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
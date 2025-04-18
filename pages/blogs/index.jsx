import { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { motion } from 'framer-motion';
import Blog from '@/components/blog';
import styles from '@/styles/blogs.module.css';
import axios from 'axios';
const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('common');



    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`/api/blogs`);
                console.log(response);

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
            <div className="navHolder"></div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (

                    <motion.section className={styles.blogs} viewport={{ once: true }}>
                        <h1>Blogs</h1>
                        {blogs.map((blog, index) => (
                            <Blog key={index} {...blog} />
                        ))}
                    </motion.section>

                )}
            </div>
        </>
    );

};


// i18n Support
export async function getStaticProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}

export default Blogs;
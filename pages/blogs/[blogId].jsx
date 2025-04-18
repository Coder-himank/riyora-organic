import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import styles from '@/styles/blogPage.module.css'; // Adjust the path as necessary
const BlogPage = ({ blog, locale, locales }) => {
    const router = useRouter();
    const { t } = useTranslation('common');

    if (router.isFallback) {
        return <div>{t('loading', 'Loading...')}</div>;
    }

    return (
        <div>
            <div className="navHolder"></div>
            <div className={styles.blog_container}>

                <h1>{blog.title}</h1>
                <p>{blog.content}</p>
            </div>
        </div>
    );
};

export async function getStaticPaths() {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/api/blogs`);
        const blogs = res.data;

        const paths = blogs.map((blog) => ({
            params: { blogId: blog.id.toString() },
        }));

        console.log(paths);
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

export async function getStaticProps({ params, locale, locales }) {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/api/blogs?blogId=${params.blogId}`);
        const blog = res.data;
        console.log(blog);


        if (!blog) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                blog,
                locale,
                locales,
                ...(await serverSideTranslations(locale, ['common'])),
            },
            revalidate: 10,
        };
    } catch (error) {
        console.error(`Error fetching blog with ID ${params.blogId}:`, error);
        return {
            notFound: true,
        };
    }
}

export default BlogPage;

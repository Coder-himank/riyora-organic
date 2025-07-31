import React from 'react';
import styles from '@/styles/blogComponent.module.css';
import Link from 'next/link';
import Image from 'next/image';
const Blog = (blog, flexDirection, showContent = true) => {
    // console.log(blog.flexDirection);

    return (
        <div className={styles.blog} style={{
            flexDirection: blog.flexDirection,
        }}>
            <section className={styles.image_wrapper}>
                {/* image */}
                <Image src={blog.imgUrl} alt={blog.title} width={300} height={300} />
            </section>
            <section className={styles.text_content}>
                {/* content */}
                <h3>{blog.title}</h3>
                {/* {showContent && */}
                <p>{blog.content.length > 100 ? blog.content.slice(0, 400) + '...' : blog.content}</p>
                {/* } */}

                <Link href={blog.url}>Learn More</Link>
            </section>
        </div >
    );
};

export default Blog;
import React from "react";
import styles from "@/styles/blogComponent.module.css";
import Link from "next/link";
import Image from "next/image";

/**
 * Props:
 * - blog: a Blog object from Mongoose
 * - flexDirection: optional, default "row"
 * - showContent: optional, default true
 * - mode: optional, "light" or "dark"
 */
const Blog = ({ blog, flexDirection = "row", showContent = true, mode = "light" }) => {
  if (!blog) return null; // safety check

  return (
    <div
      className={`${styles.blog} ${mode === "dark" ? styles.dark : ""}`}
      style={{ flexDirection }}
    >
      <section className={styles.image_wrapper}>
        {blog.imageUrl && (
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            width={300}
            height={300}
          />
        )}
      </section>

      <section className={styles.text_content}>
        <h3>{blog.title}</h3>
        {showContent && blog.description && (
          <p>
            {blog.description.length > 400
              ? blog.description.slice(0, 400) + "... learn more"
              : blog.description}
          </p>
        )}
        <Link href={`/blogs/${blog.slug}`}>Learn More</Link>
      </section>
    </div>
  );
};

export default Blog;

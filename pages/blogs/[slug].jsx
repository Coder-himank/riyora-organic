import Blog from "@/server/models/Blogs";
import styles from "@/styles/blogPage.module.css";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/server/db"; // Your MongoDB connection helper

const BlogPage = ({ blog }) => {
    const siteUrl = "https://riyoraorganic.com";
    const brandName = "Riyora Organic";

    if (!blog) {
        return <center><h1>Blog Not Found</h1></center>;
    }

    const blogUrl = `${siteUrl}/blogs/${blog.slug}`;
    const blogImage = blog.imageUrl || `${siteUrl}/logo.png`;
    const blogDescription =
        blog.description?.slice(0, 150) + "..." ||
        "Discover natural hair care tips and benefits of Riyora Organic Hair Oil.";

    return (
        <>
            <Head>
                <title>{blog.title} | {brandName}</title>
                <meta name="description" content={blogDescription} />
                <meta name="keywords" content={`Riyora Organic, Hair Oil, ${blog.title}, Natural Hair Care, Herbal Hair Oil`} />
                <link rel="canonical" href={blogUrl} />

                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${blog.title} | ${brandName}`} />
                <meta property="og:description" content={blogDescription} />
                <meta property="og:url" content={blogUrl} />
                <meta property="og:image" content={blogImage} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${blog.title} | ${brandName}`} />
                <meta name="twitter:description" content={blogDescription} />
                <meta name="twitter:image" content={blogImage} />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            headline: blog.title,
                            description: blogDescription,
                            url: blogUrl,
                            datePublished: blog.createdAt,
                            author: { "@type": "Person", name: blog.author || brandName },
                            publisher: {
                                "@type": "Organization",
                                name: brandName,
                                logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` }
                            },
                            image: blogImage,
                            mainEntityOfPage: blogUrl
                        })
                    }}
                />
            </Head>

            <main className={styles.blog_container}>
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

                    {/* Render the HTML content from the model */}
                    <div
                        className={styles.blogContent}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

            </main>
        </>
    );
};

// Static paths using slugs
export async function getStaticPaths() {
    await connectDB();
    const blogs = await Blog.find({ published: true }).select("slug").lean();

    const paths = blogs.map(blog => ({
        params: { slug: blog.slug }
    }));

    return { paths, fallback: "blocking" };
}

// Fetch blog by slug
export async function getStaticProps({ params }) {
    await connectDB();
    console.log(params);
    const blog = await Blog.findOne({ slug: params.slug, published: true }).lean();

    if (!blog) {
        return { notFound: true };
    }

    return {
        props: { blog: JSON.parse(JSON.stringify(blog)) },
        revalidate: 60 // ISR: update page every 60 seconds
    };
}

export default BlogPage;

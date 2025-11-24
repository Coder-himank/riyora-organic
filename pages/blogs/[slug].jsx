import Blog from "@/server/models/Blogs";
import styles from "@/styles/blogPage.module.css";
import Head from "next/head";
import Image from "next/image";
import connectDB from "@/server/db"; // Your MongoDB connection helper
import buildBlogSchema from "@/utils/blogs/buildBlogSchema";

const BlogPage = ({ blog, blogSchema }) => {
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
                <meta name="keywords" content={`${blog.tags?.join(", ")}, Hair Care, Herbal, Riyora Organic`} />
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

                {/* BlogPosting Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(blogSchema)
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
    const siteUrl = "https://riyoraorganic.com";
    const brandName = "Riyora Organic";

    const blog = await Blog.findOne({ slug: params.slug, published: true }).lean();
    const blogSchema = buildBlogSchema(blog, siteUrl, brandName);

    if (!blog) {
        return { notFound: true };
    }

    return {
        props: { blog: JSON.parse(JSON.stringify(blog)), blogSchema: JSON.parse(JSON.stringify(blogSchema)) },
        revalidate: 60 // ISR: update page every 60 seconds
    };
}

export default BlogPage;

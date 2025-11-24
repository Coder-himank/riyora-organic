export default function buildBlogSchema(blog, siteUrl, brandName) {
  const blogUrl = `${siteUrl}/blogs/${blog.slug}`;
  const imageUrl = blog.imageUrl || `${siteUrl}/logo.png`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    alternativeHeadline: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.description || "",
    articleBody: blog.content
      ? blog.content.replace(/<[^>]*>?/gm, "").slice(0, 5000)
      : "",
    url: blogUrl,
    mainEntityOfPage: blogUrl,
    image: imageUrl,
    keywords: blog.tags?.join(", "),
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || brandName,
    },
    publisher: {
      "@type": "Organization",
      name: brandName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    isPartOf: {
      "@type": "Blog",
      name: `${brandName} Blog`,
      url: `${siteUrl}/blogs`,
    },
    wordCount: blog.content
      ? blog.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length
      : 0,

    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: `${siteUrl}/blogs`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: blog.title,
          item: blogUrl,
        },
      ],
    },

    speakable: {
      "@type": "SpeakableSpecification",
      xpath: [
        "/html/head/title",
        "/html/head/meta[@name='description']/@content",
      ],
    },
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  publicRuntimeConfig: {
    BASE_URL: "https://riyora-organic.vercel.app",
  },

  images: {
    domains: ["res.cloudinary.com"],
  },

  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
      {
        source: "/sitemap",
        destination: "/api/sitemap.xml",
      },
      {
        source: "/products",
        destination: "/",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' https://checkout.razorpay.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https://res.cloudinary.com;
              connect-src 'self';
              frame-src https://checkout.razorpay.com;
            `.replace(/\s{2,}/g, " "), // remove extra spaces
          },
        ],
      },
    ];
  },
};

export default nextConfig;

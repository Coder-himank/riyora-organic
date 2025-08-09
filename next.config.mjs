/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  publicRuntimeConfig: {
    BASE_URL: "https://riyora-organic.vercel.app",
  },

  images: {
    domains: ['res.cloudinary.com'],
  },

  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
    ];
  },
};

export default nextConfig;

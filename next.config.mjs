/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "hi"], // English,hindi
    defaultLocale: "en",
  },
  publicRuntimeConfig: {
    BASE_URL: "https://organic-robust.vercel.app",
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

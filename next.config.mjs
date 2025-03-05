/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "hi"],
    defaultLocale: "en",
    localeDetection: false, // Disable auto-detection
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

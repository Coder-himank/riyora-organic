/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "es", "fr"], // English, Spanish, French
    defaultLocale: "en",
  },
};

export default nextConfig;

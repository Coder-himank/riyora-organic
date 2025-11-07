import '@/styles/globals.css';
import '@/styles/navbar.css';
import '@/styles/footer.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/themeContext";
import AuthPage from "@/pages/authenticate";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import getProductUrl from "@/utils/productsUtils";

function AuthPopup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (router.pathname === "/authenticate") return;

    if (!session) {
      const firstTimer = setTimeout(() => {
        if (router.pathname === "/authenticate") return;
        setShowAuth(true);
      }, 10000);

      const interval = setInterval(() => {
        if (router.pathname === "/authenticate") return;
        setShowAuth(true);
      }, 120000);

      return () => {
        clearTimeout(firstTimer);
        clearInterval(interval);
      };
    }
  }, [session, router.pathname]);

  if (!showAuth || session) return null;
  if (router.pathname === "/authenticate") return null;

  return (
    <div className="authform" role="dialog" aria-modal="true" aria-label="Authentication popup">
      <button
        className="closebtn"
        onClick={() => setShowAuth(false)}
        aria-label="Close authentication popup"
      >
        X
      </button>
      <AuthPage />
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    let interval;
    if (loading) {
      setPercentage(0);
      interval = setInterval(() => {
        setPercentage((prev) => (prev >= 95 ? prev : prev + 5));
      }, 200);
    } else {
      setPercentage(100);
      setTimeout(() => setPercentage(0), 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (!hydrated) return <Loader status={true} percentage={"100%"} />;

  // --- 🧠 Dynamic SEO Metadata (Inline) ---
  const siteName = "Riyora"; // change to your brand
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://riyora.com";
  const currentUrl = `${siteUrl}${router.asPath}`;
  const defaultTitle = "Riyora | Premium Lifestyle & Fashion Products";
  const defaultDescription =
    "Shop premium lifestyle, beauty, and fashion products at Riyora. Discover quality, sustainability, and style for modern living.";
  const defaultImage = `${siteUrl}/images/og-image.jpg`;
  const defaultKeywords =
    "riyora, premium products, lifestyle, fashion, online shopping, beauty, skincare, accessories";

  const pageTitle = defaultTitle;
  const pageDescription = defaultDescription;
  const pageImage = defaultImage;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: pageDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <ThemeProvider>
      <Head>

        {/* --- ✅ Basic SEO Meta --- */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={defaultKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />

        {/* --- ✅ Open Graph (Social Preview) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={pageImage} />

        {/* --- ✅ Twitter Card --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <meta name="twitter:creator" content="@riyoraofficial" />

        {/* --- ✅ Icons and PWA --- */}
        <link rel="shortcut icon" href="/Riyora-Logo-Favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/riyora-apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />

        {/* --- ✅ Structured Data for Google --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* --- ✅ Preconnect / Performance hints --- */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </Head>

      <SessionProvider session={pageProps.session}>
        {loading && <Loader status={loading} percentage={percentage + "%"} />}
        {!loading && percentage > 0 && percentage < 100 && (
          <Loader status={true} percentage={percentage + "%"} />
        )}

        <Navbar />

        {/* --- 💬 WhatsApp Chat Button --- */}
        <Link
          className="chat_Button"
          href="https://wa.me/9680886889?text=I%20Want%20To%20Buy%20Your%20Products"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <Image
            src="/images/whatsapp.png"
            alt="Chat with Riyora on WhatsApp"
            width={50}
            height={50}
            loading="lazy"
          />
        </Link>

        {/* <AuthPopup /> */}

        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;

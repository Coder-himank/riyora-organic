import '@/styles/globals.css';
import '@/styles/navbar.css';
import '@/styles/footer.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/themeContext";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import Script from 'next/script';
import { PromoPrompt } from '@/components/PromoPrompt';
import axios from 'axios';
import { pageview, FB_PIXEL_ID } from '@/utils/pixel';

function ShowPromoPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await axios.get('/api/getPromo');
        if (response.data.length === 0) {
          setPromo(null);
          return;
        }
        setPromo(response.data[0]);
      } catch (error) {
        console.error('Error fetching promo data:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchPromo();
      setShowPrompt(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPrompt && promo && <PromoPrompt onClose={() => setShowPrompt(false)} code={promo.code} discount={promo.discount} />}
    </>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // mark hydration complete
  useEffect(() => setHydrated(true), []);

  // Loader percentage animation
  useEffect(() => {
    let interval;
    if (loading) {
      setPercentage(0);
      interval = setInterval(() => setPercentage(prev => (prev >= 95 ? prev : prev + 5)), 200);
    } else {
      setPercentage(100);
      setTimeout(() => setPercentage(0), 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Route change loading
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

  // SPA Pageview tracking (Facebook Pixel)
  useEffect(() => {
    const handleRouteChange = () => pageview();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  // SEO & defaults
  const siteName = "Riyora";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://riyora.com";
  const currentUrl = `${siteUrl}${router.asPath}`;
  const defaultTitle = "Riyora | Premium Lifestyle & Fashion Products";
  const defaultDescription = "Shop premium lifestyle, beauty, and fashion products at Riyora. Discover quality, sustainability, and style for modern living.";
  const defaultImage = `${siteUrl}/images/og-image.jpg`;
  const defaultKeywords = "riyora, premium products, lifestyle, fashion, online shopping, beauty, skincare, accessories";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <ThemeProvider>
      {/* --- Google Analytics --- */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-2SQ2FY87LM`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2SQ2FY87LM');
          `
        }}
      />

      {/* --- Facebook Pixel --- */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      <Head>
        {/* --- SEO --- */}
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta name="keywords" content={defaultKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph / Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={defaultImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultImage} />
        <meta name="twitter:creator" content="@riyoraofficial" />

        {/* Icons / PWA */}
        <link rel="shortcut icon" href="/Riyora-Logo-Favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/riyora-apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </Head>

      <SessionProvider session={pageProps.session}>
        {/* Single Loader component to avoid hooks mismatch */}
        <Loader status={!hydrated || loading || (percentage > 0 && percentage < 100)} percentage={percentage + "%"} />

        <Navbar />

        {/* WhatsApp Chat */}
        <Link
          className="chat_Button"
          href="https://wa.me/9680886889?text=I%20Want%20To%20Buy%20Your%20Products"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          chat with us
          <Image
            src="/images/whatsapp.png"
            alt="Chat with Riyora on WhatsApp"
            width={50}
            height={50}
            loading="lazy"
          />
        </Link>

        <Component {...pageProps} />
        <Footer />
      </SessionProvider>

      <ShowPromoPrompt />
    </ThemeProvider>
  );
}

export default MyApp;

import "@/styles/globals.css";
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
  const [popupCount, setPopupCount] = useState(0); // track how many times shown


  useEffect(() => {
    console.log(router.pathname);

    if (router.pathname === "/authenticate") {
      return;
    }
    if (!session) {
      // First popup after 10s
      const firstTimer = setTimeout(() => {
        if (router.pathname === "/authenticate") {
          return;
        }
        setShowAuth(true);
        setPopupCount(1);
      }, 10000); // 10,000 ms = 10 seconds

      // Then every 2 minutes after first popup
      const interval = setInterval(() => {
        if (router.pathname === "/authenticate") {
          return;
        }
        setShowAuth(true);
        setPopupCount((prev) => prev + 1);
      }, 120000); // 120,000 ms = 2 minutes

      return () => {
        clearTimeout(firstTimer);
        clearInterval(interval);
      };
    }
  }, [session]);

  if (!showAuth || session) return null;

  if (router.pathname === "/authenticate") return null

  return (
    <div className="authform">
      <button className="closebtn" onClick={() => setShowAuth(false)}>
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

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    let interval;

    if (loading) {
      // Reset to 0% when loading starts
      setPercentage(0);

      // Gradually increase percentage
      interval = setInterval(() => {
        setPercentage((prev) => {
          if (prev >= 95) return prev; // don’t exceed 95% until complete
          return prev + 5; // increment by 5%
        });
      }, 200); // every 200ms
    } else {
      // When loading stops, complete to 100%
      setPercentage(100);

      // Reset back to 0 after a short delay (for next time)
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

  return (
    <ThemeProvider>
      <Head>
        <link
          rel="shortcut icon"
          href="Riyora-Logo-Favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href="/images/riyora-apple-touch-icon.png"
        />
      </Head>

      <SessionProvider session={pageProps.session}>
        {loading && <Loader status={loading} percentage={percentage + "%"} />}
        {!loading && percentage > 0 && percentage < 100 && (
          <Loader status={true} percentage={percentage + "%"} />
        )}

        <Navbar />

        {/* WhatsApp Chat Button */}
        <Link
          className="chat_Button"
          href="https://wa.me/9680886889?text=I%20Want%20To%20Buy%20Your%20Products"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/whatsapp.png"
            alt="wp image"
            width={50}
            height={50}
          />
        </Link>

        {/* Auth Popup */}
        <AuthPopup />

        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;

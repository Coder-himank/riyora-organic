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

function AuthPopup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [popupCount, setPopupCount] = useState(0); // track how many times shown

  useEffect(() => {
    if (router.pathname === "/authenticate") {
      return;
    }
    if (!session) {
      // First popup after 10s
      const firstTimer = setTimeout(() => {
        setShowAuth(true);
        setPopupCount(1);
      }, 10000); // 10,000 ms = 10 seconds

      // Then every 2 minutes after first popup
      const interval = setInterval(() => {
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

  return (
    <ThemeProvider>
      <Head>
        <html lang={router.locale} />
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
        <Navbar />

        {/* WhatsApp Chat Button */}
        <Link
          className="chat_Button"
          href="https://wa.me/919521666123?text=I%20Want%20To%20Buy%20Your%20Products"
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

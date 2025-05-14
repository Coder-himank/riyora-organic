
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@/components/themeContext";
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
      <ThemeProvider>

        <Head>
          <html lang={router.locale} />
        </Head>
        <SessionProvider>
          <Navbar />

          <Component {...pageProps} />
          <Footer />
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp;
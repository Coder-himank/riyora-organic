import { appWithTranslation } from "next-i18next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import i18nConfig from "../next-i18next.config";
import Head from "next/head";
import { useRouter } from "next/router";
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
      <Head>
        <html lang={router.locale} />
      </Head>
      <SessionProvider>
        <Navbar />

        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  )
}


export default appWithTranslation(MyApp, i18nConfig);
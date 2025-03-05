import { appWithTranslation } from "next-i18next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import i18nConfig from "../next-i18next.config";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <SessionProvider>
        <Navbar />

        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  )
}


export default appWithTranslation(MyApp, i18nConfig);
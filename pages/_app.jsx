import { appWithTranslation } from "next-i18next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
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

export default appWithTranslation(MyApp);

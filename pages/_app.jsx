
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/themeContext";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <ThemeProvider>

        <Head>
          <html lang={router.locale} />
          <link rel="shortcut icon" href="Riyora-Logo-Favicon.ico" type="image/x-icon" />
        </Head>
        <SessionProvider>
          <Navbar />

          <Link className="chat_Button" href={"https://wa.me/919521666123?text=I%20Want%20To%20Buy%20Your%20Products"} target="_blank" rel="noopener noreferrer">

            <Image src={"/images/whatsapp.png"} alt="wp image" width={50} height={50} />

            {/* <span>Chat With Us</span> */}
          </Link>

          <Component {...pageProps} />
          <Footer />
        </SessionProvider>
      </ThemeProvider >
    </>
  )
}

export default MyApp;
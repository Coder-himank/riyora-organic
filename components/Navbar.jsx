import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  const [toogleNavBar, setToogleNavBar] = useState(false)

  const [changeNavStyle, setChangeNavStyle] = useState(false)

  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);
  const navStyle = {
    height: "70px",
    backgroundColor: "white",
    paddingTop: "20px",
    boxShadow: "0 2px 20px -5px rgba(0,0,0,0.2)"
  }



  useEffect(() => {
    setToogleNavBar(false)
    const handleScroll = () => {
      setScrollY(window.scrollY); // Update scroll position
      setChangeNavStyle(true)
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [router, scrollY])

  useEffect(() => { setChangeNavStyle(scrollY < 20 ? false : true) }, [scrollY])

  const changeLanguage = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <>
      <Head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <nav className="navbar" style={changeNavStyle ? navStyle : { background: toogleNavBar ? "white" : "transparent", transition: toogleNavBar ? "all 0s" : '' }}>
        <div className="nav-left">
          <Link href="/"><span className="name-head">{t("welcome")}</span></Link>
          <button className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}><FaBars /></button>
        </div>

        <div className="nav-right">

          <div className={`nav-links ${toogleNavBar ? 'navBarOpen' : ''}`}>
            <Link href="/products">{t("our_products")}</Link>
            <Link href="/cart">{t("cart")}</Link>
            <Link href="/wishlist">{t("wishlist")}</Link>

            {!session ? <><Link href="/authenticate">{t("signin")}</Link>
            </> : <Link href="/profile">{t("profile")}</Link>}

            <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={locale}>
              <option value={"en"}>EN</option>
              <option value={"es"}>ES</option>
              <option value={"fr"}>FR</option>

            </select>
          </div>

        </div>
      </nav >
    </>
  );
}

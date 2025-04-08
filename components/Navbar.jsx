import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaArrowLeft, FaArrowRight, FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";

import ThemeSwitcher from "./themeSwitcher";

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  const [toogleNavBar, setToogleNavBar] = useState(false)

  const [changeNavStyle, setChangeNavStyle] = useState(false)

  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);

  const [asideBars, setAsideBars] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(0);

  const [showProfileAside, setShowProfileAside] = useState(false)

  const profileAside = useRef()

  const navStyle = {
    height: "70px",
    backgroundColor: "white",
    paddingTop: "20px",
    boxShadow: "0 2px 20px -5px rgba(0,0,0,0.2)",
    color: "var(--navbar-text-color)"
  }



  useEffect(() => {
    setToogleNavBar(false)
    const handleScroll = () => {
      setScrollY(window.scrollY); // Update scroll position
      setChangeNavStyle(true)
    };


    // when the router changes check if the page is profile page then only the profile aside will be shown to user

    if (router.pathname == "/profile") {
      // profileAside.current.display = "flex"
      setShowProfileAside(true)
    } else {
      // profileAside.current.style.display = "none"
      setShowProfileAside(false)

    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [router, scrollY])

  useEffect(() => {
    const checkOverflow = () => {
      setResizeWidth(window.innerWidth);
      if (window.innerWidth >= 900) {
        setAsideBars(false);
      }
    };

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);


  useEffect(() => { setChangeNavStyle(scrollY < 20 ? false : true) }, [scrollY])
  useEffect(() => { setChangeNavStyle(window.scrollY < 20 ? false : true) }, [])

  const changeLanguage = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <>
      <Head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* aside nav bar for user profile only */}
      {showProfileAside &&
        <aside className="profile_aside" style={asideBars ? { left: "0%", top: "0", height: "100vh", width: "300px" } : {}} ref={profileAside}>
          <button className="profile_aside_bars" onClick={() => setAsideBars((prev) => !prev)} >
            <FaArrowLeft />
          </button>
          <Link href="/profile">{t("profilePage.dashboard")}</Link>
          <Link href="/refund">{t("profilePage.refund")}</Link>
          <Link href="/track-order">{t("profilePage.track_orders")}</Link>
          <Link href="/payment-history">{t("profilePage.payment_history")}</Link>
          <Link href="/customer-care">{t("profilePage.customer_care")}</Link>
          <Link href="/help">{t("profilePage.help")}</Link>
        </aside>
      }
      {/* profile aside ends */}

      {/* Nav bar starts */}

      <nav className={`navbar ${toogleNavBar && "navOpen"}`} style={changeNavStyle ? navStyle : { background: toogleNavBar ? "white" : "transparent", transition: toogleNavBar ? "all 0s" : 'all 0.05s' }} >

        {/* Nav right Code */}

        <div className="nav-left">
          {showProfileAside && <button className="profile_aside_bars" onClick={() => setAsideBars((prev) => !prev)}>
            <FaArrowRight />
          </button>}
          <Link href="/"><span className="name-head">{t("welcome")}</span></Link>
          <button className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}><FaBars /></button>
        </div>
        {/* Nav right Ends */}
        {/* Nav Left Starts */}
        <div className="nav-right">

          <div className={`nav-links ${toogleNavBar ? 'navBarOpen' : ''}`}>
            {/* <Link href="/products">{t("our_products")}</Link> */}
            <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={locale} className="lang_switcher">
              <option value={"en"}>EN</option>
              <option value={"hi"}>HI</option>

            </select>
            <Link href="/cart"><FaShoppingCart /></Link>
            <Link href="/wishlist"><FaHeart /></Link>

            {!session ? <><Link href="/authenticate">{t("signin")}</Link>
            </> : <Link href="/profile"><FaUser /></Link>}

            {/* <ThemeSwitcher /> */}
          </div>

        </div>
        {/* Nav Left ends */}
      </nav >

      {/* navbar ensds */}
    </>
  );
}

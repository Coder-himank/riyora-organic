import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaBlog, FaHome, FaProductHunt, FaServicestack } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaHeart, FaUser, FaShoppingCart, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import ThemeSwitcher from "./themeSwitcher";

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  const [toogleNavBar, setToogleNavBar] = useState(false) // to check if the nav baar is toogled

  const [changeNavStyle, setChangeNavStyle] = useState(false) // to detetc change in scrolling of y axis

  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);

  const [resizeWidth, setResizeWidth] = useState(0);

  const navStyle = {
    height: "fit-content",
    backgroundColor: "white",
    boxShadow: "0 2px 20px -5px rgba(0,0,0,0.2)",
    color: "var(--navbar-text-color)"
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

  useEffect(() => {
    const checkOverflow = () => {
      setResizeWidth(window.innerWidth);
      if (window.innerWidth >= 900) {
        setToogleNavBar(false)

      } else {
      }
    };

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);


  useEffect(() => { setChangeNavStyle(scrollY < 20 ? false : true) }, [scrollY, resizeWidth])
  useEffect(() => {
    setChangeNavStyle(window.scrollY < 20 ? false : true)
    if (resizeWidth >= 900) {
      setToogleNavBar(false)
    }
  }, [resizeWidth])

  const changeLanguage = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <>
      <Head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* Nav bar starts */}

      <nav className={`navbar ${toogleNavBar && "navOpen"} ${changeNavStyle && "navFixed"}`} style={changeNavStyle ? navStyle : { background: toogleNavBar ? "white" : "transparent", transition: toogleNavBar ? "all 0s" : 'all 0.05s' }} >

        {/* Nav left Code */}

        <div className="nav-left">
          <Link href="/"><span className="name-head"><Image src="/images/logo.png" alt="Logo" width={200} height={100} /></span></Link>

        </div>
        {/* Nav left Ends */}
        <div className={`nav-mid ${toogleNavBar ? 'navBarOpen' : ''}`}>
          <div className={`nav-links`}>


            <Link href="/"><span className="icon_label"><FaHome /> </span> {t("home_text")}  </Link>
            <Link href="/products"><span className="icon_label"><FaProductHunt /></span> {t("product_text")} </Link>
            <Link href="/blogs"><span className="icon_label"><FaBlog /> </span>{t("blogs")} </Link>
            <Link href="/services"><span className="icon_label"><FaServicestack /></span> {t("services")} </Link>
            <span className="language">

              <FaGlobe /> <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={locale} className="lang_switcher">
                <option value={"en"}>EN</option>
                <option value={"hi"}>HI</option>

              </select>
            </span>
          </div>

        </div>
        {/* Nav right Starts */}
        <div className="nav-right">

          <div className={`nav-user-option`}>
            {/* <Link href="/products">{t("our_products")}</Link> */}

            <Link href="/cart"><FaShoppingCart />  </Link>
            <Link href="/wishlist"><FaHeart /></Link>

            {!session ? <><Link href="/authenticate">{t("signin")}</Link>
            </> : <Link href="/profile"><FaUser /></Link>}

            <button className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}><FaBars /></button>

            {/* <ThemeSwitcher /> */}
          </div>

        </div>
        {/* Nav right ends */}
      </nav >

      {/* navbar ensds */}
    </>
  );
}

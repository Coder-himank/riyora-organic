import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaBars, FaBlog, FaHome, FaProductHunt, FaServicestack } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [toogleNavBar, setToogleNavBar] = useState(false) // to check if the nav baar is toogled

  const [changeNavStyle, setChangeNavStyle] = useState(false) // to detetc change in scrolling of y axis

  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);
  const userId = session?.user?.id;

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
      <div className="offerBanner">
        <span>10% off on Every Products</span>
      </div>
      <header>

        {/* Nav bar starts */}

        <nav className={`navbar ${toogleNavBar && "navOpen"} ${changeNavStyle && "navFixed"}`} style={changeNavStyle ? navStyle : { background: toogleNavBar ? "white" : "transparent", transition: toogleNavBar ? "all 0s" : 'all 0.05s' }} >

          {/* Nav left Code */}

          <div className="nav-left">

            <span className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}>
              <FaBars />
            </span>
            <Link href="/"><span className="name-head"><Image src="/images/logo.png" alt="Logo" width={200} height={100} /></span></Link>

          </div>
          {/* Nav left Ends */}
          <div className={`nav-mid ${toogleNavBar ? 'navBarOpen' : ''}`}>
            <div className="nav-links">

              <Link href="/"><span className="icon_label"><FaHome /></span> Home</Link>
              <Link href="/products"><span className="icon_label"><FaProductHunt /></span> Products</Link>
              <Link href="/services"><span className="icon_label"><FaServicestack /></span> About Us</Link>
              <Link href="/blogs"><span className="icon_label"><FaBlog /></span> Blogs</Link>
              <Link href="/services"><span className="icon_label"><FaServicestack /></span> Career</Link>
              <Link href="/services"><span className="icon_label"><FaServicestack /></span> Contact Us</Link>

            </div>
          </div>

          {/* Nav right Starts */}
          <div className="nav-right">
            <div className="nav-user-option">
              <Link href={`/${userId}/cart`}><FaShoppingCart /></Link>
              <Link href={`/${userId}/wishlist`}><FaHeart /></Link>

              {!session ? (
                <Link href="/authenticate">Sign In</Link>
              ) : (
                <Link href={`/${userId}/dashboard`}><FaUser /></Link>
              )}


              {/* <ThemeSwitcher /> */}
            </div>
          </div>

          {/* Nav right ends */}
        </nav >

        {/* navbar ensds */}


      </header>
      <div className="subheader">
        <ul className="subheader-links">
          <li><Link href={"/services"}>Services</Link></li>
          <li><Link href={"/services"}>About Us</Link></li>
          <li><Link href={"/services"}>Career</Link></li>
          <li><Link href={"/services"}>Career</Link></li>
        </ul>
      </div>
    </>
  );
}

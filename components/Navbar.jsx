import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaHome, FaProductHunt, FaServicestack, FaBlog, FaBriefcase, FaEnvelope, FaBars } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { FaRegUser, FaX, FaRegHeart } from "react-icons/fa6";

import { AiOutlineShoppingCart } from "react-icons/ai";

export default function Navbar() {
  const router = useRouter();
  const [toogleNavBar, setToogleNavBar] = useState(false) // to check if the nav baar is toogled

  const [changeNavStyle, setChangeNavStyle] = useState(false) // to detetc change in scrolling of y axis

  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);
  const [mobile, setMobile] = useState(false);
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
        setMobile(false)

      } else {
        setMobile(true)
      }
    };

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);


  useEffect(() => { setChangeNavStyle(scrollY < 20 ? false : true) }, [scrollY, resizeWidth])


  useEffect(() => {
    setChangeNavStyle(window.scrollY < 20 ? false : true)
    if (window.innerWidth >= 900) {
      setToogleNavBar(false)
      setMobile(false)
    } else {
      setMobile(true)

    }
  }, [resizeWidth])

  const changeLanguage = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };


  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <FaProductHunt />,
    },
    {
      name: "About Us",
      path: "/services", // Or use "/about" if that's more accurate
      icon: <FaServicestack />,
    },
    {
      name: "Blogs",
      path: "/blogs",
      icon: <FaBlog />,
    },
    {
      name: "Career",
      path: "/career",
      icon: <FaBriefcase />,
    },
    {
      name: "Contact Us",
      path: "/contact",
      icon: <FaEnvelope />,
    },
  ];

  const pathname = router.pathname;


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

        <nav className={`navbar ${changeNavStyle && "navFixed"}`} style={changeNavStyle ? navStyle : { background: toogleNavBar ? "white" : "transparent", transition: toogleNavBar ? "all 0s" : 'all 0.05s' }} >

          {/* Nav left Code */}

          <div className="nav-left">

            <span className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}>
              <FaBars />
            </span>
            <Link href="/"><span className="name-head"><Image src="/images/logo.png" alt="Logo" width={200} height={100} /></span></Link>

          </div>
          {/* Nav left Ends */}
          <div className={`nav-mid`} style={toogleNavBar ? { display: "flex", transform: "translateX(0px)" } : { transform: mobile ? "translateX(-100%)" : "translateX(0px)" }}>
            <div className="logo">
              <span className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}>
                <FaX />
              </span>
              <Image src="/images/logo.png" alt="Logo" width={200} height={100} />
            </div>
            <div className="nav-links">
              {navLinks.map((link, index) => (
                <Link key={index} href={link.path} className={`${pathname === link.path && "activeLink"}`}><span className={`icon_label`}>{link.icon}</span> {link.name}</Link>
              ))}


            </div>
          </div>

          {/* Nav right Starts */}
          <div className="nav-right">
            <div className="nav-user-option">
              <Link href={`/${userId}/cart`}>{pathname === `/[userId]/cart` ? <FaShoppingCart /> : <AiOutlineShoppingCart />}</Link>
              <Link href={`/${userId}/wishlist`}>{pathname == `/[userId]/wishlist` ? <FaHeart /> : <FaRegHeart />}</Link>

              <Link href={!session ? "/authenticate" : `/${userId}/dashboard`}>{pathname === `/[userId]/dashboard` ? <FaUser /> : <FaRegUser />}</Link>


              {/* <ThemeSwitcher /> */}
            </div>
          </div>

          {/* Nav right ends */}
        </nav >

        {/* navbar ensds */}


      </header >
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

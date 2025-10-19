import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaProductHunt,
  FaServicestack,
  FaBlog,
  FaBriefcase,
  FaEnvelope,
  FaBars,
  FaArrowDown,
  FaAngleDown,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { FaRegUser, FaX, FaRegHeart } from "react-icons/fa6";
import getProductUrl from "@/utils/productsUtils";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Navbar() {
  const router = useRouter();
  const [toogleNavBar, setToogleNavBar] = useState(false); // to check if the nav baar is toogled

  const [changeNavStyle, setChangeNavStyle] = useState(false); // to detetc change in scrolling of y axis

  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);
  const [mobile, setMobile] = useState(false);
  const userId = session?.user?.id;
  const [productUrl, setProductUrl] = useState("/products");

  const [resizeWidth, setResizeWidth] = useState(0);

  const navStyle = {
    height: "fit-content",
    backgroundColor: "white",
    boxShadow: "0 2px 20px -5px rgba(0,0,0,0.2)",
    color: "var(--navbar-text-color)",
  };

  useEffect(() => {
    const fetchProductUrl = async () => {
      const url = await getProductUrl();
      setProductUrl(url);
    };

    fetchProductUrl();
  }, []);

  useEffect(() => {
    setToogleNavBar(false);
    const handleScroll = () => {
      setScrollY(window.scrollY); // Update scroll position
      setChangeNavStyle(true);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [router, scrollY]);

  useEffect(() => {
    const checkOverflow = () => {
      setResizeWidth(window.innerWidth);
      if (window.innerWidth >= 900) {
        setToogleNavBar(false);
        setMobile(false);
      } else {
        setMobile(true);
      }
    };

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  useEffect(() => {
    setChangeNavStyle(scrollY < 20 ? false : true);
  }, [scrollY, resizeWidth]);

  useEffect(() => {
    setChangeNavStyle(window.scrollY < 20 ? false : true);
    if (window.innerWidth >= 900) {
      setToogleNavBar(false);
      setMobile(false);
    } else {
      setMobile(true);
    }
  }, [resizeWidth]);

  const changeLanguage = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    // {
    //   name: "Products",
    //   path: "/products",
    //   icon: <FaProductHunt />,
    // },
    {
      name: "Shop Now",
      path: productUrl,
      icon: <FaProductHunt />,
    },
    {
      name: "About Us",
      path: "/about", // Or use "/about" if that's more accurate
      icon: <FaServicestack />,

      subMenu: [{

        name: "Our Vision",
        path: "/visionAndMission", // Or use "/about" if that's more accurate
        icon: <FaServicestack />,

      }]
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


  const RenderSubMenu = ({ items }) => {
    return (
      <div className="subMenu">

        {items.map((link, index) => {
          const isActive = router.asPath === link.path || router.asPath.startsWith(`${link.path}/`)
          return <Link
            key={index}
            href={link.path}
            className={`nav-link ${isActive ? "activeLink" : ""}`}
          >
            <span className="icon_label">{link.icon}</span> {link.name} {link.subMenu && <i>^</i>}

            {link?.subMenu && <RenderSubMenu items={link.subMenu} />}

          </Link>
        })
        }
      </div >
    )
  }
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

        <nav
          className={`navbar ${changeNavStyle && "navFixed"}`}
          style={
            changeNavStyle
              ? navStyle
              : {
                background: toogleNavBar ? "white" : "transparent",
                transition: toogleNavBar ? "all 0s" : "all 0.05s",
              }
          }
        >
          {/* Nav left Code */}

          <div className="nav-left">
            <span
              className="toogleNavBar"
              onClick={() => setToogleNavBar((prev) => !prev)}
            >
              <FaBars />
            </span>
            <Link href="/">
              <span className="name-head">
                <Image
                  src="/images/logo.png"
                  alt="Riyora organic official logo"
                  width={200}
                  height={100}
                />
              </span>
            </Link>
          </div>
          {/* Nav left Ends */}
          <div
            className={`nav-mid`}
            style={
              toogleNavBar
                ? { display: "flex", transform: "translateX(0px)" }
                : {
                  transform: mobile ? "translateX(-100%)" : "translateX(0px)",
                }
            }
          >
            <div className="logo">
              <span
                className="toogleNavBar"
                onClick={() => setToogleNavBar((prev) => !prev)}
              >
                <FaX />
              </span>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={100}
              />
            </div>
            <div className="nav-links">
              {navLinks.map((link, index) => {
                const isActive = router.asPath === link.path || router.asPath.startsWith(`${link.path}/`);
                return (
                  <Link
                    key={index}
                    href={link.path}
                    className={`nav-link ${isActive ? "activeLink" : ""}`}
                  >
                    <div>

                      <span className="icon_label">{link.icon}</span> {link.name} {link?.subMenu && <i><FaAngleDown /></i>}
                    </div>

                    {link?.subMenu && <RenderSubMenu items={link.subMenu} />}
                  </Link>
                );
              })}

            </div>
          </div>

          {/* Nav right Starts */}
          <div className="nav-right">
            <div className="nav-user-option">
              <Link href={`/${userId}/cart`}>
                {pathname === `/[userId]/cart` ? (
                  <FaShoppingCart />
                ) : (
                  <AiOutlineShoppingCart />
                )}
                <span className="hide">Cart</span>
              </Link>

              <Link href={!session ? "/authenticate" : `/${userId}/dashboard`}>
                {pathname === `/[userId]/dashboard` ? (
                  <FaUser />
                ) : (
                  <FaRegUser />
                )}

                <span className="hide">User Dashboard</span>
              </Link>

              {/* <ThemeSwitcher /> */}
            </div>
          </div>

          {/* Nav right ends */}
        </nav>

        {/* navbar ensds */}
      </header >
      <div className="subheader">
        <ul className="subheader-links">
          <li>
            <Link href={"/services"}>Services</Link>
          </li>
          <li>
            <Link href={"/services"}>About Us</Link>
          </li>
          <li>
            <Link href={"/services"}>Career</Link>
          </li>
          <li>
            <Link href={"/services"}>Career</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
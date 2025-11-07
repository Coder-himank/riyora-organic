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
  FaAngleDown,
  FaAngleLeft
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { FaRegUser, FaX } from "react-icons/fa6";
import getProductUrl from "@/utils/productsUtils";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function Navbar() {
  const router = useRouter();
  const [toogleNavBar, setToogleNavBar] = useState(false);
  const [changeNavStyle, setChangeNavStyle] = useState(false);
  const { data: session } = useSession();
  const [mobile, setMobile] = useState(false);
  const [productUrl, setProductUrl] = useState("/products");
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [subheaderLinks, setSubheaderLinks] = useState([]);

  const navStyle = {
    height: "fit-content",
    backgroundColor: "white",
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
    const handleScroll = () => {
      setChangeNavStyle(window.scrollY >= 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 900);
      if (window.innerWidth >= 900) setToogleNavBar(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Shop Now", path: productUrl, icon: <FaProductHunt /> },
    { name: "Blogs", path: "/blogs", icon: <FaBlog /> },
    { name: "Career", path: "/career", icon: <FaBriefcase /> },
    { name: "Contact Us", path: "/contact", icon: <FaEnvelope /> },
    {
      name: "More",
      path: "/about",
      icon: <FaServicestack />,
      subMenu: [
        { name: "About Us", path: "/about", icon: <FaServicestack /> },
        { name: "Our Vision", path: "/visionAndMission", icon: <FaServicestack /> },
      ],
    },
  ];

  const pathname = router.pathname;

  const handleSubmenuToggle = (index) => {
    if (!mobile) return; // Only toggle on mobile
    const newIndex = openSubMenu === index ? null : index;
    setOpenSubMenu(newIndex);
    setSubheaderLinks(newIndex !== null ? navLinks[index].subMenu : []);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Offer Banner */}
      <div className="offerBanner">
        <span>Launch offer 8% off</span>
      </div>

      <header onMouseLeave={() => {
        if (!mobile) {
          setOpenSubMenu(null);
          setSubheaderLinks([]);
        }
      }}>
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
          {/* Nav left */}
          <div className="nav-left">
            <span className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}>
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

          {/* Nav mid */}
          <div
            className="nav-mid"
            style={
              toogleNavBar
                ? { display: "flex", transform: "translateX(0px)" }
                : { transform: mobile ? "translateX(-100%)" : "translateX(0px)" }
            }
          >
            <div className="mobile-header">
              <span className="toogleNavBar" onClick={() => setToogleNavBar((prev) => !prev)}>
                <FaX />
              </span>
              <Image src="/images/logo.png" alt="Logo" width={200} height={100} />
            </div>

            <div className="nav-links">
              {navLinks.map((link, index) => {
                const isActive =
                  router.asPath === link.path || router.asPath.startsWith(`${link.path}/`);
                const isOpen = openSubMenu === index;

                return link.subMenu ? (
                  <span
                    key={index}
                    className={`link has-submenu ${isOpen ? "menuOpen" : ""}`}
                    onClick={() => handleSubmenuToggle(index)}
                    onMouseEnter={() => {
                      if (!mobile) {
                        setOpenSubMenu(index);
                        setSubheaderLinks(link.subMenu);
                      }
                    }}

                  >
                    <div className="submenu-toggle">
                      <span className="icon_label">{link.icon}</span> {link.name}{" "}
                      <i>
                        <FaAngleDown />
                      </i>
                    </div>
                  </span>
                ) : (
                  <Link
                    key={index}
                    href={link.path}
                    className={`link ${isActive ? "activeLink" : ""}`}
                  >
                    <div className="link-text">
                      <span className="icon_label">{link.icon}</span> {link.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Nav right */}
          <div className="nav-right">
            <div className="nav-user-option">
              <Link href={`/cart`}>
                {pathname === `/cart` ? <FaShoppingCart /> : <AiOutlineShoppingCart />}
                <span className="hide">Cart</span>
              </Link>

              <Link href={!session ? "/authenticate" : `/dashboard`}>
                {pathname === `/[userId]/dashboard` ? <FaUser /> : <FaRegUser />}
                <span className="hide">User Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Subheader for submenu links */}
        <div className={`subheader ${subheaderLinks.length  ? "show" : ""}`}>
          {mobile && <span
            className="submenu-close"
            onClick={() => setSubheaderLinks([])}
          >
            <FaAngleLeft /> back
          </span>}
          {subheaderLinks.map((link, idx) => (
            <Link key={idx} href={link.path}>
              <div className="link-text">
                <span className="icon_label">{link.icon}</span> {link.name}
              </div>
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}

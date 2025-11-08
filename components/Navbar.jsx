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
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { FaUser, FaShoppingCart, FaRegUser } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Image from "next/image";
import getProductUrl from "@/utils/productsUtils";
import { FaX } from "react-icons/fa6";
// Single Link Component for Normal & Submenu Links
const NavLink = ({ link, index, isOpen, handleClick, mobile, isActive }) => {
  return link.subMenu ? (
    <span
      className={`link has-submenu ${isOpen ? "menuOpen" : ""}`}
      onClick={() => handleClick(index)}
      onMouseEnter={() => !mobile && handleClick(index)}
    >
      <div className="submenu-toggle">
        <span className="icon_label">{link.icon}</span> {link.name}{" "}
        <i>{mobile ? <FaAngleRight /> : <FaAngleDown />}</i>
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
};
// Submenu Component (Render inside Subheader)
const SubmenuComponent = ({ links, onBack }) => {
  const router = useRouter();

  return (
    <div className="subheader show">
      <div className="headBtn">
        {onBack && (
          <span className="submenu-close" onClick={onBack}>
            <FaAngleLeft /> back
          </span>
        )}
        <Image src="/images/logo.png" width={100} height={60} alt="Logo" />
      </div>

      <div className="subheaderLinks">


        {links.map((link, idx) => {
          const isActive =
            router.asPath === link.path || router.asPath.startsWith(`${link.path}/`);
          return (
            <Link key={idx} href={link.path} className="link">
              <div className={`link-text ${isActive ? "activeLink" : ""}`}>
                <span className="icon_label">{link.icon}</span> {link.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [toogleNavBar, setToogleNavBar] = useState(false);
  const [changeNavStyle, setChangeNavStyle] = useState(false);
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
    const handleScroll = () => setChangeNavStyle(window.scrollY >= 20);
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

  useEffect(() => {
    setToogleNavBar(false);
  }, [router.pathname]);

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
    if (!mobile) {
      setOpenSubMenu(index);
      setSubheaderLinks(navLinks[index].subMenu || []);
      return;
    }
    const newIndex = openSubMenu === index ? null : index;
    setOpenSubMenu(newIndex);
    setSubheaderLinks(newIndex !== null ? navLinks[index].subMenu : []);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="offerBanner">
        <span>Launch offer 8% off</span>
      </div>

      <header
        style={changeNavStyle ? { boxShadow: "1px 2px 10px -9px black" } : { background: "white" }}
        onMouseLeave={() => {
          if (!mobile) {
            setOpenSubMenu(null);
            setSubheaderLinks([]);
          }
        }}
      >
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
          <div className="nav-left">
            <span className="toogleNavBar" onClick={() => setToogleNavBar(prev => !prev)}>
              <FaBars />
            </span>
            <Link href="/">
              <span className="name-head">
                <Image src="/images/logo.png" alt="Logo" width={200} height={100} />
              </span>
            </Link>
          </div>

          <div
            className="nav-mid"
            style={
              toogleNavBar
                ? { display: "flex", transform: "translateX(0px)" }
                : { transform: mobile ? "translateX(-100%)" : "translateX(0px)" }
            }
          >
            <div className="mobile-header">
              <span className="toogleNavBar" onClick={() => setToogleNavBar(prev => !prev)}>
                <FaX />
              </span>
              <Image src="/images/logo.png" alt="Logo" width={200} height={100} />
            </div>

            <div className="nav-links">
              {navLinks.map((link, index) => {
                const isActive = router.asPath === link.path || router.asPath.startsWith(`${link.path}/`);
                return (
                  <NavLink
                    key={index}
                    link={link}
                    index={index}
                    isOpen={openSubMenu === index}
                    handleClick={handleSubmenuToggle}
                    mobile={mobile}
                    isActive={isActive}
                  />
                );
              })}
            </div>
          </div>

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

        {/* Subheader */}
        {subheaderLinks.length > 0 && (
          <SubmenuComponent
            links={subheaderLinks}
            onBack={() => setSubheaderLinks([])}
          />
        )}
      </header>
    </>
  );
}

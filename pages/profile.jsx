import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "@/styles/userProfile.module.css";
import axios from "axios";
import { signOut } from "next-auth/react";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

export default function UserProfile() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [toogleBars, setToogleBars] = useState(false)
  const sectionsRef = useRef([]);

  const aside_styles = {
    left: "0%",
    padding: "80px 10px 0 0"
  }

  // Fetch user profile
  useEffect(() => {
    if (!session?.user) return;

    const fetchUserProfile = async () => {
      console.log(session.user.id);

      try {
        const res = await axios.get(`/api/userProfile?userId=${session.user.id}`);
        if (res.status !== 200) {
          throw new Error("Failed to fetch user data", res.message);
        }
        const data = await res.data;
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [session]);



  if (error) return (
    <>
      <div className={styles.profile_container_loading}>
        <div className="navHolder"></div>
        <p className="error">{t("error_loading")}: {error}</p>
      </div>
    </>)

  if (!user) return (
    <>
      <div className={styles.profile_container_loading}>

        <div className="navHolder"></div>
        <div className="loading-spinner"></div>; // Better UX for loading
      </div>

    </>
  )

  return (
    <>
      <div className="navHolder"></div>
      <div className={styles.profile_container}>
        {
          session?.user
            ? <>
              <aside className={styles.aside} style={toogleBars ? aside_styles : {}}>
                <Link href={"/profile"}>Dashboard</Link>
                <Link href={"/refund"}>Refund</Link>
                <Link href={"/track-order"}>Track Order</Link>
                <Link href={"/payment-history"}>Payemnt History</Link>
                <Link href={"/customer-care"}>Customer Care</Link>
                <Link href={"/help"}>Help</Link>
              </aside>


              <div className={styles.profile_card}>
                <div className={styles.top_name}>
                  <div className={styles.top_name_left}>
                    <button className={styles.bars} onClick={() => setToogleBars((prev) => !prev)}><FaBars /></button>
                    <span className={styles.username}>{user?.name}</span>

                  </div>
                  <div>
                    <span className={styles.loyaltyPoint}>{user?.loyaltyPoints}</span></div>
                </div>
                <table className={styles.user_detail}>
                  <tr>
                    <td>{t("userId")}</td>
                    <td>{user?._id}</td>
                  </tr>
                  <tr>
                    <td>{t("email")}</td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>

                    <td>{t("phone")}</td>
                    <td>{user?.phone}</td>
                  </tr>

                </table>
                <section>
                  <h3>Addresses</h3>

                  {user?.addresses.map((item, index) => (
                    <table className={styles.address_plate}>
                      <tr>
                        <td>{item.address}</td>
                        <td>{item.city}</td>
                        <td>{item.country}</td>
                        <td>{item.lable || "-"}</td>
                        <td>{item.pincode}</td>
                      </tr>
                    </table>
                  ))}
                </section>
                <section className={styles.orders}>
                  <h3>Orders</h3>
                  <Link href={"/track-orders"}>Track Orders</Link>
                  <Link href={"/orders?show=canceled"}>Canceld Orders</Link>
                  <Link href={"/orders"}>All Orders</Link>
                </section>
                <section>
                  <h3>Cart</h3>
                  <div>

                    {user.cartData.map((item) => (
                      <>
                        <div className={styles.productCard}>
                          {item.productId} ---- {item.quantity_demanded}
                        </div>
                      </>
                    ))}
                  </div>
                </section>
                <section>
                  <h3>Wishlist</h3>
                  <div>

                    {user.wishlistData.length !== 0 ? user.wishlistData.map((item) => (
                      <>
                        <div className={styles.productCard}>
                          {item.productId}
                        </div>
                      </>
                    )) : <p>Add some products to wishlist</p>}
                  </div>
                </section>

                <section>
                  <button onClick={() => signOut()}>Sign Out</button>
                </section>
              </div>



            </> : <UnAuthorizedUser />}
      </div >
    </>
  );
}

// Reusable Section Component
const Section = ({ title, label, data, renderItem }, ref) => (
  <div ref={ref} className="section">
    <h2>{title} {useTranslation("common").t(label)}</h2>
    <div className="grid">
      {data?.length ? data.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      )) : <p>{useTranslation("common").t(`no_${label}`)}</p>}
    </div>
  </div>
);

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}

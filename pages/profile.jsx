import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "@/styles/userProfile.module.css";
import axios from "axios";
import { signOut } from "next-auth/react";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";

export default function UserProfile() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const sectionsRef = useRef([]);

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

              <div><span>{user?.name}</span> <span>{user?.loyaltyPoints}</span></div>

              <div className={styles.profile_card}>
                <table>
                  <tr>
                    <td>{t("email")}</td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>

                    <td>{t("phone")}:</td>
                    <td>{user?.phone}</td>
                  </tr>

                </table>
                <section>
                  <h3>Addresses</h3>

                  {user.addresses.map((item, index) => (
                    <div>
                      <span>{item.lable}</span>
                      <span>{item.address}</span>
                      <span>{item.city}</span>
                      <span>{item.country}</span>
                      <span>{item.pincode}</span>
                    </div>
                  ))}
                </section>
                <section>
                  <h3>Cart</h3>
                  {user.cartData.map((item) => (
                    <>
                      {item.productId} ----
                      {item.quantity_demanded}
                    </>
                  ))}
                </section>
                <section>
                  <h3>Wishlist</h3>
                  {user.wishlistData.length !== 0 ? user.wishlistData.map((item) => (
                    <>
                      {item.productId}
                    </>
                  )) : <p>Add some products to wishlist</p>}
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

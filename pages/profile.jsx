import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "@/styles/userProfile.module.css";
import axios from "axios";
import { signOut } from "next-auth/react";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";
import Link from "next/link";
import { FaBars, FaEdit, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function UserProfile() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  // Fetch user profile
  useEffect(() => {
    if (!session?.user) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/userProfile?userId=${session.user.id}`);
        if (res.status !== 200) {
          throw new Error(t("profilePage.fetch_error"));
        }
        setUser(res.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [session]);

  if (error)
    return (
      <div className={styles.profile_container_loading}>
        <div className="navHolder"></div>
        <p className="error">{t("profilePage.error_loading")}: {error}</p>
      </div>
    );

  if (!user || loading) return <SkeletonLoader />;

  return (
    <>
      <div className="navHolder"></div>

      <div className={styles.profile_container}>
        {session?.user ? (
          <div className={styles.profile_card}>
            <div className={styles.top_name}>
              <div className={styles.top_name_left}>

                <span className={styles.username}>{user?.name}</span>
              </div>
              <div>
                <span className={styles.loyaltyPoint}>{user?.loyaltyPoints}</span>
              </div>
            </div>
            <table className={styles.user_detail}>
              <tr>
                <td>{t("profilePage.userId")}</td>
                <td>{user?._id}</td>
              </tr>
              <tr>
                <td>{t("profilePage.email")}</td>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <td>{t("profilePage.phone")}</td>
                <td>{user?.phone}</td>
              </tr>
            </table>
            <section>
              <h3>{t("profilePage.addresses")}</h3>
              <table className={styles.address_plate}>
                <tr>
                  <th>{t("profilePage.address")}</th>
                  <th>{t("profilePage.city")}</th>
                  <th>{t("profilePage.country")}</th>
                  <th>{t("profilePage.label")}</th>
                  <th>{t("profilePage.pincode")}</th>
                  <th>{t("profilePage.action")}</th>
                </tr>
                {user?.addresses.map((item, index) => (
                  <tr key={index}>
                    <td>{item.address}</td>
                    <td>{item.city}</td>
                    <td>{item.country}</td>
                    <td>{item.label || "-"}</td>
                    <td>{item.pincode}</td>
                    <td className={styles.addr_action}>
                      <span><FaEdit /></span>
                      <span style={{ background: "red" }}><MdDelete /></span>
                    </td>
                  </tr>
                ))}
              </table>
            </section>
            <section className={styles.orders}>
              <h3>{t("profilePage.orders")}</h3>
              <Link href={`/track-order?orderId=all&userId=${user?._id}`}>{t("profilePage.track_orders")}</Link>
              <Link href="/orders?status=canceled">{t("profilePage.canceled_orders")}</Link>
              <Link href="/orders">{t("profilePage.all_orders")}</Link>
            </section>
            <section>
              <button onClick={() => signOut()}>{t("profilePage.sign_out")}</button>
            </section>
          </div>
        ) : (
          <UnAuthorizedUser />
        )}
      </div>
    </>
  );
}

function SkeletonLoader() {
  return (
    <>
      <div className="navHolder"></div>
      <div className={styles.skeleton_container}>
        <div className={styles.skeleton_sidebar}>
          <div className={styles.skeleton_section}></div>
          <div className={styles.skeleton_section}></div>
          <div className={styles.skeleton_section}></div>
          <div className={styles.skeleton_section}></div>
        </div>
        <div className={styles.skeleton_card}>
          <div className={styles.skeleton_header}></div>
          <div className={styles.skeleton_section}></div>
          <div className={styles.skeleton_row}></div>
          <div className={styles.skeleton_row}></div>
          <div className={styles.skeleton_row}></div>
          <div className={styles.skeleton_section}></div>
          <div className={styles.skeleton_row}></div>
          <div className={styles.skeleton_row}></div>
          <div className={styles.skeleton_row}></div>
          <div className={styles.skeleton_section}></div>
          <div className={styles.skeleton_section}></div>
        </div>
      </div>
    </>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}

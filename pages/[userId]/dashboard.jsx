import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import styles from "@/styles/userProfile.module.css";
import axios from "axios";
import { signOut } from "next-auth/react";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";
import Link from "next/link";
import { FaBars, FaEdit, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

export default function UserProfile() {
  const { data: session } = useSession();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState()
  const router = useRouter()


  // User LOgout Function
  const UserLogOut = () => {
    try {
      signOut()
    } catch {
      setNotification("Error Signing Out")
    }
  }
  // Fetch user profile
  useEffect(() => {
    if (!session?.user) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/secure/userProfile?userId=${session.user.id}`);
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

  if (loading) return <SkeletonLoader />;

  return (
    <>
      <div className="navHolder"></div>
      {notification && <div className="notification">{notification}</div>}
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
                <td>User ID</td>
                <td>{user?._id}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{user?.phone}</td>
              </tr>
            </table>
            <section>
              <h3>Addresses</h3>
              <table className={styles.address_plate}>
                <tr>
                  <th>Address</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Label</th>
                  <th>Pincode</th>
                  <th>Action</th>
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
              <h3>Orders</h3>
              <Link href={`/${user._id}/track-order?orderId=all&userId=${user?._id}`}>Track Orders</Link>
              <Link href={`/${user._id}/orders?status=canceled`}>Canceled Orders</Link>
              <Link href={`/${user._id}/orders?status=all_orders`}>All Orders</Link>
            </section>
            <section className={styles.customer_services}>
              <h3>More Services</h3>
              <Link href="/refund">Refund</Link>
              <Link href="/payment-history">Payment History</Link>
              <Link href="/customer-care">Customer Care</Link>
              <Link href="/help">Help</Link>
            </section>
            <section>
              <button onClick={() => UserLogOut()} style={{ background: "var(--danger)" }}>Sign Out</button>
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


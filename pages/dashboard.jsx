import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import styles from "@/styles/userProfile.module.css";
import axios from "axios";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

export default function UserProfile() {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
    pincode: "",
    label: "",
  });

  // ✅ Logout Function
  const UserLogOut = () => {
    try {
      signOut({ callbackUrl: "/authenticate" });
    } catch {
      setNotification("Error Signing Out");
    }
  };

  // ✅ Fetch User Profile
  useEffect(() => {
    if (!session?.user) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/secure/userProfile?userId=${session.user.id}`);
        if (res.status !== 200) throw new Error("Error fetching user data");
        setUser(res.data.user);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [session]);

  // ✅ Show Form for Add/Edit
  const openAddressForm = (index = null) => {
    if (index !== null) {
      const addr = user.addresses[index];
      setFormData({ ...addr });
      setEditIndex(index);
    } else {
      setFormData({
        address: "",
        city: "",
        country: "",
        pincode: "",
        label: "",
      });
      setEditIndex(null);
    }
    setShowAddressForm(true);
  };

  // ✅ Add or Edit Address
  const saveAddress = async () => {
    if (!formData.address || !formData.city || !formData.country || !formData.pincode) {
      return setNotification("All fields are required!");
    }

    const updatedAddresses = [...(user.addresses || [])];
    if (editIndex !== null) {
      // Edit mode
      updatedAddresses[editIndex] = formData;
    } else {
      // Add mode
      updatedAddresses.push(formData);
    }

    try {
      await axios.put("/api/secure/userProfile", {
        userId: session.user.id,
        updates: { addresses: updatedAddresses },
      });
      setUser({ ...user, addresses: updatedAddresses });
      setNotification(editIndex !== null ? "Address updated!" : "Address added!");
      setShowAddressForm(false);
      setEditIndex(null);
    } catch (err) {
      setNotification("Error saving address: " + err.message);
    }
  };

  // ✅ Delete Address
  const deleteAddress = async (index) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    const updatedAddresses = [...user.addresses];
    updatedAddresses.splice(index, 1);

    try {
      await axios.put("/api/secure/userProfile", {
        userId: session.user.id,
        updates: { addresses: updatedAddresses },
      });
      setUser({ ...user, addresses: updatedAddresses });
      setNotification("Address deleted successfully");
    } catch (err) {
      setNotification("Error deleting address: " + err.message);
    }
  };

  // ✅ Error Handling
  if (error) {
    router.push("/authenticate");
    return (
      <div className={styles.profile_container_loading}>
        <div className="navHolder"></div>
        <p className="error">Error Loading Profile Page: {error}</p>
        <p>Redirecting to authenticate...</p>
      </div>
    );
  }

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
                <span className={styles.userid}>#{user?._id}</span>
              </div>
            </div>

            <table className={styles.user_detail}>
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>{user?.email}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{user?.phone}</td>
                </tr>
              </tbody>
            </table>

            {/* ✅ Address Section */}
            <section>
              <h3>Addresses <span className={styles.add_btn}
                onClick={() => openAddressForm(null)}
              >
                +
              </span></h3>


              <table className={styles.address_plate}>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user?.addresses?.map((item, index) => (
                    <tr key={index}>
                      <td>{`${item.label} - ${item.address}, ${item.city}, ${item.country}, ${item.pincode}`}</td>
                      <td className={styles.addr_action}>
                        <span onClick={() => openAddressForm(index)}>
                          <FaEdit />
                        </span>
                        <span
                          onClick={() => deleteAddress(index)}
                          style={{ background: "red" }}
                        >
                          <MdDelete />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ✅ Address Form Modal */}
            {showAddressForm && (
              <div className={styles.addressFormBack}>
                <div className={styles.new_address_form}>
                  <h4>{editIndex !== null ? "Edit Address" : "Add New Address"}</h4>

                  <div className={styles.addressLabels}>
                    {["Home", "Office", "Other"].map((label) => (
                      <span
                        key={label}
                        className={formData.label === label ? styles.active : ""}
                        onClick={() => setFormData({ ...formData, label })}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />

                  <div className={styles.formButtons}>
                    <button onClick={saveAddress}>
                      {editIndex !== null ? "Update Address" : "Add Address"}
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Other Sections */}
            <section className={styles.orders}>
              <h3>Orders</h3>
              <Link href={`/${user._id}/track-order?orderId=all&userId=${user?._id}`}>
                Track Orders
              </Link>
              <Link href={`/${user._id}/orders?status=canceled`}>Canceled Orders</Link>
              <Link href={`/${user._id}/orders?status=all_orders`}>All Orders</Link>
            </section>

            <section className={styles.customer_services}>
              <h3>More Services</h3>
              <Link href="/customer-care">Customer Care</Link>
            </section>

            <section>
              <button
                onClick={() => UserLogOut()}
                style={{ background: "var(--danger)" }}
              >
                Sign Out
              </button>
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
    <div className={styles.skeleton_container}>
      <div className={styles.skeleton_card}>
        <div className={styles.skeleton_header}></div>
        <div className={styles.skeleton_section}></div>
        <div className={styles.skeleton_row}></div>
        <div className={styles.skeleton_row}></div>
        <div className={styles.skeleton_row}></div>
      </div>
    </div>
  );
}

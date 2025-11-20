// File: components/UserProfile.jsx

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
  const [showUserEditForm, setShowUserEditForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    label: "Home",
  });

  const [editUserData, setEditUserData] = useState({ name: "", email: "" });

  // Notifications helper (auto-dismiss)
  useEffect(() => {
    if (!notification) return;
    const id = setTimeout(() => setNotification(""), 4500);
    return () => clearTimeout(id);
  }, [notification]);

  // Logout
  const UserLogOut = () => {
    try {
      signOut({ callbackUrl: "/authenticate" });
    } catch (err) {
      setNotification("Error Signing Out");
    }
  };

  // Fetch User Profile
  useEffect(() => {
    if (!session?.user) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/secure/userProfile?userId=${encodeURIComponent(session.user.id)}`);
        if (res.status !== 200) throw new Error("Error fetching user data");
        setUser(res.data.user);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unknown error");
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [session]);

  // Open user edit form
  const openUserEditForm = () => {
    setEditUserData({ name: user?.name || "", email: user?.email || "" });
    setShowUserEditForm(true);
  };

  // Save user data (name required, email optional)
  const saveUserData = async () => {
    if (!editUserData.name || !editUserData.name.trim()) return setNotification("Name is required");

    if (!session?.user?.id) return setNotification("Authentication error");

    try {
      const payload = {
        userId: session.user.id,
        updates: {
          name: editUserData.name.trim(),
        },
      };
      // only include email if user provided it (optional)
      if (editUserData.email && editUserData.email.trim()) payload.updates.email = editUserData.email.trim();

      await axios.put("/api/secure/userProfile", payload);

      setUser((prev) => ({ ...prev, ...payload.updates }));
      setShowUserEditForm(false);
      setNotification("Profile updated successfully");
    } catch (err) {
      setNotification(err?.response?.data?.message || err.message || "Failed to update profile");
    }
  };

  // Open Address form
  const openAddressForm = (index = null) => {
    if (index !== null) {
      const addr = user.addresses[index];
      setFormData({ ...addr });
      setEditIndex(index);
    } else {
      setFormData({ address: "", city: "", state: "", country: "", pincode: "", label: "Home" });
      setEditIndex(null);
    }
    setShowAddressForm(true);
  };

  // Save address (reuses same PUT endpoint)
  const saveAddress = async () => {
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.country.trim() || !formData.pincode.trim())
      return setNotification("All address fields are required");

    if (!session?.user?.id) return setNotification("Authentication error");

    const updatedAddresses = [...(user.addresses || [])];
    const normalized = {
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      pincode: formData.pincode.trim(),
      label: formData.label || "Other",
    };

    if (editIndex !== null) updatedAddresses[editIndex] = normalized;
    else updatedAddresses.push(normalized);

    try {
      await axios.put("/api/secure/userProfile", {
        userId: session.user.id,
        updates: { addresses: updatedAddresses },
      });

      setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
      setNotification(editIndex !== null ? "Address updated!" : "Address added!");
      setShowAddressForm(false);
      setEditIndex(null);
    } catch (err) {
      setNotification(err?.response?.data?.message || err.message || "Failed to save address");
    }
  };

  // Delete address
  const deleteAddress = async (index) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    if (!session?.user?.id) return setNotification("Authentication error");

    const updatedAddresses = [...(user.addresses || [])];
    updatedAddresses.splice(index, 1);

    try {
      await axios.put("/api/secure/userProfile", {
        userId: session.user.id,
        updates: { addresses: updatedAddresses },
      });
      setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
      setNotification("Address deleted successfully");
    } catch (err) {
      setNotification(err?.response?.data?.message || err.message || "Failed to delete address");
    }
  };

  if (error) {
    // if unauthorized or server error, redirect to authenticate
    router.push("/authenticate");
    return (
      <div className={styles.profile_container_loading}>
        <div className="navHolder"></div>
        <p className="error">Error Loading Profile Page: {error}</p>
      </div>
    );
  }

  if (loading) return (
    <div className={styles.skeleton_container}>
      <div className={styles.skeleton_card}></div>
    </div>
  );

  return (
    <div className={styles.page_wrap}>
      <div className="navHolder"></div>

      {notification && <div className={styles.notification}>{notification}</div>}

      <div className={styles.profile_container}>
        {session?.user ? (
          <div className={styles.profile_card}>

            <div className={styles.profile_header}>
              <div className={styles.avatar}>{user?.name?.[0] || "U"}</div>
              <div className={styles.header_info}>
                <h2 className={styles.username}>{user?.name}</h2>
                <p className={styles.userid}>ID: <span>#{user?._id}</span></p>
              </div>

              <div className={styles.header_actions}>
                <button className={styles.icon_btn} onClick={openUserEditForm} title="Edit profile">
                  <FaEdit />
                </button>

              </div>
            </div>

            <div className={styles.profile_body}>
              <div className={styles.info_grid}>
                <div className={styles.info_card}>
                  <h4>Email</h4>
                  <p>{user?.email || "—"}</p>
                </div>
                <div className={styles.info_card}>
                  <h4>Phone</h4>
                  <p>{user?.phone || "—"}</p>
                </div>
                <div className={styles.info_card}>
                  <h4>Orders</h4>
                  <p className={styles.link_like}>
                    <Link href={`/${user._id}/orders?status=all_orders`}>View orders</Link>
                  </p>
                </div>
              </div>

              <section className={styles.address_section}>
                <div className={styles.address_header}>
                  <h3>Addresses</h3>
                  <button className={styles.add_btn} onClick={() => openAddressForm(null)}>+ Add</button>
                </div>

                <div className={styles.address_list}>
                  {user?.addresses?.length ? (
                    user.addresses.map((item, idx) => (
                      <div className={styles.address_item} key={idx}>
                        <div>
                          <div className={styles.addr_label}>{item.label}</div>
                          <div className={styles.addr_text}>{`${item.address}, ${item.city}, ${item.state}, ${item.country} - ${item.pincode}`}</div>
                        </div>
                        <div className={styles.addr_actions}>
                          <button className={styles.icon_btn} onClick={() => openAddressForm(idx)} title="Edit address"><FaEdit /></button>
                          <button className={styles.delete_btn} onClick={() => deleteAddress(idx)} title="Delete address"><MdDelete /></button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.empty}>No addresses yet</p>
                  )}
                </div>
              </section>
              <section className={styles.signout_section}>

                <button className={styles.signout_btn} onClick={UserLogOut}>Sign Out</button>
              </section>

            </div>

          </div>
        ) : (
          <UnAuthorizedUser />
        )}
      </div>

      {/* User Edit Modal */}
      {showUserEditForm && (
        <div className={styles.modal_back} onMouseDown={() => setShowUserEditForm(false)}>
          <div className={styles.modal_card} onMouseDown={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <div className={styles.field_group}>
              <label>Full name</label>
              <input value={editUserData.name} onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className={styles.field_group}>
              <label>Email (optional)</label>
              <input value={editUserData.email} onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} placeholder="Email address" />
            </div>
            <div className={styles.form_row}>
              <button className={styles.primary_btn} onClick={saveUserData}>Save</button>
              <button className={styles.ghost_btn} onClick={() => setShowUserEditForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressForm && (
        <div className={styles.modal_back} onMouseDown={() => setShowAddressForm(false)}>
          <div className={styles.modal_card} onMouseDown={(e) => e.stopPropagation()}>
            <h3>{editIndex !== null ? "Edit Address" : "Add Address"}</h3>

            <div className={styles.labels_row}>
              {["Home", "Office", "Other"].map((label) => (
                <button
                  key={label}
                  className={`${styles.label_chip} ${formData.label === label ? styles.active_chip : ""}`}
                  onClick={() => setFormData({ ...formData, label })}
                >
                  {label}
                </button>
              ))}

            </div>

            <div className={styles.field_group}>
              <label>Address</label>
              <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street / House No" />
            </div>
            <div className={styles.row_two}>
              <div className={styles.field_group} style={{ flex: 1 }}>
                <label>City</label>
                <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
              </div>
              <div className={styles.field_group} style={{ flex: 1 }}>
                <label>State</label>
                <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State" />
              </div>
              <div className={styles.field_group} style={{ flex: 1 }}>
                <label>Country</label>
                <input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
              </div>
            </div>
            <div className={styles.row_two}>
              <div className={styles.field_group} style={{ flex: 1 }}>
                <label>Pincode</label>
                <input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="Pincode" />
              </div>
              <div className={styles.field_group} style={{ flex: 1 }}>
                <label>Label</label>
                <input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Home / Office / Other" />
              </div>
            </div>

            <div className={styles.form_row}>
              <button className={styles.primary_btn} onClick={saveAddress}>{editIndex !== null ? "Update" : "Add"}</button>
              <button className={styles.ghost_btn} onClick={() => setShowAddressForm(false)}>Cancel</button>
            </div>
          </div>

        </div>
      )}



    </div>
  );
}

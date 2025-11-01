import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import styles from "@/styles/checkout.module.css";

const LOCAL_CART_KEY = "guest_cart";

function loadCartFromLocalStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Normalize entries to { productId, variantId|null, quantity }
    return parsed.map((it) => ({
      productId: it.productId,
      variantId: it.variantId ?? null,
      quantity: Number(it.quantity ?? it.quantity_demanded ?? 1),
    }));
  } catch (e) {
    console.error("Failed to parse local cart", e);
    return [];
  }
}

export default function Checkout() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [summary, setSummary] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    address: "",
    city: "",
    country: "",
    pincode: "",
  });
  const [promocode, setPromocode] = useState("");

  // Product list: { productId, variantId|null, quantity }
  const [products, setProducts] = useState([]);

  // Always gather phone from user (prefill if available)
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [name, setName] = useState(session?.user?.name || "");

  // Load Razorpay script safely
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => setError("Failed to load payment gateway. Try again.");
      document.body.appendChild(script);
    };

    if (!window?.Razorpay) loadScript();
    else setRazorpayLoaded(true);
  }, []);

  useEffect(() => {
    if (!session?.user && typeof window !== "undefined") {
      const storedGuest = localStorage.getItem("guest_user");
      if (storedGuest) {
        try {
          const guest = JSON.parse(storedGuest);
          if (guest.name) setName(guest.name);
          if (guest.phone) setPhone(guest.phone);
        } catch { }
      }
    }
  }, []);


  // Redirect if not logged in (you previously had this). Keep but non-blocking — we still support guest checkout.
  useEffect(() => {
    if (status === "unauthenticated") {
      // do not forcibly redirect — we allow guest checkout (the original code redirected to login)
      // If you still want the redirect behavior, uncomment the next line:
      // router.push("/auth?type=login");
    }
  }, [status, router]);

  // Initialize products from query or cart (backend or localStorage)
  useEffect(() => {
    async function initProducts() {
      // wait until query is ready
      if (!router.isReady) return;

      // 1) If explicit buy-now via query
      if (router.query.productId && router.query.productId !== "null") {
        setProducts([
          {
            productId: router.query.productId,
            variantId: router.query.variantId ?? null,
            quantity: Number(router.query.quantity_demanded ?? 1),
          },
        ]);
        return;
      }

      // 2) If user is logged in, attempt to fetch backend cart
      if (session?.user?.id) {
        try {
          const { data } = await axios.get(`/api/secure/cart?userId=${session.user.id}`, {
            withCredentials: true,
          });

          // normalize any backend representations
          const cartProducts = Array.isArray(data)
            ? data.map((item) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              quantity: Number(item.quantity_demanded ?? item.quantity ?? 1),
            }))
            : [];

          // If server cart has items, use them
          if (cartProducts.length > 0) {
            setProducts(cartProducts);
            return;
          }

          // If server cart is empty, fallback to localStorage cart (guest_cart)
          const local = loadCartFromLocalStorage();
          // console.log(local);
          if (local.length > 0) {
            // Option A: show local cart for checkout and optionally send to backend to merge
            // For now we only load it into UI. You may want to merge after login.
            setProducts(local);
            return;
          } else {
            router.push("/cart");
          }

          // nothing found
          setProducts([]);
        } catch (err) {
          console.error("Failed to fetch server cart", err);
          // fallback to local
          const local = loadCartFromLocalStorage();
          if (local.length > 0) {
            setProducts(local);
          } else {
            setProducts([]);
          }
        }
        return;
      }

      // 3) Not logged in: load localStorage cart
      const local = loadCartFromLocalStorage();
      setProducts(local);
    }

    initProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query, session?.user?.id]);

  // Fetch addresses & summary once session & products are ready
  useEffect(() => {
    if (!products) return;
    if (session?.user) {
      // fetch addresses for logged in users
      (async () => {
        try {
          await fetchAddresses();
        } catch (e) {
          console.error(e);
        }
      })();
    }
    // fetch summary when products present (or products may be empty array)
    (async () => {
      try {
        await fetchSummary();
      } catch (e) {
        setError("Failed to initialize checkout");
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, products, selectedAddressId]);

  const fetchSummary = async () => {
    try {
      setError(null);

      if (products.length === 0) {
        setSummary(null);
        return;
      }

      // backend expects null for products when there are none (you mentioned this)
      const payload = {
        promocode,
        products: products && products.length > 0 ? products : null,
        addressId: selectedAddressId || null,
      };

      const { data } = await axios.post("/api/secure/checkout", payload, {
        withCredentials: true,
      });

      // backend should return a structured summary. guard against empty responses
      if (!data) {
        setError("Checkout service returned no data");
        return;
      }

      setSummary(data);

      // if backend provides addresses for convenience, set selectedAddressId
      if (!selectedAddressId && data.addresses?.length) {
        setSelectedAddressId(data.addresses[0]._id);
      }
    } catch (err) {
      console.error("Error fetching summary", err);
      setError("Failed to prepare checkout data");
    }
  };

  const fetchAddresses = async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await axios.get(`/api/secure/userProfile?userId=${session.user.id}`, {
        withCredentials: true,
      });
      setAddresses(data.user?.addresses || []);
      if (data.user?.addresses?.length) {
        setSelectedAddressId((prev) => prev || data.user.addresses[0]._id || "");
      }
      // prefill phone if available in profile
      if (data.user?.phone) setPhone(data.user.phone);
      if (data.user?.name) setPhone(data.user.name);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const addNewAddress = async () => {
    // when logged in, post to backend. When guest, just attach locally (we'll use newAddress for delivery)
    if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
      alert("Please fill all address fields");
      return;
    }

    if (session?.user?.id) {
      try {
        await axios.post(
          "/api/secure/userProfile",
          { userId: session.user.id, address: newAddress },
          { withCredentials: true }
        );
        await fetchAddresses();
        setShowNewAddressForm(false);
        setNewAddress({ label: "Home", address: "", city: "", country: "", pincode: "" });
      } catch (err) {
        console.error("Failed to add address", err);
        alert("Could not add address. Try again.");
      }
      return;
    }

    // guest: simply close the form and keep newAddress in state (will be used for delivery)
    setShowNewAddressForm(false);
  };

  const updateQuantity = (productId, variantId, change) => {
    setProducts((prev) => {
      const idx = prev.findIndex(
        (p) =>
          p.productId === productId &&
          (variantId ? p.variantId === variantId : p.variantId === null)
      );
      if (idx === -1) return prev;
      const updated = [...prev];
      const item = updated[idx];
      const newQty = Math.max(1, Math.min(5, item.quantity + change)); // clamp between 1 and 5
      if (newQty === item.quantity) return prev;
      updated[idx] = { ...item, quantity: newQty };

      // also persist guest changes to localStorage
      try {
        if (!session?.user) {
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
          }
        }
      } catch (e) {
        console.error("Failed to save local cart", e);
      }

      return updated;
    });

    // Keep summary in sync if available
    setSummary((prev) => {
      if (!prev || !Array.isArray(prev.products)) return prev;
      const productIndex = prev.products.findIndex(
        (p) => p.productId === productId && p.variantId === variantId
      );
      if (productIndex === -1) return prev;
      const updatedSummary = { ...prev };
      const newProducts = [...prev.products];
      const current = newProducts[productIndex];
      const newQty = Math.max(1, Math.min(5, current.quantity + change));
      if (newQty === current.quantity) return prev;
      newProducts[productIndex] = { ...current, quantity: newQty };
      updatedSummary.products = newProducts;
      return updatedSummary;
    });
  };

  // Create a guest user on-the-fly (simple example). Adjust endpoint/path to your backend.
  const createGuestUser = async (phoneNumber) => {
    try {
      const { data } = await axios.post(
        "/api/create-guest",
        {
          name: name,
          phone: phoneNumber,
          address: {
            label: newAddress.label,
            address: newAddress.address,
            city: newAddress.city,
            country: newAddress.country,
            pincode: newAddress.pincode,
          },
        },
        { withCredentials: true }
      );

      const guestUser = data?.user ?? null;

      if (guestUser && typeof window !== "undefined") {
        // Save guest user info to localStorage
        localStorage.setItem(
          "guest_user",
          JSON.stringify({
            id: guestUser._id ?? guestUser.id,
            name: guestUser.name,
            phone: guestUser.phone,
          })
        );
      }

      signIn("credentials", {
        redirect: false,
        userId: guestUser._id ?? guestUser.id,
      });

      return guestUser;
    } catch (err) {
      console.error("Failed to create guest user", err);
      throw new Error("Could not create guest account");
    }
  };

  const initiatePayment = async () => {
    if (!window.Razorpay) return alert("Payment gateway not ready yet. Try again in a second.");
    if (!razorpayLoaded) return alert("Payment gateway not ready");
    if (!phone || phone.trim().length < 6) return alert("Please enter a valid phone number");
    if (!name || name.trim().length < 2) return alert("Please enter a Name");
    if (products.length === 0) return alert("Your cart is empty");

    // prepare delivery address data (if logged in use selectedAddressId from stored addresses,
    // otherwise use newAddress filled by user)
    let deliveryAddressPayload = null;
    if (session?.user) {
      const selectedAddr = addresses.find((a) => a._id === selectedAddressId);
      if (!selectedAddr && !showNewAddressForm) {
        return alert("Please select a delivery address or add a new one.");
      }
      // If they opened new address form and saved it, use that; else use selected stored address
      if (showNewAddressForm) {
        // ensure newAddress has required fields
        if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
          return alert("Please complete the new address form");
        }
        deliveryAddressPayload = { ...newAddress };
      } else {
        deliveryAddressPayload = { ...selectedAddr };
      }
    } else {
      // Guest: take address from newAddress form
      if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
        return alert("Please fill in your address details for delivery");
      }
      deliveryAddressPayload = { ...newAddress };
    }

    setLoading(true);

    try {
      // If guest, create a user account first (backend should return a minimal user object with id)
      let userForOrder = session?.user ?? null;

      if (!session?.user) {
        const createdUser = await createGuestUser(phone.trim());
        if (!createdUser || !createdUser._id) {
          throw new Error("Failed to create guest user");
        }
        userForOrder = createdUser;
      }


      // Build order payload — ensure `products` is sent as null if empty (backend expectation)
      const orderPayload = {
        promocode,
        deliveryAddress: {
          name: session?.user?.name ?? name,
          phone: phone.trim(),
          email: session?.user?.email ?? null,
          ...deliveryAddressPayload,
        },
        products: products && products.length > 0 ? products : null,
        userId: userForOrder.id ?? userForOrder._id ?? null,
        phone: phone.trim(),
      };

      const { data: order } = await axios.post("/api/razorpay/create-order", orderPayload, {
        withCredentials: true,
      });

      // Launch Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Organic Robust",
        description: "Order Payment",
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userForOrder.id ?? userForOrder._id ?? null,
            };
            const { data: verify } = await axios.post("/api/razorpay/verify-payment", verifyPayload, {
              withCredentials: true,
            });

            if (verify?.status === "success") {
              // Clear guest local cart if present
              if (!session?.user) {
                try {
                  localStorage.removeItem(LOCAL_CART_KEY);
                } catch (e) {
                  console.warn("Could not clear guest cart", e);
                }
              }
              router.push(`/${userForOrder.id ?? userForOrder._id}/order-success?orderId=${response.razorpay_order_id}`);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert("Payment verification error");
            console.error(err);
          }
        },
        prefill: {
          name: session?.user?.name || name,
          phone: phone.trim() || "",
        },
        theme: { color: "#0ea5e9" },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert(err.message || "Could not start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className={styles.navHolder}></div>

      <div className={styles.checkout_container}>
        <h1 className={styles.checkout_head}>Checkout</h1>

        {/* Account label */}
        <div style={{ marginBottom: 12 }}>
          {session?.user ? (
            <div>
              <strong>Logged in as:</strong> {session.user.name} ({session.user.email || "no email"})
            </div>
          ) : (
            <div>
              <strong>Guest Checkout:</strong> An account will be created using the phone number you provide.
            </div>
          )}
        </div>

        {/* Product List */}
        <section className={styles.productList}>
          {summary.products.map((p) => {
            const productState = products.find((prod) => {
              const sameProduct = prod.productId === p.productId;
              const sameVariant = p.variantId
                ? p.variantId === (prod.variantId ?? prod.productId)
                : prod.variantId === null || prod.variantId === prod.productId;
              return sameProduct && sameVariant;
            });

            return (
              <div key={`${p.productId}-${p.variantId ?? "default"}`} className={styles.product}>
                <img src={p.imageUrl} alt={p.name} className={styles.product_img} />
                <div className={styles.product_details}>
                  <h3>{p.name}</h3>
                  {p.variantName && <p className={styles.variant}>Variant: {p.variantName}</p>}
                  <p className={styles.price}>₹{p.price}</p>
                  <div className={styles.quantity_setter}>
                    <button
                      onClick={() => updateQuantity(p.productId, p.variantId ?? null, -1)}
                      disabled={!productState || productState?.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{productState?.quantity ?? 1}</span>
                    <button
                      onClick={() => updateQuantity(p.productId, p.variantId ?? null, +1)}
                      disabled={!productState || productState?.quantity >= 5}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* customer name */}
        <div className={styles.name_section}>
          <label>
            Name number (required)
          </label>
          <input
            type="text"
            placeholder="Delivering to"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", padding: 8, marginTop: 6 }}
          />
        </div>

        {/* Phone input (always required) */}
        <div className={styles.phone_section}>
          <label>
            Phone number (required)
          </label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ display: "block", padding: 8, marginTop: 6 }}
          />
        </div>


        {/* Address Section */}
        <div className={styles.address_section}>
          <h3>Select Delivery Address</h3>

          {session?.user ? (
            <>
              <div className={styles.address_section_in}>
                <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.label} - {addr.address}, {addr.city}, {addr.country}, {addr.pincode}
                    </option>
                  ))}
                </select>
                <button onClick={() => setShowNewAddressForm((s) => !s)}>
                  {showNewAddressForm ? "−" : "+"}
                </button>
              </div>

              {showNewAddressForm && (
                <div className={styles.new_address_form}>
                  <div className={styles.addressLabels}>
                    {["Home", "Office", "Other"].map((label) => (
                      <span
                        key={label}
                        className={newAddress.label === label ? styles.active : ""}
                        onClick={() => setNewAddress({ ...newAddress, label })}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  />
                  <button onClick={addNewAddress}>Add Address</button>
                </div>
              )}
            </>
          ) : (
            // Guest: show one address form (we'll use newAddress as delivery data)
            <div className={styles.new_address_form}>
              <div className={styles.addressLabels}>
                {["Home", "Office", "Other"].map((label) => (
                  <span
                    key={label}
                    className={newAddress.label === label ? styles.active : ""}
                    onClick={() => setNewAddress({ ...newAddress, label })}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              />
              <button onClick={() => setShowNewAddressForm(false)}>Use This Address</button>
            </div>
          )}
        </div>

        {/* Promo Section */}
        <section className={styles.promo_section}>
          <input
            type="text"
            placeholder="Promo Code"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value.trim())}
          />
          <button onClick={fetchSummary}>Apply</button>
        </section>

        {/* Amount Section */}
        <section className={styles.amount_section}>
          <h2>Amount Breakdown</h2>
          <div className={styles.amountSummary}>
            <span>
              <strong>Item Total:</strong> ₹{summary.itemTotal}
            </span>
            {summary.promoDiscount > 0 && (
              <span>
                <strong>Promo Discount:</strong> ₹{summary.promoDiscount}
              </span>
            )}
            <span>
              <strong>Delivery:</strong> ₹{summary.deliveryCharges}
            </span>
            <span>
              <strong>Total : </strong> ₹{summary.totalAmount}
            </span>
            <span>
              <strong>Free Delivery:</strong> -₹{summary.deliveryCharges}
            </span>
            <span className={styles.total}>
              <strong>Total Payable:</strong> ₹{summary.finalAmount}
            </span>
          </div>
        </section>

        <button onClick={initiatePayment} className={styles.pay_btn}>
          Proceed To Pay ₹{summary.finalAmount}
        </button>
      </div>
    </>
  );
}

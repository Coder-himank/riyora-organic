import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import styles from "@/styles/checkout.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import NewAddressForm from "@/components/AddressForm";
import PromoSection from "@/components/PromoSection";
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
  const [availablePromos, setAvailablePromos] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [promocode, setPromocode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  // Product list: { productId, variantId|null, quantity }
  const [products, setProducts] = useState([]);

  // Always gather phone from user (prefill if available)
  // react-phone-input-2 expects country code like 'in' for India
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("in"); // use country iso
  const [name, setName] = useState("");

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

    if (typeof window !== "undefined") {
      if (!window?.Razorpay) loadScript();
      else setRazorpayLoaded(true);
    }
  }, []);

  // Prefill name/phone from session or guest_user local storage
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.phone) setPhone(session.user.phone);
    } else if (typeof window !== "undefined") {
      const storedGuest = localStorage.getItem("guest_user");
      if (storedGuest) {
        try {
          const guest = JSON.parse(storedGuest);
          if (guest.name) setName(guest.name);
          if (guest.phone) setPhone(guest.phone);
        } catch (e) {
          // ignore
        }
      }
    }
  }, [session?.user]);

  // Redirect if not logged in (kept non-blocking — guest checkout supported)
  useEffect(() => {
    if (status === "unauthenticated") {
      // guest flows allowed — no redirect
    }
  }, [status, router]);

  // Initialize products from query or cart (backend or localStorage)
  useEffect(() => {
    async function initProducts() {
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
          const { data } = await axios.get(
            `/api/secure/cart?userId=${session.user.id}`,
            { withCredentials: true }
          );

          const cartProducts = Array.isArray(data)
            ? data.map((item) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              quantity: Number(item.quantity_demanded ?? item.quantity ?? 1),
            }))
            : [];

          if (cartProducts.length > 0) {
            setProducts(cartProducts);
            return;
          }

          const local = loadCartFromLocalStorage();
          if (local.length > 0) {
            setProducts(local);
            return;
          } else {
            router.push("/cart");
            return;
          }
        } catch (err) {
          console.error("Failed to fetch server cart", err);
          const local = loadCartFromLocalStorage();
          if (local.length > 0) {
            setProducts(local);
          } else {
            setProducts([]);
          }
          return;
        }
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
      (async () => {
        try {
          await fetchAddresses();
        } catch (e) {
          console.error(e);
        }
      })();
    }

    (async () => {
      try {
        await fetchSummary();
        await fetchPromoCodes();
      } catch (e) {
        setError("Failed to initialize checkout");
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, products, selectedAddressId]);

  const fetchPromoCodes = async () => {
    try {
      const { data } = await axios.get("/api/getPromo");
      // console.log("Active promo codes:", data);
      setAvailablePromos(data)
    } catch (err) {
      setAvailablePromos([])
      console.error("Failed to fetch promo codes", err);
    }
  };

  const fetchSummary = async () => {
    try {
      setError(null);

      // If no products, return a default empty summary (prevents "stuck loading")
      if (!products || products.length === 0) {
        setSummary({
          products: [],
          itemTotal: 0,
          promoDiscount: 0,
          deliveryCharges: 0,
          totalAmount: 0,
          finalAmount: 0,
          addresses: [],
          promorError: null
        });
        return;
      }

      const payload = {
        promocode,
        products: products && products.length > 0 ? products : null,
        addressId: selectedAddressId || null,
      };

      const { data } = await axios.post("/api/secure/checkout", payload, {
        withCredentials: true,
      });

      if (!data) {
        setError("Checkout service returned no data");
        return;
      }

      setSummary(data);
      setPromoError(data.promoError)
      setPromoMessage(data.promoMessage)


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

      const userAddresses = data.user?.addresses || [];
      setAddresses(userAddresses);
      if (userAddresses.length) {
        setSelectedAddressId((prev) => prev || userAddresses[0]._id || "");
      }
      // prefill phone and name correctly
      if (data.user?.phone) setPhone(data.user.phone);
      if (data.user?.name) setName(data.user.name);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const addNewAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.country || !newAddress.pincode) {
      alert("Please fill all address fields.");
      return;
    }

    if (session?.user?.id) {
      try {
        // console.log(newAddress);
        await axios.post(
          "/api/secure/userProfile",
          { userId: session.user.id, address: newAddress },
          { withCredentials: true }
        );
        await fetchAddresses();
        setShowNewAddressForm(false);
        setNewAddress({ label: "Home", address: "", city: "", state: "", country: "", pincode: "" });
      } catch (err) {
        console.error("Failed to add address", err);
        alert("Could not add address. Try again.");
      }
      return;
    }

    // guest: keep new address in state and close form
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

      // persist guest changes to localStorage
      try {
        if (!session?.user && typeof window !== "undefined") {
          localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
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
        (p) => p.productId === productId && (p.variantId ?? null) === (variantId ?? null)
      );
      if (productIndex === -1) return prev;
      const updatedSummary = { ...prev };
      const newProducts = [...prev.products];
      const current = newProducts[productIndex];
      const newQty = Math.max(1, Math.min(5, current.quantity + change));
      if (newQty === current.quantity) return prev;
      newProducts[productIndex] = { ...current, quantity: newQty };
      updatedSummary.products = newProducts;
      // Optionally recompute amounts here or re-fetch summary from server
      return updatedSummary;
    });
  };

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
            state: newAddress.state,
            country: newAddress.country,
            pincode: newAddress.pincode,
          },
        },
        { withCredentials: true }
      );

      const guestUser = data?.user ?? null;

      if (guestUser && typeof window !== "undefined") {
        localStorage.setItem(
          "guest_user",
          JSON.stringify({
            id: guestUser._id ?? guestUser.id,
            name: guestUser.name,
            phone: guestUser.phone,
          })
        );
      }

      // signIn with the returned guest id to give them a short-lived session (backend required)
      await signIn("credentials", {
        redirect: false,
        userId: guestUser._id ?? guestUser.id,
      });

      return guestUser;
    } catch (err) {
      console.error("Failed to create guest user", err);
      throw new Error("Could not create guest account");
    }
  };

  const ValidateAndApplyPromo = () => {

    fetchSummary()
  }

  const initiatePayment = async () => {
    if (typeof window === "undefined" || !window.Razorpay) return alert("Payment gateway not ready yet.");
    if (!razorpayLoaded) return alert("Payment gateway not ready");
    if (!phone || phone.trim().length < 6) return alert("Please enter a valid phone number.");
    if (!name || name.trim().length < 2) return alert("Please enter a name.");
    if (products.length === 0) return alert("Your cart is empty.");

    // prepare delivery address data
    let deliveryAddressPayload = null;
    if (session?.user) {
      const selectedAddr = addresses.find((a) => a._id === selectedAddressId);
      if (!selectedAddr && !showNewAddressForm) {
        return alert("Please select a delivery address or add a new one.");
      }
      if (showNewAddressForm) {
        if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.country || !newAddress.pincode) {
          return alert("Please complete the new address form.");
        }
        deliveryAddressPayload = { ...newAddress };
      } else {
        deliveryAddressPayload = { ...selectedAddr };
      }
    } else {
      // Guest: take address from newAddress form
      if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.country || !newAddress.pincode) {
        return alert("Please fill in your address details for delivery.");
      }
      deliveryAddressPayload = { ...newAddress };
    }

    setLoading(true);

    try {
      // If guest, create a user account first
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

      const options = {
        key: process.env.NEXT_PUBLIC_DEPLOYEMENT_MODE === "development" ? process.env.NEXT_PUBLIC_TEST_RAZORPAY_KEY_ID : process.env.NEXT_PUBLIC_LIVE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Riyora Organic",
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
              if (!session?.user && typeof window !== "undefined") {
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
          contact: phone.trim() || "",
        },
        theme: { color: "#136132" },
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

  if (loading || !summary) return <p className={styles.statusMessage}>Loading checkout...</p>;
  if (error) return <p className={styles.statusMessage}>Error: {error}</p>;

  return (
    <>
      <div className={styles.navHolder}></div>

      <div className={styles.checkout_container}>

        <div className={styles.leftPannel}>
          <h1 className={styles.checkout_head}>Checkout</h1>

          {/* Account label */}
          <div style={{ marginBottom: 12 }}>
            {session?.user ? (
              <div className={styles.accountLabel}>
                <strong>Logged in as:</strong> {session.user.name} ({session.user.email || "no email"})
              </div>
            ) : (
              <div className={styles.accountLabel}>
                <strong>Guest Checkout</strong> — an account will be created automatically with the phone number you provide.
              </div>
            )}
          </div>



          {/* Product List */}
          <section className={styles.productList}>
            {summary.products && summary.products.length > 0 ? (
              summary.products.map((p) => {
                const productState = products.find((prod) => {
                  const sameProduct = prod.productId === p.productId;
                  const prodVariant = prod.variantId ?? null;
                  const pVariant = p.variantId ?? null;
                  const sameVariant = prodVariant === pVariant;
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
                          aria-label={`Decrease quantity for ${p.name}`}
                        >
                          −
                        </button>
                        <span className={styles.qtyDisplay}>{productState?.quantity ?? 1}</span>
                        <button
                          onClick={() => updateQuantity(p.productId, p.variantId ?? null, +1)}
                          disabled={!productState || productState?.quantity >= 5}
                          aria-label={`Increase quantity for ${p.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyCart}>Your cart is empty.</div>
            )}
          </section>


          <div className={styles.customer_info_section}>

            {/* customer name */}

            <div className={styles.name_section}>
              <label className={styles.label}>Full name (required)</label>
              <input
                type="text"
                placeholder="Recipient name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Phone input (always required) */}
            <div className={styles.phone_section}>
              <label className={styles.label}>Phone number (required)</label>
              <PhoneInput
                country={countryCode}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputProps={{ name: "phone", required: true }}
                containerClass={styles.phoneInput}
              />
            </div>

          </div>
          {/* Address Section */}
          <div className={styles.address_section}>
            <h3 className={styles.sectionTitle}>Delivery address</h3>
            {session?.user ? (
              <>
                <div className={styles.address_list}>
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`${styles.address_card} ${selectedAddressId === addr._id ? styles.active : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                      />

                      <div className={styles.address_icon}>
                        <i className="fa-solid fa-location-dot"></i>
                      </div>

                      <div className={styles.address_info}>
                        <h4>{addr.label}</h4>
                        <p>{addr.address}, {addr.city}, {addr.state}</p>
                        <p>{addr.country} - {addr.pincode}</p>
                        {/* <p>📞 {user.phone}</p> */}
                      </div>
                    </label>
                  ))}
                  <div
                    role="button"
                    className={styles.add_address_btn}
                    onClick={() => setShowNewAddressForm((s) => !s)}
                  >
                    {showNewAddressForm ? "Cancel" : "+ Add New Address"}
                  </div>
                </div>

                {showNewAddressForm && <NewAddressForm
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  onSave={addNewAddress}
                />}
              </>
            )
              :
              (
                <NewAddressForm
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  onSave={null}
                />

              )
            }
          </div>




        </div>

        <div className={styles.rightPannel}>

          {/* Promo Section */}
          <section className={styles.promo_section}>

            <PromoSection
              promocode={promocode}
              setPromocode={setPromocode}
              promoError={promoError}
              promoMessage={promoMessage}
              availablePromos={availablePromos}
              ValidateAndApplyPromo={ValidateAndApplyPromo}
            />
          </section>

          {/* Amount Section */}
          <section className={styles.amount_section}>
            <h2 className={styles.sectionTitle}>Amount breakdown</h2>
            <div className={styles.amountSummary}>
              <div className={styles.row}>
                <span>Item total</span>
                <span>₹{summary.itemTotal ?? 0}</span>
              </div>
              {summary.promoDiscount > 0 && (
                <div className={styles.row}>
                  <span>Promo discount</span>
                  <span>-₹{summary.promoDiscount}</span>
                </div>
              )}
              <div className={styles.row}>
                <span>Delivery</span>
                <span>₹{summary.deliveryCharges ?? 0}</span>
              </div>
              <div className={styles.row}>
                <strong>Total</strong>
                <strong>₹{summary.totalAmount ?? 0}</strong>
              </div>
              {summary.deliveryCharges > 0 && (
                <div className={styles.row}>
                  <span>Free Delivery</span>
                  <span>-₹{summary.deliveryCharges}</span>
                </div>
              )}
              <div className={styles.rowTotal}>
                <strong>Total payable</strong>
                <strong>₹{summary.finalAmount ?? 0}</strong>
              </div>
            </div>
          </section>

          <button onClick={initiatePayment} className={styles.pay_btn}>
            Proceed to pay ₹{summary.finalAmount ?? 0}
          </button>
        </div>
      </div >
    </>
  );
}

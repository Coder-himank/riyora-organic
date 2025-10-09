import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "@/styles/checkout.module.css";

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
    label: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
  });
  const [promocode, setPromocode] = useState("");

  // ✅ NEW STATE: Product list (productId, variantId, quantity)
  const [products, setProducts] = useState([]);

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

    if (!window.Razorpay) loadScript();
    else setRazorpayLoaded(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth?type=login");
  }, [status, router]);

  // 🧩 Initialize products from query (for "Buy Now" or cart)
  useEffect(() => {
    async function fetchProducts() {

      if (!router.isReady || !session) return;
      if (router.query.productId) {
        setProducts([
          {
            productId: router.query.productId,
            variantId: router.query.productId === router.query.variantId ? null : router.query.variantId || null,
            quantity: Number(router.query.quantity_demanded || 1),
          },
        ]);
      }
      else {
        // Fetch cart items from backend if no productId in query
        try {

          const { data } = await axios.get(
            `/api/secure/cart?userId=${session?.user?.id}`,
            { withCredentials: true }
          );

          console.log(data);
          const cartProducts = data.map(item => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity_demanded || 1,
          }));
          setProducts(cartProducts);

        } catch (e) {
          console.log(e);
          setError("Failed to load cart items");
        }
      }
    }

    fetchProducts();
  }, [router.query, router.isReady, session]);

  // Fetch addresses & summary once session & products are ready
  useEffect(() => {
    if (!session || products.length === 0) return;
    (async () => {
      try {
        await fetchAddresses();
        await fetchSummary();
      } catch (e) {
        setError("Failed to initialize checkout");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, products]);

  const fetchSummary = async () => {
    try {
      const payload = {
        promocode,
        products, // ✅ using state
        addressId: selectedAddressId || null,
      };

      const { data } = await axios.post("/api/secure/checkout", payload, {
        withCredentials: true,
      });
      setSummary(data);

      if (!selectedAddressId && data.addresses?.length) {
        setSelectedAddressId(data.addresses[0]._id);
      }
    } catch (error) {
      console.error("Error fetching summary", error);
      setError("Failed to prepare checkout data");
    }
  };

  const fetchAddresses = async () => {
    const { data } = await axios.get(
      `/api/secure/userProfile?userId=${session?.user?.id}`,
      { withCredentials: true }
    );
    setAddresses(data.addresses || []);
    if (data.addresses?.length) {
      setSelectedAddressId(data.addresses[0]._id || "");
    }
  };

  const addNewAddress = async () => {
    if (
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.country ||
      !newAddress.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }
    await axios.post(
      "/api/secure/userProfile",
      { userId: session?.user?.id, address: newAddress },
      { withCredentials: true }
    );
    await fetchAddresses();
    setShowNewAddressForm(false);
    setNewAddress({ label: "", address: "", city: "", country: "", pincode: "" });
  };

  const updateQuantity = (productId, variantId, change) => {
    setProducts((prev) => {
      const index = prev.findIndex(
        (p) =>
          p.productId === productId &&
          (variantId ? p.variantId === variantId : !p.variantId || p.variantId === p.productId)
      );

      if (index === -1) return prev; // product not found

      const updated = [...prev];
      const item = updated[index];
      const newQty = Math.max(1, Math.min(5, item.quantity + change)); // clamp between 1 and 5

      // if quantity didn't change, no need to update (prevents extra re-render)
      if (newQty === item.quantity) return prev;

      updated[index] = { ...item, quantity: newQty };
      return updated;
    });

    // ✅ Keep summary in sync — only update the matched product
    setSummary((prev) => {
      const productIndex = prev.products.findIndex(
        (p) => p.productId === productId && p.variantId === variantId
      );
      if (productIndex === -1) return prev;

      const updatedSummary = { ...prev };
      const newProducts = [...prev.products];
      const current = newProducts[productIndex];
      const newQty = Math.max(1, Math.min(5, current.quantity + change)); // same clamping logic

      if (newQty === current.quantity) return prev; // skip update if no change

      newProducts[productIndex] = { ...current, quantity: newQty };
      updatedSummary.products = newProducts;
      return updatedSummary;
    });
  };


  const initiatePayment = async () => {
    if (!window.Razorpay) {
      alert("Payment gateway not ready yet. Please wait a second and try again.");
      return;
    }

    if (!selectedAddressId) return alert("Please select a delivery address");
    if (!razorpayLoaded) return alert("Payment gateway not ready");

    try {
      const selectedAddr = addresses.find((addr) => addr._id === selectedAddressId);
      if (!selectedAddr) return alert("Selected address not found");

      const deliveryPayload = {
        name: session?.user?.name,
        phone: session?.user?.phone,
        email: session?.user?.email,
        ...selectedAddr,
      };

      const { data: order } = await axios.post(
        "/api/razorpay/create-order",
        { promocode, deliveryAddress: deliveryPayload, products }, // ✅ using products array
        { withCredentials: true }
      );

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
            };
            const { data: verify } = await axios.post(
              "/api/razorpay/verify-payment",
              verifyPayload,
              { withCredentials: true }
            );

            if (verify?.status === "success") {
              router.push(`/${session?.user?.id}/order-success?orderId=${response.razorpay_order_id}`);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert("Payment verification error");
            console.error(err);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          phone: session?.user?.phone || "",
        },
        theme: { color: "#0ea5e9" },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Could not start payment. Please try again.");
    }
  };

  if (loading || !summary) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="navHolder"></div>
      <div className={styles.checkout_container}>
        <h1 className={styles.checkout_head}>Checkout</h1>

        <section className={styles.productList}>
          {summary.products.map((p) => {
            const productState = products.find((prod) => {
              const sameProduct = prod.productId === p.productId;
              const sameVariant =
                p.variantId
                  ? p.variantId === (prod.variantId || prod.productId)
                  : prod.variantId === null || prod.variantId === prod.productId;
              return sameProduct && sameVariant;
            });



            console.log(p);
            console.log(products);

            return (
              <div key={`${p.productId}-${p.variantId || "default"}`} className={styles.product}>
                <img src={p.imageUrl} alt={p.name} />
                <div>
                  <h3>{p.name}</h3>
                  {p.variantName && <p>Variant: {p.variantName}</p>}
                  <p>Price: ₹{p.price}</p>
                  <div className={styles.quantity_setter}>
                    <button
                      onClick={() => {

                        updateQuantity(p.productId, p.variantId || null, -1)

                      }
                      }
                    disabled={productState?.quantity <= 1}
                    >
                      -
                    </button>
                    <p>{productState?.quantity || "hsad"}</p>
                    <button
                      onClick={() =>
                        updateQuantity(p.productId, p.variantId || null, +1)
                      }
                      disabled={productState?.quantity >= 5}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className={styles.address_section}>
          <h3>Select Delivery Address</h3>
          <div className={styles.address_section_in}>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            >
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.label} - {addr.address}, {addr.city}, {addr.country},{" "}
                  {addr.pincode}
                </option>
              ))}
            </select>
            <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
              {showNewAddressForm ? "-" : "+"}
            </button>
          </div>
        </div>

        {showNewAddressForm && (
          <div className={styles.new_address_form}>

            <div className={styles.addressLabels}>
              <span
                className={newAddress.label === "Home" ? styles.active : ""}
                onClick={() => setNewAddress({ ...newAddress, label: "Home" })}
              >Home</span>
              <span
                className={newAddress.label === "Office" ? styles.active : ""}
                onClick={() => setNewAddress({ ...newAddress, label: "Office" })}
              >office</span>
              <span
                className={newAddress.label === "Other" ? styles.active : ""}
                onClick={() => setNewAddress({ ...newAddress, label: "Other" })}
              >other</span>
            </div>
            <input
              type="text"
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />
            <button onClick={addNewAddress}>Add Address</button>
          </div>
        )}

        <section className={styles.promo_section}>
          <input
            type="text"
            placeholder="Promo Code"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value.trim())}
          />
          <button onClick={fetchSummary}>Apply</button>
        </section>

        <section className={styles.amount_section}>
          <h2>Amount Break Down</h2>
          <span>
            <strong>Amount</strong>: ₹{summary.beforeTaxAmount}
          </span>
          <span>
            <strong>Discount</strong>: ₹{summary.discount}
          </span>
          <span>
            <strong>Taxes</strong>: ₹{summary.taxedAmount}
          </span>
          <span>
            <strong>Delivery Charges</strong>: ₹{summary.deliveryCharges}
          </span>
          <span>
            <strong>Total</strong>: ₹{summary.finalAmount}
          </span>
        </section>

        <button onClick={initiatePayment} className={styles.pay_btn}>
          Proceed To Pay
        </button>
      </div>
    </>
  );
}

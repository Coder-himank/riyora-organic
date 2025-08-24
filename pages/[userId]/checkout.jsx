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

  const [summary, setSummary] = useState(null);        // server-calculated summary
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "", city: "", country: "", pincode: "" });
  const [promocode, setPromocode] = useState("");

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

    if (!window.Razorpay) {
      loadScript();
    } else {
      setRazorpayLoaded(true);
    }
  }, []);


  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth?type=login");
  }, [status, router]);

  // Fetch summary & addresses after session available
  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        await fetchAddresses();
        await fetchSummary(); // initial summary
      } catch (e) {
        setError("Failed to initialize checkout");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchSummary = async () => {
    /**
     * We only send minimal data: either
     * - cart on the server (implicit), or
     * - immediate buy via query (?productId, ?quantity_demanded)
     */
    const payload = {
      promocode,
      products: router.query.productId
        ? [{ productId: router.query.productId, quantity: Number(router.query.quantity_demanded || 1) }]
        : null,
      addressId: selectedAddressId || null,
    };

    const { data } = await axios.post("/api/secure/checkout", payload, { withCredentials: true });
    setSummary(data); // contains products & server-calculated amounts
    // Set default addressId if available
    if (!selectedAddressId && data.addresses?.length) {
      setSelectedAddressId(data.addresses[0]._id);
    }
  };

  const fetchAddresses = async () => {
    // You already have this API; ensure it returns address _id for each address
    const { data } = await axios.get(`/api/secure/userProfile?userId=${session?.user?.id}`, { withCredentials: true });
    setAddresses(data.addresses || []);
    if (data.addresses?.length) {
      setSelectedAddressId(data.addresses[0]._id || "");
    }
  };

  const addNewAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
      alert("Please fill all address fields");
      return;
    }
    await axios.post("/api/secure/userProfile", { userId: session?.user?.id, address: newAddress }, { withCredentials: true });
    await fetchAddresses();
    setShowNewAddressForm(false);
    setNewAddress({ label: "", address: "", city: "", country: "", pincode: "" });
  };

  const initiatePayment = async () => {
    if (!window.Razorpay) {
      alert("Payment gateway not ready yet. Please wait a second and try again.");
      return;
    }

    if (!selectedAddressId) return alert("Please select a delivery address");

    if (!razorpayLoaded) return alert("Payment gateway not ready");

    try {
      // Ask server to create order. It will re-calc totals from DB and apply promo safely.

    const selectedAddr = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddr) return alert("Selected address not found");

    const { _id, label, address, city, country, pincode } = selectedAddr;


    const deliveryPayload = {
      name: session?.user?.name,
      phone: session?.user?.phone,
      email: session?.user?.email,
      label,
      address,
      city,
      
      country,
      pincode
    };
      if (!deliveryPayload) return alert("Selected address not found");
      const { data: order } = await axios.post(
        "/api/razorpay/create-order",
        {
          promocode,
          deliveryAddress : deliveryPayload,
          products: router.query.productId
            ? [{ productId: router.query.productId, quantity: Number(router.query.quantity_demanded || 1) }]
            : null,
        },
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
            const { data: verify } = await axios.post("/api/razorpay/verify-payment", verifyPayload, { withCredentials: true });

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
          {summary.products.map((p) => (
            <div key={p.productId} className={styles.product}>
              <img src={p.imageUrl} alt={p.name} />
              <div>
                <h3>{p.name}</h3>
                <p>Price: ₹{p.price}</p>
                <p>Quantity: {p.quantity}</p>
              </div>
            </div>
          ))}
        </section>

        <div className={styles.address_section}>
          <h3>Select Delivery Address</h3>
          <div className={styles.address_section_in}>
            <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.label} - {addr.address}, {addr.city}, {addr.country}, {addr.pincode}
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
            <input type="text" placeholder="Label" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            <input type="text" placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
            <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
            <button onClick={addNewAddress}>Add Address</button>
          </div>
        )}

        <section className={styles.promo_section}>
          <input type="text" placeholder="Promo Code" value={promocode} onChange={(e) => setPromocode(e.target.value.trim())} />
          <button onClick={fetchSummary}>Apply</button>
        </section>

        <section className={styles.amount_section}>
          <h2>Amount Break Down</h2>
          <span><strong>Amount</strong>: ₹{summary.beforeTaxAmount}</span>
          <span><strong>Discount</strong>: ₹{summary.discount}</span>
          <span><strong>Taxes</strong>: ₹{summary.taxedAmount}</span>
          <span><strong>Delivery Charges</strong>: ₹{summary.deliveryCharges}</span>
          <span><strong>Total</strong>: ₹{summary.finalAmount}</span>
        </section>

        <button onClick={initiatePayment} className={styles.pay_btn}>Proceed To Pay</button>
      </div>
    </>
  );
}

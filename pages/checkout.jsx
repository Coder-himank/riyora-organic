import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/react";
import "@/styles/checkout.module.css";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";

export default function Checkout() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { productId } = router.query;
  const { data: session } = useSession();

  const [amount, setAmount] = useState(0.0);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    address: "",
    city: "",
    country: "",
    pincode: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      createOrder();
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`/api/userProfile?userId=${session.user.id}`);
      setAddresses(data.addresses);
      setSelectedAddress(data.addresses[0] || null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/create-order", {
        userId: session.user.id,
        products: productId ? [{ productId, quantity_demanded: 1 }] : null,
      });
      setOrderId(data.orderId);
      setAmount(data.amount);
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error creating order:", error);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      await axios.put(`/api/orders?orderId=${orderId}`, {
        paymentStatus: "paid",
        paymentType: "online",
        paymentDetails: {
          transactionId: response.razorpay_payment_id,
          paymentGateway: "Razorpay",
          paymentDate: new Date().toISOString(),
        },
        shippingAddress: selectedAddress,
      });

      router.push({ pathname: `/order-success`, query: { orderId: response.razorpay_order_id } });
    } catch (error) {
      console.error("Error updating order after payment:", error);
    }
  };

  const initiatePayment = async () => {
    if (!orderId) return console.error("No Order ID Generated");
    if (!razorpayLoaded) return alert("Razorpay script not loaded. Please try again later.");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      order_id: orderId,
      handler: handlePaymentSuccess,
      prefill: {
        name: session?.user?.name || "User",
        email: session?.user?.email || "",
        contact: session?.user?.phone || "",
      },
      theme: { color: "#F37254" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const addNewAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
      alert("Please fill all address fields.");
      return;
    }

    try {
      await axios.post(`/api/userProfile`, {
        userId: session.user.id,
        address: newAddress,
      });
      fetchAddresses();
      alert("Address added successfully!");
      setShowNewAddressForm(false);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <div className="checkout-container">


      {!session && !session?.user ? (
        <>
          <center><h2>Login To Continue</h2></center>
          <UnAuthorizedUser />
        </>
      ) : <>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h1 className="checkout-head">{t("checkout")}</h1>
            <p><strong>Total</strong>: ₹{amount}</p>
            <h3>Select Delivery Address</h3>
            <div className="address-section">
              {addresses.length > 0 ? (
                <select className="select-address" onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}>
                  {addresses.map((addr, index) => (
                    <option key={index} value={JSON.stringify(addr)}>
                      {addr.label} - {addr.address}, {addr.city}, {addr.country}, {addr.pincode}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No saved addresses. Add a new one below.</p>
              )}
              <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                {showNewAddressForm ? "Cancel" : "New Address"}
              </button>
            </div>


            {showNewAddressForm && (
              <div className="new-address-form">
                <h3>Add New Address</h3>
                <input type="text" placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                <button onClick={addNewAddress}>Add Address</button>
              </div>
            )}

            <button onClick={initiatePayment} className="pay-btn">Pay with Razorpay</button>
          </>
        )}
      </>
      }
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}

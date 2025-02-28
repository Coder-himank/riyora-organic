import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/react";
import styles from "@/styles/checkout.module.css";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";

export default function Checkout() {
  const { t } = useTranslation("checkout");
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
    label: t("home"),
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
    if (!session?.user?.id) return;
    if (!orderId) createOrder();
    fetchAddresses();
  }, [session?.user?.id, orderId]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`/api/userProfile?userId=${session.user.id}`);
      setAddresses(data.addresses);
      if (!selectedAddress && data.addresses.length > 0) {
        setSelectedAddress(data.addresses[0]);
      }
    } catch (error) {
      console.error(t("error_fetching_addresses"), error);
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
      console.error(t("error_creating_order"), error);
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
      console.error(t("error_payment_update"), error);
    }
  };

  const initiatePayment = async () => {
    if (!orderId) return alert(t("order_id_missing"));
    if (!razorpayLoaded) return alert(t("razorpay_not_loaded"));

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key",
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
      razorpay.on("payment.failed", function (response) {
        alert(t("payment_failed"));
        console.error(response.error);
      });

      razorpay.open();
    } catch (error) {
      console.error(t("error_initiating_payment"), error);
      alert(t("payment_error"));
    }
  };

  const addNewAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
      alert(t("fill_all_address_fields"));
      return;
    }

    try {
      await axios.post(`/api/userProfile`, {
        userId: session.user.id,
        address: newAddress,
      });
      fetchAddresses();
      alert(t("address_added_successfully"));
      setShowNewAddressForm(false);
    } catch (error) {
      console.error(t("error_adding_address"), error);
    }
  };

  return (
    <div className={styles.checkout_container}>
      <div className="navHolder"></div>

      {!session && !session?.user ? (
        <>
          <center><h2>{t("login_to_continue")}</h2></center>
          <UnAuthorizedUser />
        </>
      ) : (
        <>
          {loading ? (
            <p>{t("loading")}</p>
          ) : (
            <>
              <h1 className={styles.checkout_head}>{t("checkout")}</h1>
              <p className={styles.price}><strong>{t("total")}</strong>: ₹{amount}</p>
              <h3>{t("select_delivery_address")}</h3>
              <div className={styles.address_section}>
                {addresses.length > 0 ? (
                  <select
                    className={styles.select_address}
                    onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}
                  >
                    {addresses.map((addr, index) => (
                      <option key={index} value={JSON.stringify(addr)}>
                        {addr.label} - {addr.address}, {addr.city}, {addr.country}, {addr.pincode}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{t("no_saved_addresses")}</p>
                )}
                <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                  {showNewAddressForm ? t("cancel") : t("new_address")}
                </button>
              </div>

              {showNewAddressForm && (
                <div className={styles.new_address_form}>
                  <h3>{t("add_new_address")}</h3>
                  <input type="text" placeholder={t("address")} value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                  <input type="text" placeholder={t("city")} value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <input type="text" placeholder={t("country")} value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                  <input type="text" placeholder={t("pincode")} value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                  <button onClick={addNewAddress}>{t("add_address")}</button>
                </div>
              )}

              <button onClick={initiatePayment} className={styles.pay_btn}>{t("pay_with_razorpay")}</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["checkout"])) } };
}

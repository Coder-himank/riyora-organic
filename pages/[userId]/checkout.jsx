// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
// import styles from "@/styles/checkout.module.css";

// export default function Checkout() {
//   const router = useRouter();
//   const { userId, productId, quantity_demanded } = router.query;
//   const { data: session } = useSession();

//   const [orderId, setOrderId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [checkOutData, setCheckOutData] = useState(null);

//   const [error, setError] = useState(null);

//   const [promocode, setPromocode] = useState(null);

//   const [addresses, setAddresses] = useState(null);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showNewAddressForm, setShowNewAddressForm] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     label: "",
//     address: "",
//     city: "",
//     country: "",
//     pincode: "",
//   });

//   useEffect(() => {
//     if (typeof window !== "undefined" && !window.Razorpay) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => setRazorpayLoaded(true);
//       document.body.appendChild(script);
//     } else {
//       setRazorpayLoaded(true);
//     }
//   }, []);


//   const fetchCheckoutData = async (createOrder = false) => {
//     try {
//       let products = null;
//       if (productId) {
//         products = [{ productId, quantity_demanded }];
//       }

//       const { data } = await axios.post(`/api/secure/checkout`, {
//         userId,
//         products,
//         promocode,
//         createOrder,
//       });
//       setError(null);
//       setCheckOutData(data);
//       return data;
//     } catch (error) {
//       setCheckOutData(null);
//       setError("Error Fetching Checkout Data");
//       console.error("Error Fetching Checkout Data", error);
//     }

//     return false;
//   }
//   useEffect(() => {
//     if (session && userId) {
//       (async () => {
//         await fetchCheckoutData();
//         await fetchAddresses();
//         setLoading(false);
//       })();
//     }
//   }, [session, userId]);


//   const fetchAddresses = async () => {
//     try {
//       const { data } = await axios.get(`/api/secure/userProfile?userId=${userId}`);
//       setAddresses(data.addresses);
//       if (!selectedAddress && data.addresses.length > 0) {
//         setSelectedAddress(data.addresses[0]);
//       }
//     } catch (error) {
//       console.error("Error Fetching Data", error);
//       setError("Error Fetching Addresses");
//     }
//   };


//   const createOrder = async () => {
//     try {

//       console.log(orderId, "orderId");


//       const checkoutData = await fetchCheckoutData();
//       if (!checkoutData) {
//         setLoading(false);
//         return;
//       }

//       const data = await fetchCheckoutData(true);
//       setOrderId(data.orderId);
//       setCheckOutData(data);
//       initiatePayment(data)
//     } catch (error) {
//       console.error("Error Fetching Order", error);
//     }
//   };

//   const handlePaymentSuccess = async (response) => {
//     console.log(response, "response");
//     try {
//       await axios.put(`/api/secure/orders?orderId=${response.razorpay_order_id}`, {
//         paymentStatus: "paid",
//         paymentType: "online",
//         paymentDetails: {
//           transactionId: response.razorpay_payment_id,
//           paymentGateway: "Razorpay",
//           paymentDate: new Date().toISOString(),
//         },
//         shippingAddress: selectedAddress,
//       });

//       router.push({ pathname: `/${userId}/order-success`, query: { orderId: response.razorpay_order_id } });
//     } catch (error) {
//       console.error("Payment Update Error", error);
//     }
//   };

//   const initiatePayment = async (checkData) => {
//     console.log(checkData);
//     if (!checkData.orderId) return alert("Order ID not found");
//     if (!razorpayLoaded) return alert("Razorpay SDK not loaded");

//     try {
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: parseInt(checkData.finalAmount * 100),
//         currency: "INR",
//         order_id: checkData.orderId,
//         handler: handlePaymentSuccess,
//         prefill: {
//           name: session?.user?.name || "User",
//           email: session?.user?.email || "",
//           contact: session?.user?.phone || "",
//         },
//         theme: { color: "#F37254" },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.on("payment.failed", function (response) {
//         alert("Payment Failed");
//         console.error(response.error);
//       });

//       razorpay.open();
//     } catch (error) {
//       console.error("Error Initiating Payment", error);
//       alert("Payment Error");
//     }
//   };

//   const addNewAddress = async () => {
//     if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
//       alert("Fill all Address Fields");
//       return;
//     }

//     try {
//       await axios.post(`/api/secure/userProfile`, {
//         userId,
//         address: newAddress,
//       });
//       fetchAddresses();
//       alert("Address Added Successfully");
//       setShowNewAddressForm(false);
//     } catch (error) {
//       console.error("Address Not Added", error);
//     }
//   };

//   return (
//     <div className={styles.checkout_container}>
//       <div className="navHolder"></div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h1 className={styles.checkout_head}>Checkout</h1>
//           <section className={styles.productList}>
//             {checkOutData.products.map((product, index) => (
//               <div key={index} className={styles.product}>
//                 <img src={product.imageUrl} alt={product.name} />
//                 <div>
//                   <h3>{product.name}</h3>
//                   <p>Price: ₹{product.price}</p>
//                   <p>Quantity: {product.quantity_demanded}</p>
//                 </div>
//               </div>
//             ))}
//           </section>

//           <div className={styles.address_section}>
//             <h3>Select Delivery Address</h3>
//             <section className={styles.address_section_in}>

//               {addresses.length > 0 ? (
//                 <select
//                   className={styles.select_address}
//                   onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}
//                 >
//                   {addresses.map((addr, index) => (
//                     <option key={index} value={JSON.stringify(addr)}>
//                       {addr.label} - {addr.address}, {addr.city}, {addr.country}, {addr.pincode}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <p>No Saved Addresses</p>
//               )}
//               <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
//                 {showNewAddressForm ? "-" : "+"}
//               </button>
//             </section>
//           </div>

//           {showNewAddressForm && (
//             <div className={styles.new_address_form}>
//               <h3>Add New Address</h3>
//               <input type="text" placeholder="Label" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
//               <input type="text" placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
//               <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
//               <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
//               <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
//               <button onClick={addNewAddress}>Add Address</button>
//             </div>
//           )}

//           <section className={styles.promo_section}>

//             <input type="text" placeholder="Promo Code" value={promocode} onChange={(e) => setPromocode(e.target.value)} />
//             <button onClick={fetchCheckoutData}>Apply</button>
//           </section>

//           <section className={styles.amount_section}>
//             <h2>Amount Break Down</h2>
//             <span><strong>Amount</strong> {checkOutData.beforeTaxAmount}</span>
//             <span><strong>Discount</strong> {checkOutData.discount}</span>
//             <span><strong>Taxes</strong> {checkOutData.taxedAmount}</span>
//             <span><strong>Delivery Charges</strong> {checkOutData.deliveryCharges}</span>
//             <span><strong>Total</strong> {checkOutData.finalAmount}</span>
//           </section>

//           <button onClick={createOrder} className={styles.pay_btn}>Proceed To Pay</button>
//         </>
//       )}

//     </div>

//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "@/styles/checkout.module.css";

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();

  const [checkOutData, setCheckOutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "", city: "", country: "", pincode: "" });
  const [promocode, setPromocode] = useState("");
  const [error, setError] = useState(null);

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
    if (session) {
      fetchCheckoutData();
      fetchAddresses();
    }
  }, [session]);

  const fetchCheckoutData = async () => {
    try {
      const { data } = await axios.post("/api/secure/checkout", {
        userId: session?.user?.id,
        promocode,
        products: router.query.productId ? [{ productId: router.query.productId, quantity_demanded: router.query.quantity_demanded }] : null,
      });
      console.log("sent");

      setCheckOutData(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Failed to fetch checkout data");
      console.error(err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`/api/secure/userProfile?userId=${session?.user?.id}`);
      setAddresses(data.addresses);
      if (data.addresses.length > 0) {
        setSelectedAddress(data.addresses[0]);
      }
    } catch (err) {
      setError("Failed to fetch addresses");
      console.error(err);
    }
  };

  const initiatePayment = async () => {
    if (!selectedAddress) return alert("Please select a delivery address");
    try {

      const checkOutFinalData = await fetchCheckoutData();
      const orderPayload = {
        amount: checkOutFinalData.finalAmount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: await session.user.id,
          products: checkOutFinalData.products,
          amountBreakDown: {
            subtotal: checkOutFinalData.beforeTaxAmount,
            shipping: checkOutFinalData.deliveryCharges,
            tax: checkOutFinalData.taxedAmount,
            total: checkOutFinalData.finalAmount,
            discount: checkOutFinalData.discount,
          },
          address: {
            label: selectedAddress.label,
            address: selectedAddress.address,
            city: selectedAddress.city,
            country: selectedAddress.country,
            pincode: selectedAddress.pincode,
          },
          promocode: promocode,
        }
      };

      const { data: order } = await axios.post("/api/razorpay/create-order", orderPayload);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const { data: verify } = await axios.post("/api/razorpay/verify-payment", verifyPayload);

            if (verify.status === "Payment verified successfully") {
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
          email: session?.user?.email || "",
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
    }
  };

  const addNewAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.country || !newAddress.pincode) {
      alert("Please fill all address fields");
      return;
    }
    try {
      await axios.post("/api/secure/userProfile", {
        userId: session?.user?.id,
        address: newAddress,
      });
      fetchAddresses();
      setShowNewAddressForm(false);
    } catch (err) {
      console.error("Error adding new address", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="navHolder"></div>
      <div className={styles.checkout_container}>
        <h1 className={styles.checkout_head}>Checkout</h1>
        <section className={styles.productList}>
          {checkOutData.products.map((product, index) => (
            <div key={index} className={styles.product}>
              <img src={product.imageUrl} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            </div>
          ))}
        </section>

        <div className={styles.address_section}>
          <h3>Select Delivery Address</h3>
          <div className={styles.address_section_in}>

            <select onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}>
              {addresses.map((addr, index) => (
                <option key={index} value={JSON.stringify(addr)}>
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
          <input type="text" placeholder="Promo Code" value={promocode} onChange={(e) => setPromocode(e.target.value)} />
          <button onClick={fetchCheckoutData}>Apply</button>
        </section>

        <section className={styles.amount_section}>
          <h2>Amount Break Down</h2>
          <span><strong>Amount</strong>: ₹{checkOutData.beforeTaxAmount}</span>
          <span><strong>Discount</strong>: ₹{checkOutData.discount}</span>
          <span><strong>Taxes</strong>: ₹{checkOutData.taxedAmount}</span>
          <span><strong>Delivery Charges</strong>: ₹{checkOutData.deliveryCharges}</span>
          <span><strong>Total</strong>: ₹{checkOutData.finalAmount}</span>
        </section>

        <button onClick={initiatePayment} className={styles.pay_btn}>Proceed To Pay</button>
      </div>
    </>
  );
}

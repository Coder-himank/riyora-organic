import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Fetch order by userId and orderId (assuming orderId is in query)
const fetchOrder = async (userId, orderId) => {
    try {
        const res = await axios.get(`/api/secure/orders?orderId=${orderId}&userId=${userId}`);
        if (res.status !== 200) throw new Error("Failed to fetch order");
        return res.data.orderDetails[0];
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Unknown error");
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateStr));
};

const OrderDetail = () => {
    const router = useRouter();
    const { userId, orderId } = router.query;
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (router.isReady && userId && orderId) {
            fetchOrder(userId, orderId)
                .then((data) => {
                    console.log(data);
                    setOrder(data);
                })
                .catch((e) => setError(e.message));
        }
    }, [router.isReady, userId, orderId]);

    if (error) return <div>Error: {error}</div>;
    if (!order) return <div>Loading...</div>;

    return (
        <div>
            <h1>Order Detail</h1>
            <div><strong>Order ID:</strong> {order._id}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
            <div>
                <strong>Payment Details:</strong>
                <pre>{JSON.stringify(order.paymentDetails || {}, null, 2)}</pre>
            </div>
            <div><strong>Promo Code:</strong> {order.promoCode || "None"}</div>
            <div><strong>Amount:</strong> {order.amount} {order.currency}</div>
            <div>
                <strong>Amount Breakdown:</strong>
                <pre>{JSON.stringify(order.amountBreakDown || {}, null, 2)}</pre>
            </div>
            <div>
                <strong>Address:</strong>
                <pre>{JSON.stringify(order.address || {}, null, 2)}</pre>
            </div>
            <div><strong>Placed On:</strong> {formatDate(order.placedOn)}</div>
            <div><strong>Expected Delivery:</strong> {formatDate(order.expectedDelivery)}</div>
            <div><strong>Delivered On:</strong> {order.deliveredOn ? formatDate(order.deliveredOn) : "Not delivered"}</div>
            <div><strong>Cancelled On:</strong> {order.cancelledOn ? formatDate(order.cancelledOn) : "Not cancelled"}</div>

            <div>
                <strong>Products:</strong>
                {order.products?.length ? (
                    <ul>
                        {order.products.map((p) => (
                            <li key={p.productId}>
                                <div>Product ID: {p.productId}</div>
                                <div>Image URL: {p.imageUrl}</div>
                                <div>Quantity: {p.quantity}</div>
                                <div>Price: {p.price}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>No products found.</div>
                )}
            </div>

            <div>
                <strong>Order History:</strong>
                {order.orderHistory?.length ? (
                    <ul>
                        {order.orderHistory.map((h, idx) => (
                            <li key={idx}>
                                <div>Status: {h.status}</div>
                                <div>Date: {formatDate(h.date)}</div>
                                <div>Note: {h.note}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>No order history available.</div>
                )}
            </div>

            <div><strong>Updated At:</strong> {formatDate(order.updatedAt)}</div>
        </div>
    );
};

export default OrderDetail;

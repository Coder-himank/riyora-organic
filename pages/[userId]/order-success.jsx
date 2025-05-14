import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
export default function OrderSuccess() {
    const router = useRouter();
    const { orderId } = router.query;
    const { data: session } = useSession()

    // Redirect user to the track order page after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push({ pathname: `/${session?.user?.id}/track-order`, query: { orderId } });
        }, 5000); // Redirect after 5 seconds

        return () => clearTimeout(timer); // Clear timeout on unmount
    }, [router]);

    return (
        <>
            <div className="navHolder"></div>
            <div className="order-success-container">
                <h1>Order Success</h1>
                <p>Thank you for your order!</p>
                <p>You will be redirected to the track order page shortly.</p>
                <p>Redirecting in 5 seconds...</p>
                {/* You can also display the order details here, if available */}
                {/* Example: */}
                <p>Order ID: {orderId}</p>
            </div>
        </>

    );
}

// components/ProductAction.js
export async function onAddToCart({ router, productId, session, quantity_demanded, variantId = null }) { // modified for variants


    if (!session?.user) {
        router.push({ pathname: `/authenticate`, query: { callback: `/cart`, productId } })
        return
    }

    try {
        const response = await fetch(`/api/secure/cart?userId=${session.user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: session?.user?.id,
                productId,
                quantity: quantity_demanded,
                variantId // added for variants
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user data:", error);
        return { success: false, message: "Request failed" };
    }
}

export async function onAddToWishlist(router, productId, session) {
    if (!session?.user?.id) {
        router.push({ pathname: `/authenticate`, query: { callback: `/wishlist`, productId } })
        return
    }
    try {
        const response = await fetch("/api/secure/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session?.user?.id, productId })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user data:", error);
        return { success: false, message: "Request failed" };
    }
}

export const onBuy = (router, productId, quantity_demanded, session, variantId = null) => { // modified for variants
    router.push({
        pathname: `/checkout`,
        query: { productId, quantity_demanded, variantId } // added for variants
    })
}

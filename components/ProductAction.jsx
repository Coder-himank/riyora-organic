// components/ProductAction.js

// ✅ Save cart to localStorage
function saveCartToLocal(cart) {
    if (typeof window !== "undefined") {
        localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
}

// ✅ Load cart from localStorage
export function loadCartFromLocal() {
    if (typeof window !== "undefined") {
        const cart = localStorage.getItem("guest_cart");
        return cart ? JSON.parse(cart) : [];
    }
    return [];
}

export async function onAddToCart({ router, productId, session, quantity_demanded, variantId = null }) {
    // ✅ If not logged in → store in localStorage
    if (!session?.user) {
        let cart = loadCartFromLocal();

        // console.log(cart);

        const existing = await cart.find(
            item => {
                // console.log(item, productId, variantId);
                return item.productId === productId && item.variantId === variantId
            }
        );

        // console.log(existing);

        if (existing) {
            existing.quantity += quantity_demanded;
            cart = [...cart.filter(item => item.productId !== existing.productId), existing];
        } else {
            cart.push({
                productId,
                quantity_demanded,
                variantId
            });
        }

        saveCartToLocal(cart);
        // console.log("addd " + quantity_demanded + "to data");

        // Push user to login but still store cart
        // router.push({ pathname: `/authenticate`, query: { callback: `/cart`, productId } });
        return { success: true, local: true, message: "Added to local cart" };
    }

    // ✅ Logged-in user → backend API call
    try {
        const response = await fetch(`/api/secure/cart?userId=${session.user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: session?.user?.id,
                productId,
                quantity: quantity_demanded,
                variantId
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
    // if (!session?.user?.id) {
    //     router.push({ pathname: `/authenticate`, query: { callback: `/wishlist`, productId } })
    //     return
    // }

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

export const onBuy = (router, productId, quantity_demanded, session, variantId = null) => {
    router.push({
        pathname: `/checkout`,
        query: {
            productId, quantity_demanded, variantId: variantId ?? null
        }
    })
}

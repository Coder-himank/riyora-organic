/**
 * Replace this with your real promo logic (DB lookups, usage limits, user eligibility, etc.)
 */
export async function validatePromo(code, subtotal, userId) {
    if (!code) return { discountValue: 0 };

    // Example: NEWUSER10 => 10% off, capped at 300
    if (code === "NEWUSER10") {
        const value = Math.min(Math.round(subtotal * 0.1), 300);
        return { discountValue: value };
    }

    // Unknown / expired
    return { discountValue: 0 };
}

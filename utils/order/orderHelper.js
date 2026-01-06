export async function handleOrderAction(orderId, type, options = {}) {
    const apiUrl = `${process.env.EXTERNAL_API_BASE_URL}/orderActionApi`;

    console.log("➡️ Hitting Order Action API");
    console.log("URL:", apiUrl);
    console.log("Payload:", { orderId, type, options });

    if (!process.env.EXTERNAL_API_BASE_URL) {
        throw new Error("❌ EXTERNAL_API_BASE_URL is missing");
    }

    if (!process.env.SERVER_API_SECRET) {
        throw new Error("❌ SERVER_API_SECRET is missing");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-server-secret": process.env.SERVER_API_SECRET,
            },
            body: JSON.stringify({ orderId, type, options }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        console.log("⬅️ Response status:", res.status);

        const rawText = await res.text();
        console.log("⬅️ Raw response:", rawText);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${rawText}`);
        }

        let data;
        try {
            data = JSON.parse(rawText);
        } catch {
            throw new Error("❌ Response is not valid JSON");
        }

        if (!data.ok) {
            throw new Error(data.error || "❌ API returned ok=false");
        }

        console.log("✅ Order action success:", data);
        return data;

    } catch (error) {
        if (error.name === "AbortError") {
            console.error("⏱️ Request timed out");
        } else {
            console.error("🔥 Order action failed:", error.message);
        }
        throw error;
    }
}

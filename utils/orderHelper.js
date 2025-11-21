export async function handleOrderAction(orderId, type, options = {}) {
    const apiUrl = `${process.env.EXTERNAL_API_BASE_URL}/orderAction`;

    try {

        console.log(apiUrl);
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-server-secret": process.env.SERVER_API_SECRET,
            },
            body: JSON.stringify({
                orderId,
                type,
                options,
            }),
        });

        // Check for HTTP-level errors (500, 404, etc.)
        if (!res.ok) {
            const text = await res.text(); 
            throw new Error(`HTTP Error ${res.status}: ${text}`);
        }

        const data = await res.json();

        // Check your API's "ok" field
        if (!data.ok) {
            throw new Error(data.error || "API returned failure");
        }

        return data;

    } catch (error) {
        console.error('Order action failed:', error);
        throw error;
    }
}

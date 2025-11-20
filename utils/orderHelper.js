// this function connects to external api and takes 
// orderId, type (action to perfrom) optioons {(related to the action)}

// import fetch from 'node-fetch';

export async function handleOrderAction(orderId, type, options = {}) {
    const apiUrl = `https://${process.env.EXTERNAL_API_BASE_URL}/api/external/orderAction/`; 
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            orderId,
            type,
            options
        }
    };  
    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Order action failed:', error);
        throw error;
    }   
}
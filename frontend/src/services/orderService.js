const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:53140";

async function request(url, options) {
    const response = await fetch(url, options)
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(body.message || "Request Failed.");
        error.status = response.status;
        throw error;
    }

    return body;
}

const json = (data) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

export async function createOrder({customer, items, paymentMethod}) {
    const result = await request(`${API_BASE_URL}/orders`, json({
        customer, 
        paymentMethod,
        items: items.map((item) => ({ productId: item.id ?? item._id ?? item.productId, quantity: item.quantity}))
    }));

    return result.order;
}

export async function completeMockPayment(id, outcome) {
    return (await request(`${API_BASE_URL}/orders/${encodeURIComponent(id)}/mock-payment`, json({outcome}))).order;
}

export async function confirmCashOnDelivery(id) {
    return (await request(`${API_BASE_URL}/orders/${encodeURIComponent(id)}/confirm-cod`, json({}))).order;
}

export async function fetchOrder(id) {
    return (await request(`${API_BASE_URL}/orders/${encodeURIComponent(id)}`)).order;
}


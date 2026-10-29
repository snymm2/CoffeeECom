const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:53140";

async function request(path, options={}) {
    console.log(options)
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        ...options,
        headers: { ...(options.body ? {"Content-Type": "application/json"} : {}), ...options.headers}
    });

    if (response.status === 204) return null;

    const type = response.headers.get("content-type") || "";
    const data = type.includes("application/json") ? await response.json().catch(() => null) : null;

    if (!response.ok) {
        const error = new Error(data?.message || data?.error || `Request Failed (${response.status})`);
        error.status = response.status;
        throw error;
    }

    return data;
}

const json = (method, data) => ({ method, body: JSON.stringify(data) });

export const authApi = {
    login: (username, password) => request("/auth/login", json("POST", {username, password})),

    me: () => request("/auth/me"),

    logout: () => request("/auth/logout", {method: "POST"})
}

export const productsApi = {
    list: () => request("/products/all"),

    create: (product) => request(`/products/`, json("POST", product)),

    update: (id, product) => request(`/products/${encodeURIComponent(id)}`, json("PUT", product)),

    setActive: (id, isActive) => request(`/products/${encodeURIComponent(id)}/status`, json("PATCH", isActive)),

    remove: (id) => request(`/products/${encodeURIComponent(id)}`, { method: "DELETE"}),
}
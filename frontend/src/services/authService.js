const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:53140";

async function request(path, options={}) {

    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers = {...options.headers};

    if (options.body && !isFormData) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        ...options,
        headers
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

function productFormData(product) {
    const { imageFile, ...productFields } = product;
    const body = new FormData();

    body.append("product", JSON.stringify(productFields));

    if (imageFile) {
        body.append("image", imageFile);
    }

    return body;
}

export const authApi = {
    login: (username, password) => 
        request("/auth/login", {
            method: "POST", 
            body: JSON.stringify({username, password})}),

    me: () => request("/auth/me"),

    logout: () => request("/auth/logout", {method: "POST"})
}

export const productsApi = {
    list: () => request("/products/all"),

    create: (product) => 
        request(`/products/`, {
            method: "POST",
            body: productFormData(product)
        }),

    update: (id, product) => 
        request(`/products/${encodeURIComponent(id)}`, {
            method: "PUT",
            body: productFormData(product)
        }),

    setActive: (id, isActive) => 
        request(`/products/${encodeURIComponent(id)}/status`, {
            method: "PATCH",
            body: JSON.stringify({isActive}),
            headers: {"Content-Type": "application/json"}
        }),

    remove: (id) => request(`/products/${encodeURIComponent(id)}`, { method: "DELETE"}),
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:53140";

export async function fetchProducts({
    category,
    search = '',
    filters = {},
    sort = 'featured',
    page = 1,
    limit = 12
}) {
    const params = new URLSearchParams();

    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());

    params.set('filters', JSON.stringify(filters));
    params.set('sort', sort);
    params.set('page', String(page));
    params.set('limit', String(limit));
    
    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Failed to fetch product (${response.status})`);
    }

    const result = await response.json();

    return {
        ...result,
        data: result.data.map(product => ({
            ...product,
            id: product._id
        }))
    }
}

export async function fetchProductById(id) {
    const response = await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Failed to fetch product (${response.status})`);
    }

    const product = await response.json();

    return {...product, id: product._id}
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:53140";

export function resolveProductImageUrl(imageUrl) {
    if (!imageUrl) {
        return "/storefront/Default_Product_Image.png";
    }

    if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
    }

    return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}
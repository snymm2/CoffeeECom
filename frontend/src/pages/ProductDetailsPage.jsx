import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router';
import { Alert, Badge, Button, Col, Container, Form, Row } from "react-bootstrap";

import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

import { resolveProductImageUrl } from "../helpers/ResolveImageUrl";

import "./ProductDetailsPage.css";


const HIDDEN_FIELDS = new Set([
    "_id",
    "id",
    "sku",
    "name",
    "brand",
    "type",
    "category",
    "price",
    "discountPercent",
    "imageUrl",
    "ratingAvg",
    "ratingTotal",
    "stock",
    "isFeatured",
    "isActive",
]);

function formatLabel(value) {
    return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
}

function formatPrice (price) {
    return `Rs. ${Intl.NumberFormat("en-NP", {maximumFractionDigits: 2}).format(price)}`
}

export default function ProductDetailsPage() {
    const {id} = useParams();
    const {addToCart} = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadProductData() {
            setIsLoading(true);
            setProductData(null);
            setError(null);

            try {
                const result = await fetchProductById(id);

                if (!cancelled) {
                    if (result.isActive) {
                        setProductData(result);
                    } else {
                        setProductData(null);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadProductData();

        return () => {
            cancelled = true;
        }
    }, [id]);

    if (isLoading) {
        return (
            <>
                <Container className="product-details-page py-5">
                    <div className="text-center py-5">
                        Loading Product Data...
                    </div>
                </Container>
            </>
        );
    }

    if (error || !productData) {
        return (
            <>
                <Container className="product-details-page py-5">
                    <Alert variant={error ? "danger" : "warning"}>
                        <Alert.Heading>
                            {error ? "Unable to Load Product Data" : "Product not found" }
                        </Alert.Heading>

                        { error || "This product may no longer be available." }

                        <div className="mt-3">
                            <Button as={Link} to="/shop" variant="dark">
                                Browse Products
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </>
        )
    }

    const discountPercent = productData.discountPercent || 0;
    const currentPrice = Math.round(productData.price * (1 - discountPercent));

    const details = Object.entries(productData).filter(
        ([key, value]) =>
            !HIDDEN_FIELDS.has(key) &&
            value !== undefined &&
            value !== null &&
            value !== ""
    );

    const inStock = Number.isFinite(productData.stock) && productData.stock > 0;

    function handleAddToCart() {
        if (!inStock) return;

        // Store the displayed selling price in the demo cart.
        addToCart({ ...productData, price: currentPrice }, quantity);
        setAdded(true);
    }

    return (
    <>
        <Container className="product-details-page py-4 py-lg-5">
            <nav className="product-breadcrumb mb-4">
                <Link to="/">Home</Link>
                {" / "}
                <Link to="/shop">Shop</Link>
                {" / "}
                <span>{productData.name}</span>
            </nav>

            <Row className="g-4 g-lg-5">
                <Col lg={6}>
                    <div className="product-details-image">
                        <img
                            src={resolveProductImageUrl(productData.imageUrl)}
                            alt={productData.name}
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src =
                                    "/storefront/Default_Product_Image.png";
                            }}
                        />

                        {discountPercent > 0 && (
                            <Badge className="product-details-discount">
                                {Math.round(discountPercent * 100)}% OFF
                            </Badge>
                        )}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="product-details-info">
                        <p className="product-details-category">
                            {productData.category} · {productData.type}
                        </p>

                        <p className="product-details-brand">
                            {productData.brand}
                        </p>

                        <h1>{productData.name}</h1>

                        {Number.isFinite(productData.ratingAvg) && (
                            <p className="product-details-rating">
                                ★ {productData.ratingAvg.toFixed(1)}
                                <span>
                                    {" "}({productData.ratingTotal} ratings)
                                </span>
                            </p>
                        )}

                        <div className="product-details-prices">
                            <strong>{formatPrice(currentPrice)}</strong>

                            {discountPercent > 0 && (
                                <del>
                                    {formatPrice(productData.price)}
                                </del>
                            )}
                        </div>

                        <p className="product-details-stock">
                            {inStock
                                ? productData.stock <= 5
                                    ? `Only ${productData.stock} left in stock`
                                    : "In stock"
                                : "Currently out of stock"}
                        </p>

                        <p className="product-details-description">
                            {productData.description ||
                                `Explore ${productData.name} from ${productData.brand}. See the specifications below for more details.`}
                        </p>

                        <div className="product-purchase-controls">
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max={productData.stock}
                                    value={quantity}
                                    disabled={!inStock}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        if (value === "") {
                                            setQuantity("");
                                            return;
                                        }

                                        const parsed = Number(value);
                                        if (
                                            Number.isInteger(parsed) &&
                                            parsed >= 1 &&
                                            parsed <= productData.stock
                                        ) {
                                            setQuantity(parsed);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!quantity) setQuantity(1);
                                    }}
                                />
                            </Form.Group>

                            <Button
                                variant="dark"
                                className="product-add-to-cart"
                                disabled={
                                    !inStock ||
                                    !Number.isInteger(quantity) ||
                                    quantity < 1 ||
                                    quantity > productData.stock
                                }
                                onClick={handleAddToCart}
                            >
                                {inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>

                            {added && (
                                <Alert
                                    variant="success"
                                    className="mt-3"
                                    dismissible
                                    onClose={() => setAdded(false)}
                                >
                                    Added to your cart.
                                    {" "}
                                    <Link to="/cart">View Cart</Link>
                                </Alert>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {details.length > 0 && (
                <section className="product-specifications mt-5">
                    <h2>Product Details</h2>

                    <Row className="g-0">
                        {details.map(([key, value]) => (
                            <Col
                                xs={12}
                                md={6}
                                key={key}
                                className="product-specification"
                            >
                                <span>{formatLabel(key)}</span>
                                <strong>{formatValue(value)}</strong>
                            </Col>
                        ))}
                    </Row>
                </section>
            )}

            <div className="product-back-link mt-4">
                <Link to="/shop">← Continue shopping</Link>
            </div>
        </Container>
    </>
    )
}
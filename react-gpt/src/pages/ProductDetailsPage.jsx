import { useState } from "react";
import { Link, useParams } from 'react-router';
import { Alert, Badge, Button, Col, Container, Form, Row } from "react-bootstrap";

import products from "../data/coffeeProducts";
import { useCart } from "../context/CartContext";
import "./ProductDetailsPage.css";
import SiteNavbar from "../components/layout/SiteNavbar";


const HIDDEN_FIELDS = new Set([
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

    const product = products.find((item) => item.id === id && item.isActive);

    if (!product) {
        return (
            <>
                <SiteNavbar context="home" />

                <Container className="product-details-page py-5">
                    <Alert variant="warning">
                        <Alert.Heading>Product not found</Alert.Heading>
                        This product may no longer be available.
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

    const discountPercent = product.discountPercent || 0;
    const currentPrice = Math.round(product.price * (1 - discountPercent));

    const details = Object.entries(product).filter(
        ([key, value]) =>
            !HIDDEN_FIELDS.has(key) &&
            value !== undefined &&
            value !== null &&
            value !== ""
    );

    const inStock = Number.isFinite(product.stock) && product.stock > 0;

    function handleAddToCart() {
        if (!inStock) return;

        // Store the displayed selling price in the demo cart.
        addToCart({ ...product, price: currentPrice }, quantity);
        setAdded(true);
    }

    return (
    <>
        <SiteNavbar context="home" />

        <Container className="product-details-page py-4 py-lg-5">
            <nav className="product-breadcrumb mb-4">
                <Link to="/">Home</Link>
                {" / "}
                <Link to="/shop">Shop</Link>
                {" / "}
                <span>{product.name}</span>
            </nav>

            <Row className="g-4 g-lg-5">
                <Col lg={6}>
                    <div className="product-details-image">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
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
                            {product.category} · {product.type}
                        </p>

                        <p className="product-details-brand">
                            {product.brand}
                        </p>

                        <h1>{product.name}</h1>

                        {Number.isFinite(product.ratingAvg) && (
                            <p className="product-details-rating">
                                ★ {product.ratingAvg.toFixed(1)}
                                <span>
                                    {" "}({product.ratingTotal} ratings)
                                </span>
                            </p>
                        )}

                        <div className="product-details-prices">
                            <strong>{formatPrice(currentPrice)}</strong>

                            {discountPercent > 0 && (
                                <del>
                                    {formatPrice(product.price)}
                                </del>
                            )}
                        </div>

                        <p className="product-details-stock">
                            {inStock
                                ? product.stock <= 5
                                    ? `Only ${product.stock} left in stock`
                                    : "In stock"
                                : "Currently out of stock"}
                        </p>

                        <p className="product-details-description">
                            {product.description ||
                                `Explore ${product.name} from ${product.brand}. See the specifications below for more details.`}
                        </p>

                        <div className="product-purchase-controls">
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max={product.stock}
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
                                            parsed <= product.stock
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
                                    quantity > product.stock
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
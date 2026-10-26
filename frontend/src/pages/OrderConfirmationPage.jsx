import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router";
import { Button, Card, Container, Spinner, Table } from "react-bootstrap";
import { fetchOrder } from "../services/orderService";
import SiteNavbar from "../components/layout/SiteNavbar";

import "./OrderConfirmationPage.css"

const formattedAmount = (amount) => {
    return new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 2}).format(Number(amount || 0));
}

const formatStatus = (status = "") => status.replaceAll("_", " ");

export default function OrderConfimationPage() {
    const { orderId } = useParams();
    const location = useLocation();

    const [order, setOrder] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadProductData() {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchOrder(orderId);

                if (!cancelled) {
                    setOrder(result)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Could not Load order.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadProductData();

        return () => {
            cancelled = true;
        }
    }, [orderId]);

    const shopButton = (
        <Button
            as={Link}
            to="/shop/coffee"
            className="order-shop-button">
            
            Continue shopping
            <span aria-hidden="true"> →</span>
        </Button>
    );

    if (loading) {
        return (
            <>
            <SiteNavbar context="home"/>
            <main className="order-page">
                <Container className="order-container">
                    <div className="order-loading">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading Order</span>
                        </Spinner>
                        <p>Preparing Order Summary...</p>
                    </div>
                </Container>
            </main>
            </>
        );
    }

    if (error || !order) {
        return (
        <>
        <SiteNavbar context="home"/>
        <main className="order-page">
            <Container className="order-container">
                <Card className="order-panel">
                    <Card.Body className="order-empty-state">
                        <span className="order-eyebrow">CODE-N-COFFEE / ORDER</span>
                        <h1>We couldn't find your order.</h1>
                        <p>
                            {error || "This order may not exist, or its details are unavailable."}
                        </p>
                        {shopButton}
                    </Card.Body>
                </Card>
            </Container>
        </main>
        </>
        );
    }

    const paymentStatus = order.payment?.status;
    const failed = paymentStatus === "failed";
    const paid = paymentStatus === "simulated_success";
    const cod = paymentStatus === "pay_on_delivery";

    const statusConfig = failed
        ? {
            icon: "!",
            className: "status-failed",
            eyebrow: "PAYMENT UNSUCCESSFUL",
            title: "Let's try that again.",
            message:
                "Your mock payment failed. Your order wasn't confirmed, and the reserved stock has been released.",
        }
        : paid
            ? {
                icon: "✓",
                className: "status-success",
                eyebrow: "PAYMENT SUCCESSFUL",
                title: "Your coffee journey starts here.",
                message:
                    "Your payment was simulated successfully, and your order is confirmed.",
            }
            : cod
                ? {
                    icon: "✓",
                    className: "status-success",
                    eyebrow: "ORDER CONFIRMED",
                    title: "Good things are on their way.",
                    message:
                        "Your order is confirmed. Please pay when your coffee arrives.",
                }
                : {
                    icon: "…",
                    className: "status-pending",
                    eyebrow: "PAYMENT PENDING",
                    title: "Your order is awaiting confirmation.",
                    message:
                        "Your order has been created, but payment has not yet been confirmed.",
                };
    
    const customer = order.customer || {};
    const address = customer.address || {};

    const addressLines = [
        address.street,
        address.city,
        address.district,
        address.provine,
        address.postalCode,
        address.otherInstructions
    ].filter(Boolean);

    return (
        <>
        <SiteNavbar context="home"/>

        <main className="order-page">
            <Container className="order-container">
                <div className="order-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/shop/coffee">Shop</Link>
                    <span>/</span>
                    <span>Order summary</span>
                </div>

                <header className="order-page-heading">
                    <span className="order-eyebrow">
                        CODE-N-COFFEE / FROM OUR STORE TO YOU
                    </span>
                    <h1>Your order summary</h1>
                    <p>
                        Thank you for choosing coffee with a story.
                    </p>
                </header>

                <Card className="order-panel">
                    <Card.Body className="order-panel-body">
                        <section
                            className={`order-status ${statusConfig.className}`}
                            aria-live="polite">
                            <div className="order-status-icon" aria-hidden="true">
                                {statusConfig.icon}
                            </div>

                            <div className="order-status-copy">
                                <span className="order-eyebrow">
                                    {statusConfig.eyebrow}
                                </span>
                                <h2>{statusConfig.title}</h2>
                                <p>{statusConfig.message}</p>
                            </div>
                        </section>

                        <section className="order-meta">
                            <div>
                                <span className="order-label">
                                    ORDER NUMBER
                                </span>
                                <strong className="order-number">
                                    {order.id || orderId}
                                </strong>
                            </div>

                            <div>
                                <span className="order-label">
                                    ORDER STATUS
                                </span>
                                <span className="order-status-text">
                                    {formatStatus(order.status)}
                                </span>
                            </div>

                            <div>
                                <span className="order-label">
                                    PAYMENT METHOD
                                </span>
                                <strong>
                                    {order.payment?.methodLabel || order.payment?.method || "Not specified"}
                                </strong>
                                <span className="order-muted">
                                    {formatStatus(paymentStatus || "unknown")}
                                </span>
                            </div>
                        </section>

                        <section className="order-section">
                            <div className="order-section-heading">
                                <div>
                                    <span className="order-eyebrow">
                                        THE GOOD STUFF
                                    </span>
                                    <h2>Items in your order</h2>
                                </div>

                                <span className="order-item-count">
                                    {order.items?.reduce((total, item) =>
                                            total + Number(item.quantity || 0), 0) || 0}{" "}
                                    items
                                </span>
                            </div>

                            <Table responsive className="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Price</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.items?.map((item, index) => (
                                        <tr
                                            key={
                                                item.productId ||
                                                item.sku ||
                                                `${item.name}-${index}`
                                            }
                                        >
                                            <td>
                                                <div className="order-product">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt=""
                                                            className="order-product-image"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="order-product-placeholder"
                                                            aria-hidden="true"
                                                        >
                                                            ☕
                                                        </div>
                                                    )}

                                                    <div className="order-product-copy">
                                                        <strong>{item.name}</strong>
                                                        {item.sku && (
                                                            <span>
                                                                SKU: {item.sku}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-center align-middle">
                                                {item.quantity}
                                            </td>

                                            <td className="text-end align-middle">
                                                {formattedAmount(item.unitPrice)}
                                            </td>

                                            <td className="text-end align-middle order-line-total">
                                                {formattedAmount(item.lineTotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </section>

                        <section className="order-bottom-grid">
                            <div className="order-delivery">
                                <span className="order-eyebrow">
                                    NEXT STOP
                                </span>
                                <h2>Delivery details</h2>

                                <div className="order-address-icon" aria-hidden="true">
                                    <span>⌖</span>
                                </div>

                                <strong>{customer.name}</strong>

                                <p>
                                    {addressLines.length
                                        ? addressLines.join(", ")
                                        : "No delivery address available."}
                                </p>

                                {customer.phone && (
                                    <p>{customer.phone}</p>
                                )}

                                {customer.email && (
                                    <p>{customer.email}</p>
                                )}
                            </div>

                            <div className="order-totals">
                                <span className="order-eyebrow">
                                    THE BREAKDOWN
                                </span>
                                <h2>Order total</h2>

                                <div className="order-total-row">
                                    <span>Subtotal</span>
                                    <span>{formattedAmount(order.subtotal)}</span>
                                </div>

                                <div className="order-total-row">
                                    <span>Delivery</span>
                                    <span>{formattedAmount(order.shippingCost)}</span>
                                </div>

                                <div className="order-total-grand">
                                    <span>Total</span>
                                    <strong>{formattedAmount(order.total)}</strong>
                                </div>

                                <p className="order-currency-note">
                                    All prices are in Nepalese Rupees (NPR).
                                </p>
                            </div>
                        </section>

                        <footer className="order-footer">
                            <div>
                                <span className="order-eyebrow">
                                    BREWED WITH PURPOSE
                                </span>
                                <p>
                                    Thanks for supporting the journey from
                                    Nepal's farms to your cup.
                                </p>
                            </div>

                            {shopButton}
                        </footer>
                    </Card.Body>
                </Card>
            </Container>
        </main>
        </>
    )
}
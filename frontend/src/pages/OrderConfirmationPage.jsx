import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router";
import { Alert, Button, Card, Container, Spinner, Table } from "react-bootstrap";
import { fetchOrder } from "../services/orderService";

const formattedAmount = (amount) => {
    return new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 2}).format(Number(amount || 0));
}

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

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner />
                <span className="ms-2">Loading Order...</span>
            </Container>
        )
    }

    if (error || !order) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {error || "Order not found."}
                </Alert>
                <Button
                    as={Link}
                    to="/shop/coffee">
                        Continue Shopping.
                </Button>
            </Container>
        )
    }

    const paymentStatus = order.payment?.status;
    const failed = paymentStatus === "failed";
    const paid = paymentStatus === "simulated_success";
    const cod = paymentStatus === "pay_on_delivery";

    return (
        <Container
            className="py-5"
            style={{maxWidth: 850}}>

            <Card>
                <Card.Body className="p-4">
                    { paid 
                        ? <Alert variant="success">Mock Payment Successful. Your Order is Confirmed.</Alert> 
                        : cod 
                            ? <Alert variant="success">Order is Confirmed. Payment is due on delivery</Alert>
                            : failed
                                ? <Alert variant="danger">Mock Payment Failed. Your Order wasn't confirmed and reserved stock was released.</Alert>
                                : <Alert variant="warning">Your order is awaiting payment confirmation.</Alert>
                    }

                    <h1 className="h3">
                        Order confirmation
                    </h1>

                    <p>
                        <strong>Order number:</strong> {order.orderNumber}
                    </p>

                    <p>
                        <strong>Order status:</strong> {String(order.status || "").replaceAll("_", " ")}
                    </p>

                    <p>
                        <strong>Payment:</strong> {order.payment?.methodLabel} — {paymentStatus}
                    </p>

                    <h2 className="h5 mt-4">
                        Items
                    </h2>

                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Unit price</th>
                                <th className="text-end">Line total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map(i => (
                                <tr key={String(i.productId)}>
                                    <td>{i.name}</td><td>{i.quantity}</td>
                                    <td>{money(i.unitPrice)}</td>
                                    <td className="text-end">{money(i.lineTotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="ms-auto" style={{ maxWidth: 320 }}>
                        <div className="d-flex justify-content-between">
                            <span>Subtotal</span>
                            <span>{money(order.subtotal)}</span>
                            </div>
                        <div className="d-flex justify-content-between">
                            <span>Shipping</span>
                            <span>{money(order.shippingCost)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>{money(order.total)}</span>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <h2 className="h5">
                        Delivery details
                    </h2>

                    <p className="mb-1">
                        {order.customer?.name}
                    </p>

                    <p className="mb-1">
                        {order.customer?.email} · {order.customer?.phone}
                    </p>

                    <p>
                        {[  order.customer?.address?.line1, 
                            order.customer?.address?.line2, 
                            order.customer?.address?.city, 
                            order.customer?.address?.region, 
                            order.customer?.address?.country
                        ].filter(Boolean).join(", ")}
                    </p>

                    <Button as={Link} to="/shop/coffee">
                        Continue shopping
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    )
}
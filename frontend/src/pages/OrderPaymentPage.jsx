import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { createOrder, completeMockPayment, confirmCashOnDelivery } from "../services/orderService";

const emptyCustomer = {
    name: "",
    email: "",
    phone: "",
    address: {
        line1: "",
        line2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "Nepal"
    }
};

export default function OrderPaymentPage() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(emptyCustomer);
    const [method, setMethod] = useState("mock-esewa");
    const [outcome, setOutcome] = useState("success");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const changeCustomerAddress = (key, value) => {
        setCustomer(c => (
            { ...c, address: { ...c.address, [key]: value}}
        ));
    }

    const changeCustomerDetails = (key, value) => {
        setCustomer(c => {
            return { ...c, [key]: value }
        });
    }

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError("");

        try {
            if (!cartItems?.length) {
                throw new Error("Your cart is empty.");
            }
            let order = await createOrder( { customer, items: cartItems, paymentMethod: method } );
            const id = order.id || order._id;

            order = method === "cash-on-delivery" ? await confirmCashOnDelivery(id) : await completeMockPayment(id, outcome);
            clearCart();
            navigate(`/order-confirmation/${order.id || order._id}`, { replace: true, state: { order }});
        } catch (err) {
            setError(err.message || "Unable to place order. Check stock and Try Again.");
        } finally {
            setBusy(false);
        }
    }

    if (!cartItems?.length) {
        return (
            <Container
                className="py-5">

                <Alert variant="info">
                    Your Cart is empty.
                    <Link
                        to="/shop/coffee">
                            Browse products
                    </Link>
                </Alert>
            </Container>
        )
    }

    return (
        <Container 
            className="py-4" 
            style={{ maxWidth: 760 }}>

            <h1 className="mb-3">
                Complete your demo order
            </h1>

            <Alert variant="warning">
                Demo only: eSewa and Khalti are simulated. 
                No real payment is taken.
            </Alert>

            {error && 
                <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={submit}>
                <Card className="mb-3">
                    <Card.Body>
                        <h2 className="h5">Customer details</h2>

                        <Form.Group className="mb-3">
                            <Form.Label>Full name</Form.Label>
                            <Form.Control 
                                required 
                                value={customer.name} 
                                onChange={e => changeCustomerDetails("name", e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                required 
                                type="email" 
                                value={customer.email} 
                                onChange={e => changeCustomerDetails("email", e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control 
                                required 
                                type="tel" 
                                value={customer.phone} 
                                onChange={e => changeCustomerDetails("phone", e.target.value)} />
                        </Form.Group>

                        <h3 className="h6 mt-4">
                            Delivery address
                        </h3>

                        <Form.Group className="mb-3">
                            <Form.Label>Address line 1</Form.Label>
                            <Form.Control 
                                required 
                                value={customer.address.line1} 
                                onChange={e => changeCustomerAddress("line1", e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Address line 2 (optional)</Form.Label>
                            <Form.Control 
                                value={customer.address.line2} 
                                onChange={e => changeCustomerAddress("line2", e.target.value)} />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control 
                                        required 
                                        value={customer.address.city} 
                                        onChange={e => changeCustomerAddress("city", e.target.value)} />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Province / Region</Form.Label>
                                    <Form.Control 
                                        value={customer.address.region} 
                                        onChange={e => changeCustomerAddress("region", e.target.value)} />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Postal code (optional)</Form.Label>
                            <Form.Control 
                                value={customer.address.postalCode} 
                                onChange={e => changeCustomerAddress("postalCode", e.target.value)} />
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="mb-3">
                    <Card.Body>
                        <h2 className="h5">Payment method</h2>
                        {[["mock-esewa", "Mock eSewa (simulated)"], ["mock-khalti", "Mock Khalti (simulated)"], ["cash-on-delivery", "Cash on delivery"]].map(([value, label]) =>
                            <Form.Check 
                                key={value} 
                                type="radio" 
                                name="method" 
                                id={value} 
                                value={value} 
                                label={label} 
                                checked={method === value} 
                                onChange={e => setMethod(e.target.value)} 
                                className="mb-2" />
                        )}

                        {method !== "cash-on-delivery" && (
                            <Form.Group className="mt-3">
                                <Form.Label>Simulated result (testing only)</Form.Label>
                                <Form.Select 
                                    value={outcome} 
                                    onChange={e => setOutcome(e.target.value)}>
                                    <option value="success">Successful payment</option>
                                    <option value="failure">Failed payment — test stock release</option>
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Card.Body>
                </Card>

                <div className="d-flex gap-2 flex-wrap">
                    <Button 
                        type="submit" 
                        disabled={busy}>
                            {busy 
                                ? <>
                                    <Spinner size="sm" className="me-2" />
                                    Processing…
                                    </> 
                                : "Place demo order"}
                    </Button>

                    <Button 
                        as={Link} 
                        to="/cart" 
                        variant="outline-secondary" 
                        disabled={busy}>
                            Return to cart
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

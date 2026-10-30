import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

import { useCart } from '../../context/CartContext';
import { DEMO_SHIPPING_FEE } from "../../config/storeConfig";

import "./CheckoutPage.css"

import { completeMockPayment, confirmCashOnDelivery, createOrder } from "../../services/orderService";

const emptyCustomer = {
    name: "",
    email: "",
    phone: "",
    address: {
        street: "",
        city: "",
        district: "",
        province: "",
        postalCode: "",
        otherInstructions: ""
    }
};

const formatPrice = (price) => 
    `Rs. ${new Intl.NumberFormat("en-NP", {maximumFractionDigits: 2}).format(price)}`;

function CheckoutPage() {
    const { cartItems, cartSubtotal, clearCart } = useCart();

    const navigate = useNavigate();

    const [customer, setCustomer] = useState(emptyCustomer);
    const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
    const [outcome, setOutcome] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const estimatedShipping = cartItems.length > 0 ? DEMO_SHIPPING_FEE : 0;
    const estimatedTotal = cartSubtotal + estimatedShipping;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");

        try {
            if (!cartItems?.length) {
                throw new Error("Your cart is Empty.");
            }

            let order = await createOrder( {customer: customer, items: cartItems, paymentMethod: paymentMethod});
            const id = order.id || order._id;

            order = paymentMethod === "cash-on-delivery" ? await confirmCashOnDelivery(id) : await completeMockPayment(id, outcome)
            clearCart();
            navigate(`order-confirmation/${id}`, {replace: true, state: { order }})
        } catch (err) {
            console.log(err)
            setError(err.message || "Unable to place order. Check Stock and Try Again.");
        } finally {
            setBusy(false);
        }
    }

    const changeCustomerDetails = (key, value) => {
        setCustomer(c => {
            return { ...c, [key]: value }
        });
    }

    const changeCustomerAddress = (key, value) => {
        setCustomer(c => (
            { ...c, address: { ...c.address, [key]: value } }
        ));
    }


    if (cartItems.length === 0) {
        return (
            <>
                <section className="checkout-page">
                    <Container>
                        <div className="checkout-empty">
                            <h1>Your cart is empty</h1>
                            <p>
                                Add something to your cart before checking out.
                            </p>
                            <Button
                                as={Link}
                                to="/shop/coffee"
                                variant="dark"
                            >
                                Browse Coffees
                            </Button>
                        </div>
                    </Container>
                </section>
            </>
        )
    }

    return (
    <>
        <section className="checkout-page">
            <Container>
                <header className="checkout-header">
                    <p className="checkout-eyebrow">ALMOST THERE</p>
                    <h1>Checkout</h1>
                    <p>
                        Tell us where to deliver your order and review
                        your selections.
                    </p>
                </header>

                {error &&
                    <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4">
                        <Col lg={7}>
                            <Card className="checkout-card">
                                <Card.Body>
                                    <h2>Contact Information</h2>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="fullName">
                                                <Form.Label>
                                                    Full name
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder="Your full name"
                                                    value={customer.name}
                                                    maxLength={100}
                                                    required
                                                    onChange={(e) => changeCustomerDetails("name", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="email">
                                                <Form.Label>
                                                    Email address
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    autoComplete="email"
                                                    placeholder="you@example.com"
                                                    maxLength={254}
                                                    required
                                                    value={customer.email}
                                                    onChange={(e) => changeCustomerDetails("email", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="phone">
                                                <Form.Label>
                                                    Phone number
                                                </Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    autoComplete="phone"
                                                    placeholder="98XXXXXXXX"
                                                    maxLength={10}
                                                    required
                                                    value={customer.phone}
                                                    onChange={(e) => changeCustomerDetails("phone", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <hr className="checkout-divider" />

                                    <h2>Delivery Address</h2>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="address">
                                                <Form.Label>
                                                    Street address
                                                </Form.Label>
                                                <Form.Control
                                                    name="address"
                                                    autoComplete="street-address"
                                                    placeholder="Street, tole, house number"
                                                    maxLength={250}
                                                    required
                                                    value={customer.address.street}
                                                    onChange={(e) => changeCustomerAddress("street", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="city">
                                                <Form.Label>
                                                    City / Municipality
                                                </Form.Label>
                                                <Form.Control
                                                    name="city"
                                                    autoComplete="address-level2"
                                                    placeholder="e.g. Kathmandu"
                                                    maxLength={100}
                                                    required
                                                    value={customer.address.city}
                                                    onChange={(e) => changeCustomerAddress("city", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="district">
                                                <Form.Label>
                                                    District
                                                </Form.Label>
                                                <Form.Control
                                                    name="district"
                                                    placeholder="e.g. Kathmandu"
                                                    maxLength={100}
                                                    required
                                                    value={customer.address.district}
                                                    onChange={(e) => changeCustomerAddress("district", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="province">
                                                <Form.Label>
                                                    Province
                                                </Form.Label>
                                                <Form.Select
                                                    name="province"
                                                    value={customer.address.province}
                                                    onChange={(e) => changeCustomerAddress("province", e.target.value)}>
                                                    
                                                    <option value="" disabled>Select province</option>
                                                    <option value="koshi">Koshi</option>
                                                    <option value="madhesh">Madhesh</option>
                                                    <option value="bagmati">Bagmati</option>
                                                    <option value="gandaki">Gandaki</option>
                                                    <option value="lumbini">Lumbini</option>
                                                    <option value="karnali">Karnali</option>
                                                    <option value="sudurpaschim">Sudurpashchim</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="postalCode">
                                                <Form.Label>
                                                    Postal code (optional)
                                                </Form.Label>
                                                <Form.Control
                                                    name="postalCode"
                                                    autoComplete="postal-code"
                                                    maxLength={20}
                                                    value={customer.address.postalCode}
                                                    onChange={(e) => changeCustomerAddress("postalCode", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="deliveryNotes">
                                                <Form.Label>
                                                    Delivery instructions
                                                    (optional)
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="deliveryNotes"
                                                    rows={3}
                                                    maxLength={500}
                                                    placeholder="Landmarks or other useful delivery details"
                                                    value={customer.address.otherInstructions}
                                                    onChange={(e) => changeCustomerAddress("otherInstructions", e.target.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <hr className="checkout-divider" />

                                    <h2>Payment Preference</h2>

                                    <Row className="g-3">
                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            id="payment-cod"
                                            value="cash-on-delivery"
                                            checked={paymentMethod === "cash-on-delivery"}
                                            onChange={() => setPaymentMethod("cash-on-delivery")}
                                            label={
                                                <span>
                                                    <strong>
                                                        Cash on Delivery
                                                    </strong>
                                                    <small className="d-block text-secondary">
                                                        Pay when your order arrives.
                                                    </small>
                                                </span>
                                            }
                                            className="checkout-payment-option"/>

                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            id="payment-online-esewa"
                                            value="mock-esewa"
                                            checked={paymentMethod === "mock-esewa"}
                                            onChange={() => setPaymentMethod("mock-esewa")}
                                            label={
                                                <span>
                                                    <strong>
                                                        Mock eSewa Payment
                                                    </strong>
                                                    <small className="d-block text-secondary">
                                                        Choose between Successful and Failed Simulation.
                                                    </small>
                                                </span>
                                            }
                                            className="checkout-payment-option"/>

                                        <Form.Check
                                            type="radio"
                                                name="paymentMethod"
                                                id="payment-online-khalti"
                                                value="mock-khalti"
                                                checked={paymentMethod === "mock-khalti"}
                                                onChange={() => setPaymentMethod("mock-khalti")}
                                                label={
                                                    <span>
                                                        <strong>
                                                            Mock Khalti Payment
                                                        </strong>
                                                        <small className="d-block text-secondary">
                                                            Choose between Successful and Failed Simulation.
                                                        </small>
                                                    </span>
                                                }
                                                className="checkout-payment-option" />
                                    </Row>
                                                
                                    <hr className="checkout-divider" />

                                    <h2>Simulated Result (Not for CoD)</h2>

                                        <Row className="g-3">
                                            <Form.Label>Simulation Outcome</Form.Label>
                                            <Form.Select
                                                name="outcome"
                                                id="payment-outcome"
                                                value={outcome}
                                                onChange={e => setOutcome(e.target.value)}
                                                className="checkout-outcome-option">
                                                
                                                <option value="" disabled>Select an Option:</option>
                                                <option value="success">Successful Payment</option>
                                                <option value="failure">Failed Payment</option>
                                            </Form.Select>

                                        </Row>

                                    <Button
                                        type="submit"
                                        variant="dark"
                                        className="w-100 checkout-submit"
                                        disabled={busy}>
                                        {busy
                                            ?   <>
                                                <Spinner size="sm" className="me-2" />
                                                Processing...
                                                </>
                                            : "Place Demo Order"}
                                    </Button>

                                    <p className="checkout-demo-caption">
                                        Checkout is currently in demo mode.
                                    </p>

                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={5}>
                            <Card className="checkout-card checkout-order-card">
                                <Card.Body>
                                    <h2>Order Summary</h2>

                                    <div className="checkout-order-items">
                                        {cartItems.map((item) => (
                                            <div
                                                className="checkout-order-item"
                                                key={item.id}
                                            >
                                                <img
                                                    src={
                                                        item.imageUrl ||
                                                        "/storefront/Default_Product_Image.png"
                                                    }
                                                    alt=""
                                                    className="checkout-order-image"
                                                    onError={(event) => {
                                                        event.currentTarget.onerror = null;
                                                        event.currentTarget.src = "/storefront/Default_Product_Image.png"
                                                    }}
                                                />

                                                <div className="checkout-order-details">
                                                    <h3>{item.name}</h3>
                                                    <p>
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>

                                                <strong>
                                                    {formatPrice(
                                                        item.price *
                                                        item.quantity
                                                    )}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="checkout-price-row">
                                        <span>Subtotal</span>
                                        <span>
                                            {formatPrice(cartSubtotal)}
                                        </span>
                                    </div>

                                    <div className="checkout-price-row">
                                        <span>Shipping estimate</span>
                                        <span>
                                            {formatPrice(estimatedShipping)}
                                        </span>
                                    </div>

                                    <p className="checkout-shipping-note">
                                        Shipping is a demo estimate and may
                                        change when delivery details are
                                        verified.
                                    </p>

                                    <div className="checkout-total-row">
                                        <span>Estimated Total</span>
                                        <strong>
                                            {formatPrice(estimatedTotal)}
                                        </strong>
                                    </div>

                                    <Link
                                        to="/cart"
                                        className="checkout-edit-cart"
                                    >
                                        ← Edit cart
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </section>
    </>
    )
}

export default CheckoutPage;

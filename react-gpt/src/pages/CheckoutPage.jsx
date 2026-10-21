import { useState } from "react";
import { Link } from "react-router";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

import { useCart } from '../context/CartContext';

import { DEMO_SHIPPING_FEE } from "../config/storeConfig";

import "./CheckoutPage.css"
import SiteNavbar from "../components/layout/SiteNavbar";

const formatPrice = (price) => 
    `Rs. ${new Intl.NumberFormat("en-NP", {maximumFractionDigits: 2}).format(price)}`;

function CheckoutPage() {
    const {cartItems, cartSubtotal} = useCart();

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [reviewMessage, setReviewMessage] = useState(false);

    const estimatedShipping = cartItems.length > 0 ? DEMO_SHIPPING_FEE : 0;
    const estimatedTotal = cartSubtotal + estimatedShipping;

    const handleSubmit = (event) => {
        event.preventDefault();

        setReviewMessage(true);
    }

    if (cartItems.length === 0) {
        return (
            <>
                <SiteNavbar context="checkout" />
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
            <SiteNavbar context="checkout" />
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
                                                        name="fullName"
                                                        type="text"
                                                        autoComplete="name"
                                                        placeholder="Your full name"
                                                        maxLength={100}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group controlId="email">
                                                    <Form.Label>
                                                        Email address
                                                    </Form.Label>
                                                    <Form.Control
                                                        name="email"
                                                        type="email"
                                                        autoComplete="email"
                                                        placeholder="you@example.com"
                                                        maxLength={254}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group controlId="phone">
                                                    <Form.Label>
                                                        Phone number
                                                    </Form.Label>
                                                    <Form.Control
                                                        name="phone"
                                                        type="tel"
                                                        autoComplete="tel"
                                                        placeholder="98XXXXXXXX"
                                                        maxLength={10}
                                                        required
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
                                                        defaultValue=""
                                                        required
                                                    >
                                                        <option value="" disabled>
                                                            Select province
                                                        </option>
                                                        <option>Koshi</option>
                                                        <option>Madhesh</option>
                                                        <option>Bagmati</option>
                                                        <option>Gandaki</option>
                                                        <option>Lumbini</option>
                                                        <option>Karnali</option>
                                                        <option>Sudurpashchim</option>
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
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <hr className="checkout-divider" />

                                        <h2>Payment Preference</h2>

                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            id="payment-cod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => {
                                                setPaymentMethod("cod");
                                                setReviewMessage(false);
                                            }}
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
                                            className="checkout-payment-option"
                                        />

                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            id="payment-online"
                                            value="online"
                                            disabled
                                            label={
                                                <span>
                                                    <strong>
                                                        Online Payment
                                                    </strong>
                                                    <small className="d-block text-secondary">
                                                        Online payment will be
                                                        available in a future update.
                                                    </small>
                                                </span>
                                            }
                                            className="checkout-payment-option"
                                        />

                                        {reviewMessage && (
                                            <div
                                                className="checkout-demo-notice"
                                                role="status">
                                                Your form passed browser
                                                validation. This is only a frontend
                                                preview: no order has been placed
                                                and no personal information has
                                                been submitted to a server.
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            variant="dark"
                                            className="w-100 checkout-submit"
                                        >
                                            Review Order
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

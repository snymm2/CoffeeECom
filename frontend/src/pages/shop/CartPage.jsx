import { Link } from 'react-router';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

import { useCart } from '../../context/CartContext';

import { Trash } from 'react-bootstrap-icons';

import './CartPage.css'

import { DEMO_SHIPPING_FEE } from '../../config/storeConfig';

function CartPage() {
    const {
        cartItems,
        cartCount,
        cartSubtotal,
        removeFromCart,
        updateQuantity
    } = useCart();

    const formatPrice = (price) => new Intl.NumberFormat("en-NP", {
        maximumFractionDigits: 2
    }).format(price);

    const estimatedShipping = cartItems.length > 0 ? DEMO_SHIPPING_FEE : 0;
    const estimatedTotal = cartSubtotal + estimatedShipping;

    return (
        <>
            <section className='cart-page'>
                <Container>
                    <div className='cart-page-header'>
                        <p className='cart-eyebrow'>YOUR SELECTION</p>
                        <h1>Your Cart</h1>
                        <p className='text-secondary'>Review your items before proceeding to checkout.</p>
                    </div>
    
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <h2>Your Cart is Empty</h2>
                            <p className='text-secondary'>
                                Find a coffee or brewing accessory to get started.
                            </p>
                            <Button
                                as={Link}
                                to="/shop/coffee"
                                variant="dark">
                                    Explore the Shop.
                            </Button>
                        </div>
                    ) : (
                        <Row className='g-4'>
                            <Col lg={8}>
                                <div className='cart-items'>
                                    <div className='cart-items-heading'>
                                        <h2>Your Items</h2>
                                        <span>
                                            {cartCount} item
                                            {cartCount !== 1 ? "s": ""}
                                        </span>
                                    </div>
    
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className='cart-item'>
                                            
                                            <img 
                                                src={item.imageUrl || "/storefront/Default_Product_Image.png"} 
                                                alt={item.name}
                                                className='cart-item-image'
                                                onError={(event) => {
                                                    event.currentTarget.onerror = null;
                                                    event.currentTarget.src = "/storefront/Default_Product_Image.png";
                                            }}/>
    
                                            <div className='cart-item-details'>
                                                <h3>{item.name}</h3>
                                                
                                                <p className='cart-item-unit-price'>{formatPrice(item.price)} each</p>
                                           
                                                <Form.Group
                                                    className='cart-quantity'
                                                    controlId={`quantity-${item.id}`}>
    
                                                    <Form.Label>
                                                            Quantity
                                                    </Form.Label>
                                                    
                                                    <Form.Control
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        value={item.quantity}
                                                        onChange={(event) => {
                                                            const quantity = Number(event.target.value);
                                                            if (Number.isInteger(quantity) && quantity > 1) {
                                                                updateQuantity(item.id, quantity);
                                                            }
                                                        }} />
                                                </Form.Group>
    
                                                <button
                                                    type="button"
                                                    className="cart-remove-button"
                                                    onClick={() => removeFromCart(item.id)}>
    
                                                    <Trash 
                                                        size={22} 
                                                        alt="Remove Item"/>
                                                </button>
                                           </div>
    
                                            <div className="cart-item-line-total">
                                                Rs.
                                                {formatPrice(
                                                    item.price * item.quantity
                                                )}
                                            </div>
                                        </div>
                                    ))}
    
                                    <div className="cart-continue">
                                        <Link to="/shop/coffee">
                                            ← Continue shopping
                                        </Link>
                                    </div>
                                </div>
                            </Col>
    
                            <Col lg={4}>
                                <Card className="cart-summary">
                                    <Card.Body>
                                        <h2>Order Summary</h2>
    
                                        <div className="cart-summary-row">
                                            <span>Subtotal</span>
                                            <span>
                                                {formatPrice(cartSubtotal)}
                                            </span>
                                        </div>
    
                                        <div className="cart-summary-row">
                                            <span>Shipping estimate</span>
                                            <span>
                                                {formatPrice(estimatedShipping)}
                                            </span>
                                        </div>
    
                                        <p className="cart-shipping-note">
                                            Demo estimate only. Actual shipping
                                            charges will be calculated during
                                            checkout.
                                        </p>
    
                                        <div className="cart-summary-total">
                                            <span>Estimated Total</span>
                                            <strong>
                                                {formatPrice(estimatedTotal)}
                                            </strong>
                                        </div>
    
                                        <Button
                                            as={Link}
                                            to="/checkout"
                                            variant="dark"
                                            className="w-100 cart-checkout-button"
                                        >
                                            Proceed to Checkout
                                        </Button>
    
                                        <p className="cart-summary-footer">
                                            Delivery and payment details come next.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Container>
            </section>
        </>
    );
}

export default CartPage;
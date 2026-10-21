import { Link } from 'react-router';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

import { Trash } from 'react-bootstrap-icons';

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

    return (
        <Container className='cart-page py-5'>
            <h1 className='mb-4'>Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-5">
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
                <>
                    <p className='text-secondary'>
                        {cartCount} item{cartCount !== 1 ? "s" : ""} in the cart.
                    </p>

                    {cartItems.map((item) => (
                        <Row
                            key={item.id}
                            className='align-items-center border-bottom py-3 g-3'>
                            
                            <Col xs={3} md={2}>
                                <img 
                                    src={item.imageUrl || "/storefront/Default_Product_Image.png"} 
                                    alt={item.name}
                                    className='img-fluid rounded'/>
                            </Col>

                            <Col xs={9} md={4}>
                                <h2 className='h6 mb-1'>{item.name}</h2>
                                <p className='mb-0 text-secondary'>{formatPrice(item.price)} each</p>
                            </Col>

                            <Col xs={6} md={3}>
                                <Form.Label
                                    htmlFor={`quantity-${item.id}`}
                                    className='small'>
                                        Quantity
                                </Form.Label>
                                
                                <Form.Control
                                    id={`quantity-${item.id}`}
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
                            </Col>

                            <Col xs={6} md={3}
                                className='text-end'>
                                
                                <p className="fw-semibold mb-2">
                                    {formatPrice(item.price * item.quantity)}
                                </p>

                                <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash size={22} />
                                </Button>

                            </Col>
                        </Row>
                    ))}
                </>

            )
            }
        
        </Container>
    )
}

export default CartPage;
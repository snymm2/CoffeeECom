import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router";

import { fetchProductById } from "../../services/productService";
import { useEffect, useState } from "react";

export default function RecommendedProducts({ productIds = [], heading, resolveImageUrl }) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchProducts() {
            if (!productIds.length) {
                setProducts([]);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const results = await Promise.allSettled(productIds.map(id => fetchProductById(id)));

                if (cancelled) return;

                const fetchedProducts = results.filter(result => result.status === "fulfilled").map(result => result.value);

                setProducts(fetchedProducts);

                if (fetchedProducts.length === 0) {
                    setError("No recommendations currently available.")
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Unable to load recommended products.")
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchProducts();

        return () => {
            cancelled = true;
        }
    }, [productIds])

    if (!productIds.length) return null;

    return (
    <section className="brew-section brew-products">
        <div className="brew-section__heading">
            <span className="brew-eyebrow">From farm to cup</span>
            <h2>{heading}</h2>
            <p>Explore coffees and equipment that can help you get started.</p>
        </div>

        {loading && (
            <div className="text-center py-4">
                <Spinner animation="border" variant="secondary" />
                <p className="mt-2 text-muted">
                    Loading recommended products...
                </p>
            </div>
        )}

        {error && !loading && (
            <Alert variant="secondary">
                {error}
            </Alert>
        )}

        {!loading && products.length > 0 && (
        <>
        <Row className="g-3">
            {products.map(p => {
                const id = p._id || p.id;
                return (
                    <Col xs={6} md={3} key={id}>
                        <Card className="brew-product-card h-100">
                            <Link to={`/products/${id}`} className="brew-product-card__image">
                                <img
                                    src={resolveImageUrl ? resolveImageUrl(p.imageUrl) : p.imageUrl}
                                    alt={p.name} />
                            </Link>

                            <Card.Body>
                                <small>{p.brand || p.category || "Code-n-Coffee"}</small>
                                <Card.Title>{p.name}</Card.Title>
                                <strong>NRs. {Number(p.price || 0).toLocaleString("en-NP")}</strong>
                                <Button
                                    as={Link}
                                    to={`/products/${id}`}
                                    variant="outline-dark"
                                    size="sm"
                                    className="mt-3 w-100">
                                    View product
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            )}
        </Row>

        <div className="text-center mt-4">
            <Button 
                as={Link} 
                to="/shop" 
                variant="dark">
                
                Explore the shop
            </Button>
        </div>
        </>
        )}
        
    </section>
    );
}

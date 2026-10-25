import { useState, useEffect } from "react";

import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { Link } from "react-router";
import { ArrowRight } from "react-bootstrap-icons";

import FeaturedCard from "./FeaturedCard";
import "./FeaturedSection.css"

import { fetchProducts } from "../../services/productService";

function FeaturedSection() {

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadFeaturedProducts() {
            setIsLoading(true);
            setFeaturedProducts([]);
            setError(null);

            try {
                const result = await fetchProducts({
                    category: "coffee",
                    featured: true,
                    sort: "featured",
                    page: 1,
                    limit: 4
                });

                if (!cancelled) {
                    setFeaturedProducts(result.data)
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

        loadFeaturedProducts();

        return () => {
            cancelled = true;
        }
    }, []);

    return (
        <section
            className="featured-coffee-section">
            <Container>
                <Row
                    className="justify-content-between align-items-end mb-4">
                    <Col xs={12} md={8}>
                        <p className="featured-eyebrow">FEATURED COFFEES</p>
                        <h2 className="featured-heading">Coffee Worth Discovering</h2>
                        <p className="featured-description">
                            Carefully sourced, small-batch coffees from Nepalese highlands.</p>
                    </Col>
                    <Col xs={12} sm="auto" className="mt-2 mt-md-0">
                        <Button
                            as={Link}
                            to="/shop/coffee"
                            variant="link"
                            className="featured-view-all p-0">
                            View all coffees
                            <ArrowRight className="ms-2" />
                        </Button>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger">
                        Unable to load featured coffees: {error}
                    </Alert>
                )}

                {isLoading ? (
                    <div className="text-center py-5">
                        Loading featured coffees...
                    </div>
                ) : !error && featuredProducts.length === 0 ? (
                    <p className="text-center py-4">
                        No featured coffees are available right now.
                    </p>
                ) : (
                    <div className="featured-products">
                        {featuredProducts.map((product) => (
                            <div className="featured-product-item"
                                key={product.id}>
                                <FeaturedCard productInfo={product} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
}

export default FeaturedSection;
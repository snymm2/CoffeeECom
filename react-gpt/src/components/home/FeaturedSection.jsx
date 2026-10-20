import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router";
import { ArrowRight} from "react-bootstrap-icons";

import FeaturedCard from "./FeaturedCard";
import "./FeaturedSection.css"

const featuredProducts = [
    {
        id: "001",
        name: "Himali Bloom",
        location: "Lamjung, Nepal",
        process: "Washed",
        tastingNotes: ["Floral", "Citrus", "Clean"],
        roastLevel: "Light",
        price: 1250,
        imageUrl: "/featured/HimaliBloom-001.jpg"
    },
    {
        id: "002",
        name: "Gurung Special",
        location: "Kaski, Nepal",
        process: "Natural",
        tastingNotes: ["Berry", "Chocolate", "Smooth"],
        roastLevel: "Medium",
        price: 1150,
        imageUrl: "/featured/GurungSpecial-001.jpg"
    },
    {
        id: "003",
        name: "Sindhuli Classic",
        location: "Sindhuli, Nepal",
        process: "Washed",
        tastingNotes: ["Caramel", "Nutty", "Balanced"],
        roastLevel: "Medium",
        price: 1100,
        imageUrl: "/featured/SindhuliClassic-001.jpg"
    },
    {
        id: "004",
        name: "Annapurna Reserve",
        location: "Myagdi, Nepal",
        process: "Natural",
        tastingNotes: ["Stone Fruit", "Floral", "Complex"],
        roastLevel: "Light",
        price: 1350,
        imageUrl: "/featured/AnnapurnaReserve-001.jpg"
    }
];

function FeaturedSection() {
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

                <div className="featured-products">
                    {featuredProducts.map((product) => (
                        <div className="featured-product-item"
                            key={product.id}>
                            <FeaturedCard productInfo={product} />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

export default FeaturedSection;
import { Container, Row, Col, Button } from "react-bootstrap";

import { Link } from "react-router";

import { ArrowRight, ArrowRightCircle, ArrowRightCircleFill } from "react-bootstrap-icons";

const featuredProducts = [
    {
        id: "001",
        name: "Himali Bloom",
        location: "Lamjung, Nepal",
        process: "Washed",
        note1: "Floral",
        note2: "Citrus",
        note3: "Clean",
        roastLevel: "Light",
        price: 1250
    },
    {
        id: "002",
        name: "Gurung Special",
        location: "Kaski, Nepal",
        process: "Natural",
        note1: "Berry",
        note2: "Chocolate",
        note3: "Smooth",
        roastLevel: "Medium",
        price: 1150
    },
    {
        id: "003",
        name: "Sindhuli Classic",
        location: "Sindhuli, Nepal",
        process: "Washed",
        note1: "Caramel",
        note2: "Nutty",
        note3: "Balanced",
        roastLevel: "Medium",
        price: 1100
    },
    {
        id: "004",
        name: "Annapurna Reserve",
        location: "Myagdi, Nepal",
        process: "Natural",
        note1: "Stone Fruit",
        note2: "Floral",
        note3: "Complex",
        roastLevel: "Light",
        price: 1350
    }
];


function FeaturedSection() {
    return (
        <section
            className="featured-coffee-section">
            <Container
                className="my-2">
                <Row
                    className="justify-content-between align-items-center">
                    <Col
                        xs={10}
                        md={6}
                        lg={6}>
                        
                        <h4>Featured Coffees</h4>
                        <h2>Coffee Worth Discovering</h2>
                        <p>Carefully sourced, small-batch coffees from Nepalese highlands.</p>
                    </Col>
                    <Col
                        xs={2}
                        md={4}
                        className="text-end">
                        <Button
                            as={Link}
                            to="/shop"
                            variant="outline-dark"
                            className="border-0">
                            Learn more &nbsp;
                            <ArrowRightCircleFill />
                        </Button>
                    </Col>
                </Row>
                <Row>

                </Row>
            </Container>
        </section>
    )
}

export default FeaturedSection;
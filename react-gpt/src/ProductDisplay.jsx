import ProductCard from "./ProductCard";
import {Container, Row, Col} from "react-bootstrap"

function ProductDisplay({productCards}) {
    return (
        <Container>
            <Row xs={1}>
                <Col
                    className="m-4">
                        <div className="fs-4 text-dark fw-bold">All Products</div>
                        <div className="fs-6 text-secondary">x Products Listed</div>
                </Col>
            </Row>
            <Row xs={1} md={2} lg={3} className="g-2">
                {productCards.map((cardInfo, index) => (
                    <Col key={index}>
                        <ProductCard productInfo={cardInfo}></ProductCard>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default ProductDisplay;
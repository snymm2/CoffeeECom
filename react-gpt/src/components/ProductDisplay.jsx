import ProductCard from "./ProductCard";
import {Container, Row, Col} from "react-bootstrap"

function ProductDisplay({title, productCards}) {
    return (
        <>
            <Row xs={1}>
                <Col
                    className="m-4">
                        <div className="fs-4 text-dark fw-bold">{title}</div>
                        <div className="fs-6 text-secondary">{productCards.length} Products Listed</div>
                </Col>
            </Row>
            <Row xs={1} md={2} lg={3} className="g-2">
                {productCards.map((cardInfo) => (
                    <Col key={cardInfo.id}>
                        <ProductCard productInfo={cardInfo}></ProductCard>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default ProductDisplay;
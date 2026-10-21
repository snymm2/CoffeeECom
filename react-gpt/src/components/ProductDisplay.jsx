import ProductCard from "./ProductCard";
import {Row, Col, Form} from "react-bootstrap"

import "./ProductDisplay.css"

function ProductDisplay({title, productCards, sortBy, onSortChange}) {
    return (
        <section className="product-display">
            <div className="product-display-toolbar">
                <div>
                    <h1 className="product-display-title">{title}</h1>
                    <p className="product-display-count">
                        {productCards.length}{" "}
                        {productCards.length === 1 ? "product" : "products"} found
                    </p>
                </div>

                <div className="product-display-sort">
                    <Form.Label htmlFor="product-sort">
                        Sort By
                    </Form.Label>

                    <Form.Select
                        id="product-sort"
                        value={sortBy}
                        onChange={(event) => onSortChange(event.target.value)}>
                        
                        <option value="featured">Featured</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating-desc">Highest Rated</option>
                        <option value="popular">Most Reviews</option>
                        <option value="discount-desc">Biggest Discount</option>

                    </Form.Select>
                </div>
            </div>

            {productCards.length === 0 ? (
                <div className="product-display-empty">
                    <h2>No products found</h2>
                    <p>
                        Try changing your search or removing some filters.
                    </p>
                </div>
            ) : (
                <Row xs={1} sm={2} xl={3} xxl={4} className="g-2 g-xl-4">
                    {productCards.map((cardInfo) => (
                        <Col key={cardInfo.id}>
                            <ProductCard productInfo={cardInfo}></ProductCard>
                        </Col>
                    ))}
                </Row>
            )}
        </section>
    );
}

export default ProductDisplay;
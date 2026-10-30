import { Card, Col, Row } from "react-bootstrap";

export default function QuickRecipe({ recipe }) {
    return (
    <section className="brew-section">
        <div className="brew-section__heading">
            <span className="brew-eyebrow">Your starting point</span>
            <h2>Quick recipe</h2>
            <p>Start here, then adjust the recipe to suit your coffee and taste.</p>
        </div>

        <Row className="g-3">
            {recipe.map(([label, value]) => 
                <Col xs={6} md={4} lg={2} key={label}>
                    <Card className="brew-recipe-card h-100">
                        <Card.Body>
                            <small>{label}</small>
                            <strong>{value}</strong>
                        </Card.Body>
                    </Card>
                </Col>)}
        </Row>
    </section>
    )
  }
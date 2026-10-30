import { Card, Col, Row } from "react-bootstrap";

export default function BrewDetails({ method }) {
    return (
    <section className="brew-section">
        <div className="brew-section__heading">
            <span className="brew-eyebrow">
                Get to know your cup
            </span>

            <h2>Understanding your brew</h2>
            <p>
                A few small adjustments can make a noticeable difference.
            </p>
        </div>

        <Row className="g-3">
            <Col md={6}>
                <Card className="brew-info-card h-100">
                    <Card.Body>
                        <h3>Choose your roast</h3>
                        <p>{method.roastGuidance}</p>
                        <div className="d-flex flex-wrap gap-2">
                            {method.recommendedRoasts.map(r => 
                                <span className="brew-chip" key={r}>{r}</span>)}
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={6}>
                <Card className="brew-info-card h-100">
                    <Card.Body>
                        <h3>Find the right grind</h3>
                        <p>{method.grindGuidance}</p>
                    </Card.Body>
                </Card>
            </Col>

            <Col xs={12}>
                <Card className="brew-info-card">
                    <Card.Body>
                        <h3>Tips for a better cup</h3>
                        <ul className="brew-tips">
                            {method.tips.map(t => 
                                <li key={t}>{t}</li>)}
                        </ul>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </section>
    );
}

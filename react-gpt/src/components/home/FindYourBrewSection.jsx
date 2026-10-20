import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router";
import { ArrowRight } from "react-bootstrap-icons";

import "./FindYourBrewSection.css"

const brewMethods = [
    {
        id: "v60",
        name: "Pour-Over",
        iconUrl: "/home/v60.png",
        description: "Clean, Bright & Delicate",
        guideLabel: "V60 Brewing Guide"
    },
    {
        id: "french-press",
        name: "French Press",
        iconUrl: "/home/v60.png",
        description: "Rich texture & full-bodied",
        guideLabel: "French Press Brewing Guide"
    },
    {
        id: "moka-pot",
        name: "Moka Pot",
        iconUrl: "/home/v60.png",
        description: "Bold, Balanced yet Concentrated",
        guideLabel: "Moka Pot Brewing Guide"
    },
    {
        id: "roast-levels",
        name: "Roast Levels",
        iconUrl: "/home/v60.png",
        description: "Discover different roasts",
        guideLabel: "Coffee Roast Levels Guide"
    }
]

function FindYourBrewSection() {
    return (
        <section
            className="brew-section"
            aria-labelledby="brew-section-heading">
            
            <Container>
                <Row
                    className="brew-section-header justify-content-between align-items-end">
                    <Col xs={12} md={8}>
                        <p className="brew-section-eyebrow">FIND YOUR BREW</p>
                        <h2 id="brew-section-heading"
                            className="brew-section-heading">Discover the art of specialty coffee</h2>
                        <p className="brew-section-description">
                            From brewing methods to roast levels, we'll help you find what suits your taste.</p>
                    </Col>
                    <Col xs={12} md="auto">
                        <Link
                            to="/brew-guides"
                            className="brew-view-all">
                            Explore all guides
                            <ArrowRight aria-hidden="true" className="ms-2" />
                        </Link>
                    </Col>
                </Row>

                <Row xs={1} sm={2} lg={4}
                    className="brew-cards">

                    {brewMethods.map((method) => (
                        <Col
                            key={method.id}
                            className="brew-card-column">
                            <div
                                className='brew-card h-100'>

                                <Link
                                    to={`/brew-guides/${method.id}`}
                                    className='brew-card'
                                    aria-label={`View ${method.guideLabel}`}>
                                        
                                    <div
                                        className="brew-card-image-wrapper">
                                        <img
                                            src={method.iconUrl}
                                            alt=""
                                            className='brew-card-image'
                                            loading='lazy'/>
                                    </div>
                                    <div
                                        className="brew-card-content">

                                        <h3 className="brew-card-title">
                                            {method.name}
                                        </h3>

                                        <p className="nrew-card-description">
                                            {method.description}
                                        </p>

                                        <span className="brew-card-guide">
                                            Explore guide
                                            <ArrowRight aria-hidden="true" />
                                        </span>

                                    </div>
                                </Link>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}

export default FindYourBrewSection;
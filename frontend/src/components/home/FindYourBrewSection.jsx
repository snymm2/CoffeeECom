import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router";
import { ArrowRight } from "react-bootstrap-icons";

import "./FindYourBrewSection.css"

const brewMethods = [
    {
        id: "pour-over",
        name: "Pour-Over",
        iconUrl: "/home/v60.png",
        description: "Clean, Bright & Delicate",
        guideLabel: "V60 Brewing Guide"
    },
    {
        id: "french-press",
        name: "French Press",
        iconUrl: "/home/FrenchPress.png",
        description: "Rich texture & full-bodied",
        guideLabel: "French Press Brewing Guide"
    },
    {
        id: "moka-pot",
        name: "Moka Pot",
        iconUrl: "/home/MokaPot.png",
        description: "Bold, Balanced yet Concentrated",
        guideLabel: "Moka Pot Brewing Guide"
    },
    {
        id: "roast-levels",
        name: "Roast Levels",
        iconUrl: "/home/RoastLevels.png",
        description: "Discover different roasts",
        guideLabel: "Coffee Roast Levels Guide"
    }
]

function FindYourBrewSection() {
    return (
        <section
            className="find-brew-section"
            aria-labelledby="find-brew-section-heading">
            
            <Container>
                <Row
                    className="find-brew-section-header justify-content-between align-items-end">
                    <Col xs={12} md={8}>
                        <p className="find-brew-section-eyebrow">FIND YOUR BREW</p>
                        <h2 id="find-brew-section-heading"
                            className="find-brew-section-heading">Discover the art of specialty coffee</h2>
                        <p className="find-brew-section-description">
                            From brewing methods to roast levels, we'll help you find what suits your taste.</p>
                    </Col>
                    <Col xs={12} md="auto">
                        <Link
                            to="/brew-guides"
                            className="find-brew-view-all">
                            Explore all guides
                            <ArrowRight aria-hidden="true" className="ms-2" />
                        </Link>
                    </Col>
                </Row>

                <Row xs={1} sm={2} lg={4}
                    className="find-brew-cards">

                    {brewMethods.map((method) => (
                        <Col
                            key={method.id}
                            className="find-brew-card-column">
                            <div
                                className='find-brew-card h-100'>

                                <Link
                                    to={`/brew-guides/${method.id}`}
                                    className='find-brew-card'
                                    aria-label={`View ${method.guideLabel}`}>
                                        
                                    <div
                                        className="find-brew-card-image-wrapper">
                                        <img
                                            src={method.iconUrl}
                                            alt=""
                                            className='find-brew-card-image'
                                            loading='lazy'/>
                                    </div>
                                    <div
                                        className="find-brew-card-content">

                                        <h3 className="find-brew-card-title">
                                            {method.name}
                                        </h3>

                                        <p className="find-brew-card-description">
                                            {method.description}
                                        </p>

                                        <span className="find-brew-card-guide">
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
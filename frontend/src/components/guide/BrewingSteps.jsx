import { Col, Row } from "react-bootstrap";

export default function BrewingSteps({steps}) {
    return (
        <section className="brew-section">
            <div className="brew-section__heading">
                <span className="brew-eyebrow">Brew Along</span>
                <h2>Step By Step</h2>
                <p>Keep this guide with you as you make the coffee.</p>
            </div>

            <div className="brew-steps">
                {steps.map(([title, description, image], i) => 
                    <Row className="g-4 align-items-center brew-step" key={title}>
                        <Col 
                            md={5} 
                            className={i % 2 ? "order-md-2" : ""}>
                            
                            <div className="brew-step__image-wrap">
                                <img 
                                    src={`/storefront/brewing/${image}`} 
                                    alt={title} 
                                    onError={e => e.currentTarget.style.display = "none"} />
                                <span>{String(i + 1).padStart(2, "0")}</span>
                            </div>
                        </Col>

                        <Col 
                            md={7} 
                            className={i % 2 ? "order-md-1" : ""}>
                            
                            <div className="brew-step__copy">
                                <span className="brew-eyebrow">Step {i + 1}</span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        </Col>
                    </Row>)}</div>
        </section>
    )
}
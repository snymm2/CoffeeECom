import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";
import { roastLevels } from "./brewingMethods";
import "./brewing.css";

export default function RoastLevelsPage({ products = [], resolveImageUrl }) {
    return (
    <main className="brewing-page">
        <Container fluid="xl" className="px-3 px-lg-4">
            <nav 
                className="brew-breadcrumb" 
                aria-label="breadcrumb">
                
                <Link to="/">Home</Link>
                <span>/</span>
                
                <Link to="/#brew-guides">Find Your Brew</Link>
                <span>/</span>
                
                <span>Roast Levels</span>
            </nav>

            <section className="roast-hero">
                <span className="brew-eyebrow">Get to know your coffee</span>
                <h1>Understanding roast levels</h1>
                <p>Light, medium, and dark roasts each offer a different flavour experience. None is automatically better — the best roast is the one you enjoy.</p>
            </section>

            <section className="brew-section">
                <div className="brew-section__heading">
                    <span className="brew-eyebrow">From green bean to roasted coffee</span>
                    <h2>What does roasting change?</h2>
                    <p>Roasting develops the aroma, colour, and flavours of green coffee. Origin, variety, processing, and freshness also shape the final cup.</p>
                </div>
                <div className="roast-comparison">
                    {roastLevels.map(r => 
                        <article className="roast-card" key={r.name}>
                            <img 
                                src={r.image} 
                                alt={`${r.name} coffee beans`} 
                                onError={e => e.currentTarget.style.display = "none"} />
                            
                            <div className="roast-card__body">
                                <span className="brew-eyebrow">{r.subtitle}</span>
                                <h3>{r.name}</h3>
                                <p>{r.description}</p>
                                <dl>
                                    <div>
                                        <dt>Common flavour notes</dt>
                                        <dd>{r.flavour}</dd>
                                    </div>
                                    <div>
                                        <dt>Body</dt>
                                        <dd>{r.body}</dd>
                                    </div>
                                    <div>
                                        <dt>Acidity</dt>
                                        <dd>{r.acidity}</dd>
                                    </div>
                                </dl>
                                <div className="d-flex flex-wrap gap-2">
                                    {r.methods.map(m => 
                                    <span className="brew-chip" key={m}>{m}</span>)}
                                </div>
                            </div>
                        </article>)}
                </div>
            </section>

            <section className="brew-section">
                <div className="brew-section__heading">
                    <span className="brew-eyebrow">Choose your starting point</span>
                    <h2>Which roast should you try?</h2>
                    <p>These are suggestions, not strict rules. You can brew any roast with the equipment you have.</p>
                </div>

                <Row className="g-3">
                    <Col md={4}>
                        <Card className="brew-info-card h-100">
                            <Card.Body>
                                <h3>Like bright and delicate?</h3>
                                <p>Try a light roast and pour over. Look for floral, citrus, or fruit notes.</p>
                                <Link to="/brew-guides/pour-over">Learn pour over →</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="brew-info-card h-100">
                            <Card.Body>
                                <h3>Prefer balance?</h3>
                                <p>Start with a medium roast. It is versatile across several brewing methods.</p>
                                <Link to="/brew-guides/french-press">Learn French Press →</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="brew-info-card h-100">
                            <Card.Body>
                                <h3>Enjoy bold flavours?</h3>
                                <p>Try a medium-dark or dark roast with a Moka Pot or French Press.</p>
                                <Link to="/brew-guides/moka-pot">Learn Moka Pot →</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>

            {products.length > 0 && 
                <section className="brew-section">
                    <div className="brew-section__heading">
                        <span className="brew-eyebrow">Find your next cup</span>
                        <h2>Explore our coffee</h2>
                    </div>
                    <Row className="g-3">
                        {products.slice(0, 6).map(p => 
                            <Col xs={6} md={4} lg={2} key={p._id || p.id}>
                                <Card className="brew-product-card h-100">
                                    <Link 
                                        to={`/products/${p._id || p.id}`} 
                                        className="brew-product-card__image">
                                        <img 
                                            src={resolveImageUrl ? resolveImageUrl(p.imageUrl) : p.imageUrl} 
                                            alt={p.name} />
                                    </Link>
                                    <Card.Body>
                                        <Card.Title>{p.name}</Card.Title>
                                        <strong>NRs. {Number(p.price || 0).toLocaleString("en-NP")}</strong>
                                    </Card.Body>
                                </Card>
                            </Col>)}
                    </Row>
                    
                    <div className="text-center mt-4">
                        <Link className="btn btn-dark" to="/shop">Shop all coffee</Link>
                    </div>
                </section>}
        </Container>
    </main>
    );
}

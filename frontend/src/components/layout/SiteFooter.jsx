import { Container, Row, Card, Button, Navbar, Image, Nav, Col } from "react-bootstrap"
import { Instagram, Facebook, Youtube } from "react-bootstrap-icons"
import { Link } from "react-router"

const footerGroups = [
    {
        title: 'Discover',
        links: [
            { label: "Our Farmers", to:"/farmers" },
            { label: "Brew Guides", to: "/brew-guides" },
            { label: "Journal", to: "/journal" },
        ]
    },
    {
        title: 'Shop',
        links: [
            { label: "Coffee", to: "/shop/coffee" },
            { label: "Equipment", to: "/shop/equipment" },
            { label: "Merch", to: "/shop/merch" },
        ]
    },
    {
        title: 'About',
        links: [
            { label: "Our Story", to: "/our-story" },
            { label: "Sustainability", to: "/sustainability" },
            { label: "Contact", to: "/contact" },
        ]
    },

]

function SiteFooter() {

    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <Card
                className="rounded-0 border-0">
                <Card.Img
                    src="/footer/footer_banner.jpg"
                    alt="Footer Banner"
                    style={{ height: "240px", objectFit: "cover" }}
                    className="rounded-0" />
                <Card.ImgOverlay
                    className="d-flex flex-column 
                        align-items-center justify-content-center 
                        text-light text-center"
                    style={{
                        background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55))"
                    }}>
                    <h2 className="h3">Ready to explore Nepalese Coffee?</h2>
                    <p className="mb-0">Join us on a journey from farm to cup</p>
                    <div
                        className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                        <Button as={Link} to="/shop/coffee" variant="light">Shop Now</Button>
                        <Button as={Link} to="/our-story" variant="outline-light">Meet the Farmers</Button>
                    </div>
                </Card.ImgOverlay>
            </Card>
            <div
                className="text-light py-3"
                style={{ backgroundColor: "#3B2A22" }}>
                <Container>
                    <Row
                        className="gy-4">
                            <Col xs={12} md={6} lg={4}>
                                <Link to="/" aria-label="Home Page">
                                    <Image
                                        src="/Logo.png"
                                        alt="Website Logo"
                                        style={{ height: "auto", width: "180px", maxWidth: "100%"}}/>
                                </Link>
                                <p className="mt-3 mb-0">Nepali Coffee, thoughtfully discovered.</p>
                            </Col>
                            {
                                footerGroups.map((group) => (
                                    <Col
                                        key={group.title}
                                        xs={6}
                                        md={3}
                                        lg={2}>
                                            <h3 className="h6 mb-3"
                                                style={{ color: "#D9A17C"}}>{group.title}</h3>
                                            
                                            <Nav
                                                className="flex-column">
                                                    {group.links.map((link) => (
                                                        <Nav.Link
                                                            key={link.to}
                                                            as={Link}
                                                            to={link.to}
                                                            className="text-light px-0 py-1">
                                                                {link.label}
                                                        </Nav.Link>
                                                    ) )}
                                            </Nav>
                                    </Col>
                                ))
                            }
                            <Col
                                xs={12} lg={2}>
                                <h3
                                    className="h6 mb-3"
                                    style={{ color: "#D9A17C" }}>
                                    Follow Us
                                </h3>

                                <div className="d-flex gap-3">
                                    <a
                                        href="https://www.instagram.com/"
                                        aria-label="Instagram"
                                        className="text-light"
                                    >
                                        <Instagram size={22} />
                                    </a>

                                    <a
                                        href="https://www.facebook.com/"
                                        aria-label="Facebook"
                                        className="text-light"
                                    >
                                        <Facebook size={22} />
                                    </a>

                                    <a
                                        href="https://www.youtube.com/"
                                        aria-label="YouTube"
                                        className="text-light"
                                    >
                                        <Youtube size={22} />
                                    </a>
                                </div>
                            </Col>
                    </Row>
                    <Row
                        className="border-top mt-2">
                        <Col xs={12} md={6}>
                            <small>
                                © {currentYear} Code & Coffee.
                                {" "}All Rights Reserved.
                            </small>
                        </Col>
                        <Col xs={12} md={6}
                            className="text-md-end">
                            <small>
                                Nepal · Specialty Coffee · Together
                            </small>
                        </Col>
                    </Row>
                </Container>
            </div>
            
        </footer>
    )
}

export default SiteFooter
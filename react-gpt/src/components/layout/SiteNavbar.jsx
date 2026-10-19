import { useState } from "react";

import { Container, Row, Col, Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';

import { Person, Cart3, List } from "react-bootstrap-icons";

import { Link, NavLink } from "react-dom"

import "./SiteNavbar.css";

const navigationContexts = {
    home: [
        { label: "Our Farmers", to: "/farmers" },
        { label: "Brew Guides", to: "/brew-guides" },
        { label: "Journal", to: "/journal" },
    ],

    shop: [
        { label: "All Products", to: "/shop" },
        { label: "Coffee", to: "/shop/coffee" },
        { label: "Equipment", to: "/shop/equipment" },
        { label: "Merch", to: "/shop/merch" },
    ],

    farmers: [
        { label: "All Farmers", to: "/farmers" },
        { label: "Our Story", to: "/our-story" },
        { label: "Coffee Origins", to: "/coffee-origins" }
    ],

    learning: [
        { label: "Brew Guides", to: "/brew-guides" },
        { label: "Roast Levels", to: "/roast-levels" },
        { label: "Coffee Journal", to: "/journal" }
    ],
};

function SiteNavbar( {context = "home", cartCount = 0}) {
    const [showMenu, setShowMenu] = useState(false);

    const contextualLinks = navigationContexts[context] ?? navigationContexts.home;

    const closeMenu = () => setShowMenu(false);

    return (
        <header
            className="site-header">
                <div
                    className="site-global-bar">
                        <Container fluid="lg">
                            <Row className="align-items-center">
                                <Col xs={7}>
                                    <span className="site-tagline">
                                        Nepal-grown coffee, thoughtfully discovered.
                                    </span>
                                </Col>

                                <Col xs={5}
                                    className="d-flex justify-content-end gap-3">
                                        <Nav.Link
                                            as={Link}
                                            to="/account"
                                            className="site-global-link">
                                                <Person aria-hidden="true"/>
                                                <span className="d-none d-sm-inline">
                                                    Account
                                                </span>
                                        </Nav.Link>

                                        <Nav.Link
                                            as={Link}
                                            to="/cart"
                                            className="site-global-link"
                                            aria-label={`Shopping Cart, ${cartCount} items`}>
                                            <Cart3 aria-hidden="true" />
                                            <span className="d-none d-sm-inline">
                                                Cart
                                            </span>
                                            <span className="site-cart-count">
                                                {cartCount}
                                            </span>
                                        </Nav.Link>
                                </Col>
                            </Row>
                        </Container>
                </div>
                <Navbar className="site-main-nav py-2">
                    <Container fluid="lg">
                        <Button
                            variant="link"
                            className="site-menu-toggle d-lg-none"
                            aria-label="Open Navigation Menu"
                            onClick={() => setShowMenu(true)}>
                                <List size={26} />
                        </Button>

                        <Nav
                            className="site-main-links d-none d-lg-flex">
                                <Nav.Link as={NavLink} to="/discover">
                                    Discover
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/discover">
                                    Shop
                                </Nav.Link>
                        </Nav>

                        <Navbar.Brand as={Link} to="/" className="site-logo mx-auto">
                            <img
                                src="Logo.png"
                                alt="Code & Coffee Home">
                            </img>
                        </Navbar.Brand>

                        <Nav
                            className="site-main-links d-none d-lg-flex">
                            <Nav.Link as={NavLink} to="/our-farmers">
                                Our Farmers
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/brew-guides">
                                Brew Guides
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/journal">
                                Journal
                            </Nav.Link>
                        </Nav>

                        <Button
                            as={Link}
                            to="/cart"
                            variant="link"
                            className="site-mobile-cart d-lg-none"
                            aria-label={`Shopping Cart, ${cartCount} items`}>
                                <Cart3 size={22} />
                                <span className="site-cart-count">{cartCount}</span>
                        </Button>
                    </Container>
                </Navbar>
                <div className="site-context-nav d-none d-lg-block">
                    <Container fluid="lg">
                        <Nav className="justify-content-center">
                            {contextualLinks.map((item) => (
                                <Nav.Link
                                    key={item.to}
                                    as={NavLink}
                                    to={item.to}
                                >
                                    {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                    </Container>
                </div>

                {/* Mobile navigation drawer */}
                <Navbar.Offcanvas
                    show={showMenu}
                    onHide={closeMenu}
                    placement="start"
                    className="site-mobile-drawer"
                    aria-labelledby="site-mobile-menu-title"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="site-mobile-menu-title">
                            Explore Code-n-Coffee
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        <Nav className="flex-column">
                            <Nav.Link
                                as={NavLink}
                                to="/"
                                onClick={closeMenu}
                            >
                                Home
                            </Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to="/shop"
                                onClick={closeMenu}
                            >
                                Shop All
                            </Nav.Link>

                            {contextualLinks.map((item) => (
                                <Nav.Link
                                    key={item.to}
                                    as={NavLink}
                                    to={item.to}
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </Nav.Link>
                            ))}

                            <hr />

                            <Nav.Link
                                as={NavLink}
                                to="/account"
                                onClick={closeMenu}
                            >
                                Account
                            </Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to="/cart"
                                onClick={closeMenu}
                            >
                                Cart ({cartCount})
                            </Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
        </header>
    )
}

export default SiteNavbar
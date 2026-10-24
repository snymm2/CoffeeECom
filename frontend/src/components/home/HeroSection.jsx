import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router";
import "./HeroSection.css"

function HeroSection() {
    const [activeImage, setActiveImage] = useState("farmers")

    const images = {
        farmers: "/home/Hero_Default.jpg",
        coffee: "/home/Hero_Coffee.jpg",
    }

    return (
        <section
            className="hero-section"
            onMouseLeave={() => setActiveImage("farmers")}>
            
            <div
                className="hero-backgrounds">
                
                <img
                    src={images.farmers}
                    alt=""
                    className={`hero-image ${activeImage === "farmers" ? "active" : ""}`} />

                <img
                    src={images.coffee}
                    alt=""
                    className={`hero-image ${activeImage === "coffee" ? "active" : ""}`} />

            </div>

            <div className="hero-overlay"></div>

            <Container className="hero-content">

                <h1>Every Cup <br />has a story.</h1>

                <p>
                    Discover exceptional coffee from Nepal's
                    growing communities, and find new ways
                    to enjoy it.
                </p>

                <div className="d-flex flex-wrap gap-3">
                    <Button
                        as={Link}
                        to="/shop/coffee"
                        variant="light"
                        onMouseEnter={() => setActiveImage("coffee")}
                        onFocus={() => setActiveImage("coffee")}
                        onBlur={() => setActiveImage("farmers")}
                    >
                        Explore the Coffee →
                    </Button>

                    <Button
                        as={Link}
                        to="/farmers"
                        variant="outline-light"
                        onMouseEnter={() => setActiveImage("farmers")}
                        onFocus={() => setActiveImage("farmers")}
                        onBlur={() => setActiveImage("farmers")}
                    >
                        Meet the Farmers →
                    </Button>
                </div>

            </Container>

        </section>
    )
}

export default HeroSection;
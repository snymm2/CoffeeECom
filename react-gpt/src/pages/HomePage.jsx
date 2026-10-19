import { useState } from "react";

import { Container, Image, Row, Card, Button } from "react-bootstrap";

import { Link } from "react-router";

import SiteNavbar from "../components/layout/SiteNavbar";
import HeroSection from "../components/home/HeroSection";
import FeaturedSection from "../components/home/FeaturedSection";

function HomePage() {


    return (
        <>
            <SiteNavbar context="home" cartCount={0} />

            <main>
                <HeroSection />
                <FeaturedSection />
            </main>
        </>
    )
}

export default HomePage;
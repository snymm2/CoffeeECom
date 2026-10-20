import SiteNavbar from "../components/layout/SiteNavbar";
import HeroSection from "../components/home/HeroSection";
import FeaturedSection from "../components/home/FeaturedSection";
import FindYourBrewSection from "../components/home/FindYourBrewSection";
import MeetFarmersSection from "../components/home/MeetFarmersSection";

function HomePage() {


    return (
        <>
            <SiteNavbar context="home" cartCount={0} />

            <main>
                <HeroSection />
                <FeaturedSection />
                <MeetFarmersSection />
                <FindYourBrewSection />
            </main>
        </>
    )
}

export default HomePage;
import { Alert, Container } from "react-bootstrap";
import { Link } from "react-router";
import { brewingMethods } from "./brewingMethods";

import BrewingIntro from "../../components/guide/BrewingIntro";
import QuickRecipe from "../../components/guide/QuickRecipe";
import BrewingVideo from "../../components/guide/BrewingVideo";
import BrewingSteps from "../../components/guide/BrewingSteps";
import BrewDetails from "../../components/guide/BrewDetails";
import Troubleshooting from "../../components/guide/Troubleshooting";
import RelatedVideos from "../../components/guide/RelatedVideos";
import RecommendedProducts from "../../components/guide/RecommendedProducts";

import { resolveProductImageUrl } from "../../helpers/ResolveImageUrl";

import "./brewing.css";

export default function BrewingGuidePage({ method = "pourOver", productIds = []}) {
    const content = brewingMethods[method];

    if (!content) {
        return (
            <Container className="py-5">
                <Alert variant="warning">This brewing guide could not be found.</Alert>
            </Container>
        );
    }

    return (

        <main className="brewing-page">
            <Container fluid="xl" className="px-3 px-lg-4">
                <nav className="brew-breadcrumb" aria-label="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    
                    <Link to="/#brew-guides">Find Your Brew</Link>
                    <span>/</span>

                    <span>{content.title}</span>
                </nav>

                <BrewingIntro method={content} />
                <QuickRecipe recipe={content.recipe} />
                <BrewingVideo videoUrl={content.videoUrl} posterUrl={content.posterUrl} title={content.videoTitle} />
                <BrewingSteps steps={content.steps} />
                <BrewDetails method={content} />
                <Troubleshooting items={content.troubleshooting} />
                <RelatedVideos videos={content.relatedVideos} />
                <RecommendedProducts productIds={productIds} heading={content.productHeading} resolveImageUrl={resolveProductImageUrl} />
                
                <div className="brew-next-link">
                    <p>Want to explore another way to brew?</p>
                    <div className="d-flex flex-wrap gap-3">
                        {Object.entries(brewingMethods).filter(([key]) => key !== method).map(([key, item]) => 
                            <Link key={key} to={`/brew-guides/${item.slug}`}>
                                {item.title} →</Link>)}
                        
                        <Link to="/brew-guides/roast-levels">
                            Explore roast levels →
                        </Link>
                    </div>
                </div>

            </Container>
        </main>
    )
    
  }
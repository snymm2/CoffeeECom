import { Badge } from "react-bootstrap";

export default function BrewingIntro({method}) {
    return (
        <section className="brew-hero">

            <img 
                className="brew-hero__image"
                src={method.heroImage}
                alt={method.heroAlt}
                onError={e => e.currentTarget.style.display = "none"}/>
            
            <div className="brew-hero__shade" />
            <div className="brew-hero__content">
                <span className="brew-eyebrow">
                    {method.eyebrow}
                </span>
                <h1>{method.title}</h1>
                <p>{method.description}</p>
            </div>

            <div className="d-flex flex-wrap gap-2">
                <Badge bg="light" text="dark">{method.difficulty}</Badge>
                <Badge bg="light" text="dark">{method.brewTime}</Badge>
            </div>

        </section>
    )
}
import { Card, Col, Row } from "react-bootstrap";
import { PlayBtnFill } from "react-bootstrap-icons";

export default function RelatedVideos({ videos }) {
    return (
    <section className="brew-section">
        <div className="brew-section__heading">
            <span className="brew-eyebrow">Keep exploring</span>
            <h2>More videos to watch</h2>
            <p>Hand-picked videos from other coffee educators and creators.</p>
        </div>

        <Row className="g-3">
            {videos.map(([title, creator, description, url, thumbnail]) => 
                <Col md={6} key={title}>
                    <Card className="brew-related-card h-100">
                        <a 
                            href={url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="brew-related-card__image-link">
                            
                            <img 
                                src={`/guide/${thumbnail}`} 
                                alt="" 
                                onError={e => e.currentTarget.style.display = "none"} />
                            
                            <span className="brew-play-mark"><PlayBtnFill color="red" size={"4rem"}/></span>
                            
                        </a>
                        
                        <Card.Body>
                            <small>{creator}</small>
                            <Card.Title>{title}</Card.Title>
                            <Card.Text>{description}</Card.Text>
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="brew-text-link">
                                    Watch on YouTube ↗
                            </a>
                        </Card.Body>
                    </Card>
                </Col>)}
        </Row>
    </section>
    );
}

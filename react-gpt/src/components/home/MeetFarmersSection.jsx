import { Container, Row, Col, } from 'react-bootstrap'
import { Link } from 'react-router';
import { ArrowRight } from 'react-bootstrap-icons';

import "./MeetFarmersSection.css"

function MeetFarmersSection() {
    return (
        <section
            className='meet-section'
            aria-labelledby='meet-section-heading'>
            <Container>
                <Row className='meet-section-row align-items-center g-4 g-lg-5'>
                    <Col xs={12} md={6}>
                        <div className='meet-section-image-wrapper'>
                            <img 
                                src="/home/MeetFarmers.jpg"
                                alt="Featured Coffee Farmer"
                                className='meet-section-image'
                                loading='lazy' />
                            
                            <span
                                className='meet-section-image-caption'>
                                    Grown in Nepal. Shared with Care.</span>
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className='meet-section-content'>
                            <p className="meet-section-eyebrow">THE PEOPLE BEHIND THE COFFEE</p>
                            <h2 className="meet-section-heading" id="meet-section-heading">
                                Real People.<br />Remarkable Coffee</h2>
                            <p className='meet-section-intro'>
                                Every cup has a story that begins long before
                                the first sip. Meet the people whose dedication
                                helps bring Nepalese coffee from the farm to
                                your cup.
                            </p>

                            <blockquote className="meet-section-quote">
                                Let us make coffee farming a business of prosperity 
                                for Nepali farmers. Nepal has fertile land, suitable 
                                climate and hardworking farmers.
                            </blockquote>

                            <footer className='meet-section-attribution'>
                                <span className='meet-section-quote-line' />
                                <span>
                                    Min Bohara, 
                                    <small>Saaj Coffee</small>
                                </span>
                            </footer>

                            <Link
                                to="/farmers"
                                className="meet-section-link">
                                Meet the Farmers
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default MeetFarmersSection;
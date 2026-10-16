import { useState } from "react";

import { Card, Button } from "react-bootstrap";

function ProfileCard({
        name = "N/A", 
        occupation, 
        location, 
        description, 
        imageUrl,
        featured = false
    }) {
    
    const [showMoreToggle, setShowMoreToggle] = useState(false)

    function handleShowMoreToggle() {
        setShowMoreToggle(currentValue => !currentValue);
    }

    const profileImageUrl = imageUrl || "/Default_pfp.jpg";

    const subtitleText = [occupation, location]
        .filter(Boolean)
        .join(" | ");

    return (
    <Card border="success" className="h-100 bg-dark text-white text-center p-4">
        <Card.Img
            src={profileImageUrl}
            className="rounded-circle mx-auto mb-2"
            style={{width: "150px", height: "150px"}}
            alt="Profile Picture"></Card.Img>

        <Card.Title className="text-center mb-2">
            { name }
            { featured && (
                <img alt="Featured Badge" 
                    src="/featured-badge.png" 
                    style={{width: "25px", height: "25px"}}></img>
            )}
        </Card.Title>
        
        { subtitleText && (
            <Card.Subtitle className="mb-3 text-white-50">{ subtitleText }</Card.Subtitle>
        )}
        
        { showMoreToggle && description && (
            <Card.Body>{description}</Card.Body>
        )}
        
        <div>
            <Button 
                variant="primary" 
                className="show-more-info-button"
                onClick={ handleShowMoreToggle }
                aria-expanded={ showMoreToggle }>{ showMoreToggle ? "Less Info" : "More Info" }
            </Button>
        </div>
    </Card>
    )
}

export default ProfileCard;
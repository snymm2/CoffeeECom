import { useState } from "react";

import { Card, Button } from "react-bootstrap";

function ProfileCard({name, occupation, location, description, imageUrl = "/Default_pfp.jpg"}) {
    return (
        <Card border="success" className="h-100 bg-dark text-white text-center p-4">
            <Card.Img
                src={imageUrl}
                className="rounded-circle mx-auto mb-2"
                style={{width: "150px", height: "150px"}}
                alt="Profile Picture"></Card.Img>
            <Card.Title className="text-center mb-2">{name}</Card.Title>
            <Card.Subtitle className="mb-3 text-white-50">{occupation} | {location}</Card.Subtitle>
            <Card.Body>{description}</Card.Body>
            <div>
                <Button variant="primary">More Info</Button>
            </div>
        </Card>
    )
}

export default ProfileCard;
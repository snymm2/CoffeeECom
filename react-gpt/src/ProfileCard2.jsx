function ProfileCard2( {name, occupation, location, description, imageUrl = "/Default_pfp.jpg"} ) {
    
    const profileCardStyle = {
        "backgroundColor": "#000",
        "borderRadius": "5%",
        "color": "#fff",
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center",
        "textAlign": "center",
        "padding": "10px",
    }

    const profileCardPictureStyle = {
        "width": "150px",
        "height": "150px",
        "borderRadius": "50%"
    };

    const profileCardTitleStyle = {
        "fontSize": "18px",
        "fontWeight": "bold",
        "margin": "2px"
    }

    const profileCardSubtitleStyle = {
        "fontSize": "15px",
        "fontStyle": "italic"
    }

    const profileCardButtonStyle = {
        "backgroundColor": "blue",
        "borderRadius": "10%",
        "color": "white",
        "border": "none",
        "margin": "5px",
        "padding": "5px 10px 5px 10px"

    }
    
    return (
        <div 
            className="profile-card"
            style={profileCardStyle}>
            <div 
                className="profile-card-picture">
                <img 
                    src={ imageUrl }
                    style={profileCardPictureStyle}></img>
            </div>
            <div 
                className="profile-card-header"
                style={profileCardTitleStyle}>
                <p 
                    className="profile-card-header-title"
                    style={profileCardTitleStyle}>{name}</p>
                <p
                    className="profile-card-header-subtitle"
                    style={profileCardSubtitleStyle}>{occupation} | {location}</p>
            </div>
            <div className="profile-card-body">
                <p>{description}</p>
                <button
                    className="profile-card-body-button"
                    style={profileCardButtonStyle}>More Info</button>
            </div>
        </div>
    )
}

export default ProfileCard2
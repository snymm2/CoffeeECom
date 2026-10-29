import { Card, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router';
import { useCart } from '../../context/CartContext';

function FeaturedCard({productInfo}) {

    const {addToCart} = useCart();

    const {
        id,
        name,
        origin,
        process,
        tastingNotes = [],
        roastLevel,
        price,
        imageUrl
    } = productInfo;

    const fallbackImage = "/storefront/Default_Product_Image.png";

    const formattedPrice = new Intl.NumberFormat("en-NP", {
        maximumFractionDigits: 0
    }).format(price);

    const updatedImageUrl = imageUrl ? imageUrl : fallbackImage;

    return (
        <Card
            className='featured-card h-100'>

            <Link 
                to={`/products/${id}`}
                className='featured-card-image-link'
                aria-label={`View ${name}`}>

                    <div className='featured-card-image-wrapper'>
                        <Card.Img
                            src={updatedImageUrl}
                            alt={name}
                            className='featured-card-image'
                            loading='lazy'
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = fallbackImage;
                            }} />
                    </div>
            </Link>

            <Card.Body className='d-flex flex-column'>
                <div className='d-flex justify-content-between align-items-start gap-2'>
                    <Card.Title className='featured-card-title'>
                        <Link
                            to={`/products/${id}`}
                            className="featured-card-title-link">
                                {name}
                        </Link>
                    </Card.Title>
                    <Badge
                        bg="light"
                        text="dark"
                        className='featured-roast-badge'>
                            {roastLevel}
                    </Badge>
                </div>

                <p className="featured-card-origin">
                    {origin} <span aria-hidden="true">·</span> {process}
                </p>
                
                {tastingNotes && (
                    <div
                        className="featured-tasting-notes"
                        aria-label={`Tasting notes: ${tastingNotes.join(", ")}`}>

                        {tastingNotes.map((note) => (
                            <span key={note}
                                className="featured-tasting-note">
                                {note}
                            </span>
                        ))}
                    </div>
                )}
                

                <div className="featured-card-bottom mt-auto">
                    <p className="featured-card-price">
                        Rs. {formattedPrice}
                    </p>

                    <Button
                        variant="dark"
                        className="w-100"
                        onClick={() => addToCart(productInfo)}>
                        Add to Cart!
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default FeaturedCard;
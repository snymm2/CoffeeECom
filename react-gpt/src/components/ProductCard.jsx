import {Card, Button, Image} from 'react-bootstrap'
import { useCart } from '../context/CartContext';

function ProductCard({ productInfo }) {

    const {addToCart} = useCart();

    const updatedImageUrl = productInfo.imageUrl ? productInfo.imageUrl : "/storefront/Default_Product_Image.png";
    const discountAmount = productInfo.price * productInfo.discountPercent;

    return (

       <Card
            className='shadow rounded-3 card-primary h-100'>
            <div
                className='position-relative'>
                <Card.Img
                    variant='top'
                    src={updatedImageUrl}
                    alt={`${productInfo.name} Product Display`}
                    className='w-100'
                    style={{ objectFit: 'contain', height: "250px" }}
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src="/storefront/Default_Product_Image.png";
                    }} />
                {
                    (productInfo.discountPercent > 0) ? (
                        <Card.ImgOverlay
                            className='d-flex justify-content-end align-items-start'>
                            <Card.Text
                                className='rounded-pill bg-dark text-light px-2'>
                                {`${(productInfo.discountPercent * 100).toFixed(0)}%`}
                            </Card.Text>
                        </Card.ImgOverlay>
                    ) : null
                }
                
            </div>
            <Card.Body
                className='border-top border-2 h-50 d-flex flex-column justify-content-start'>
                <Card.Title
                    className='fw-bold fs-4 text-truncate'>{productInfo.name}</Card.Title>
                <Card.Subtitle>{productInfo.brand}</Card.Subtitle>
                <div>
                    <Card.Img
                        src="/storefront/Rating_Icon.png"
                        alt=""
                        aria-hidden="true"
                        style={{width: "24px", height: "24px"}}>
                    </Card.Img>
                    <span>
                        {` ${productInfo.ratingAvg} (${productInfo.ratingTotal} reviews)`}
                    </span>
                </div>
                <Card.Text className='fs-5 fw-bold'>
                    {
                        (discountAmount > 0) ? (
                            <>
                                {`Rs. ${productInfo.price - discountAmount} `}
                                <span className='text-decoration-line-through'>
                                    {`(${productInfo.price})`}
                                </span>
                            </>         
                        ) : (
                            `Rs. ${productInfo.price} `   
                        )
                    }
                    
                </Card.Text>
                <Button
                    className='d-flex btn-outline text-dark mt-auto mx-auto'
                    onClick={() => addToCart(productInfo)}>
                    <Image
                        src="/storefront/Cart_Icon.png"
                        style={{ width: "24px", height: "24px" }}>
                    </Image>
                    Add to Cart
                </Button>
            </Card.Body>
       </Card>

    )
}

export default ProductCard;
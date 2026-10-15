import {Card, Button, Image} from 'react-bootstrap'

function ProductCard({ productInfo }) {

    const updatedImageUrl = productInfo.imageUrl ? productInfo.imageUrl : "/storefront/Default_Product_Image.png";
    const discountAmount = productInfo.price * productInfo.discountPercent;
    return (
        
       <Card
            className='shadow-sm rounded-3 m-4 card-primary h-100'>
            <div
                className='h-60 position-relative'>
                <Card.Img
                    variant='top'
                    src={updatedImageUrl}
                    alt={`Display Image of ${productInfo.name}`}
                    className='w-100'
                    style={{ objectFit: 'cover' }}>
                </Card.Img>

                {
                    (productInfo.discountPercent > 0) ? (
                        <Card.ImgOverlay
                            className='d-flex justify-content-end align-items-start'>
                            <Card.Text
                                className='rounded-pill bg-dark text-light px-2'>
                                {`${productInfo.discountPercent * 100}%`}
                            </Card.Text>
                        </Card.ImgOverlay>
                    ) : null
                }
                
            </div>
            <Card.Body
                className='border-top border-2 h-40'>
                <Card.Title
                    className='fw-bold fs-4 text-truncate'>{productInfo.name}</Card.Title>
                <Card.Subtitle>{productInfo.brand}</Card.Subtitle>
                <Card.Text
                    className='m-auto'>
                    <Card.Img
                        src="/storefront/Rating_Icon.png"
                        style={{width: "24px", height: "24px"}}>
                    </Card.Img>
                    {` ${productInfo.ratingAvg} (${productInfo.ratingTotal})`}
                </Card.Text>
                <Card.Text
                    className='m-auto fs-5 fw-bold'>
                    {
                        (discountAmount > 0) ? (
                            <>
                                {`Rs. ${productInfo.price} `}
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
                    className='d-flex btn-outline text-dark mt-4 mx-auto'>
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
import {Card, Button, Badge} from 'react-bootstrap'
import { useCart } from '../../context/CartContext';

import { Link } from 'react-router';

import { resolveProductImageUrl } from '../../helpers/ResolveImageUrl';

import "./ProductCard.css"

function ProductCard({ productInfo }) {

    const {addToCart} = useCart();

    const {
        id,
        name,
        brand,
        price,
        discountPercent = 0,
        imageUrl,
        ratingAvg,
        ratingTotal,
        stock,
    } = productInfo;

    const updatedImageUrl = imageUrl ||  "/storefront/Default_Product_Image.png";
    const discount = Math.min(Math.max(discountPercent || 0, 0), 1);
    const discountedPrice = Math.round(price * (1 - discount));
    const hasDiscount = discount > 0;
    const inStock = Number.isFinite(stock) && stock > 0;

    return (

       <Card
            className='product-card h-100'>
            <div className='product-card-image-wrap'>
                <Link
                    to={`/products/${id}`}
                    className='product-card-image-link'
                    aria-label={`View ${name}`}>

                    <Card.Img
                        src={resolveProductImageUrl(updatedImageUrl)}
                        alt={name}
                        className='product-card-image'
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/storefront/Default_Product_Image.png";
                        }} />

                </Link>
                    
                {hasDiscount && (
                    <Badge className='product-card-discount'>
                        {Math.round(discount * 100)}% OFF
                    </Badge>
                )}

                {!inStock && (
                    <div className="product-card-sold-out">
                        Out of stock
                    </div>
                )}
            </div>

            <Card.Body className='product-card-body'>
                <div className='product-card-heading'>
                    <div className='product-card-brand'>{brand}</div>

                    <Card.Title className='product-card-title'>
                        <Link to={`/products/${id}`}>{name}</Link>
                    </Card.Title>
                </div>

                <div className='product-card-rating'>
                    <span aria-hidden="true">★</span>

                    {Number.isFinite(ratingAvg) ? (
                        <span>{ratingAvg.toFixed(1)}</span>
                    ) : (
                        <span>Not yet rated</span>
                    )}

                    {Number.isFinite(ratingTotal) && (
                        <span className="product-card-review-count">
                            ({ratingTotal})
                        </span>
                    )}

                </div>

                <div className="product-card-price">
                    <span className="product-card-current-price">
                        Rs. {discountedPrice.toLocaleString("en-IN")}
                    </span>

                    {hasDiscount && (
                        <span className="product-card-original-price">
                            Rs. {price.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                <div className="product-card-stock">
                    {inStock
                        ? stock <= 5
                            ? `Only ${stock} left`
                            : "In stock"
                        : "Currently unavailable"}
                </div>

                <Button
                    className='product-card-add-button'
                    disabled={!inStock}
                    onClick={() => addToCart({...productInfo, price: discountedPrice})}>
                    {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
            </Card.Body>
       </Card>

    )
}

export default ProductCard;
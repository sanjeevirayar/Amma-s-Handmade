import {
    Heart,
    ShoppingBag,
    Star
} from "lucide-react";

import { Link } from "react-router-dom";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";


function ProductCard({ product }) {

    const { cartItems, addToCart } = useContext(CartContext);

    const stockKnown =
        Number.isInteger(product.stock) && product.stock >= 0;

    const soldOut = stockKnown && product.stock === 0;

    const quantityInBag = cartItems.find(
        (item) => item.productId === product.id
    )?.quantity ?? 0;

    const stockLimitReached =
        stockKnown && !soldOut && quantityInBag >= product.stock;

    const buttonLabel = !stockKnown
        ? "Stock Unconfirmed"
        : soldOut
            ? "Sold Out"
            : stockLimitReached
                ? "Stock Limit Reached"
                : "Add to Bag";
    const { toggleWishlist, isInWishlist } =
        useContext(WishlistContext);

    const isSaved = isInWishlist(product.id);
    return (
        <article className="product-card">

            <div className="product-image-wrapper">

                <Link
                    to={`/product/${product.slug}`}
                    className="product-image-link"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                </Link>


                {product.badge && (
                    <span
                        className={`product-badge badge-${product.badgeType}`}
                    >
                        {product.badge}
                    </span>
                )}


                <button
                    className={`product-wishlist ${isSaved ? "is-saved" : ""}`}
                    type="button"
                    aria-label={
                        isSaved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                    }
                    aria-pressed={isSaved}
                    onClick={() => toggleWishlist(product.id)}
                >
                    <Heart fill={isSaved ? "currentColor" : "none"} />
                </button>

            </div>


            <div className="product-details">

                <span className="product-category">
                    {product.category}
                </span>


                <h3>
                    <Link
                        to={`/product/${product.slug}`}
                    >
                        {product.name}
                    </Link>
                </h3>


                <div className="product-rating">

                    <Star />

                    <span>
                        {product.rating}
                    </span>

                    <span className="review-count">
                        ({product.reviews})
                    </span>

                </div>


                <div className="product-bottom">

                    <div className="product-price">

                        {product.oldPrice && (
                            <span className="old-price">
                                {product.oldPrice}
                            </span>
                        )}

                        <strong>
                            {product.price}
                        </strong>

                    </div>


                    <button
                        className="add-to-bag"
                        type="button"
                        disabled={!stockKnown || soldOut || stockLimitReached}
                        aria-label={`${buttonLabel}: ${product.name}`}
                        onClick={() => addToCart(product.id)}
                    >
                        <ShoppingBag />

                        <span>{buttonLabel}</span>
                    </button>

                </div>

            </div>

        </article>
    );
}


export default ProductCard;
import {
    useContext,
    useEffect,
    useState
} from "react";

import {
    useParams,
    Link
} from "react-router-dom";

import {
    ArrowLeft,
    Heart,
    ShoppingBag,
    Star
} from "lucide-react";

import ProductGallery from "../components/ProductGallery";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";


function ProductDetails() {

    const { slug } = useParams();


    /* =====================================================
       CONTEXT
    ===================================================== */

    const {
        cartItems,
        addToCart
    } = useContext(CartContext);


    const {
        toggleWishlist,
        isInWishlist
    } = useContext(WishlistContext);


    /* =====================================================
       PRODUCT STATE
    ===================================================== */

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD PRODUCT FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const controller =
            new AbortController();


        async function loadProduct() {

            try {

                setLoading(true);
                setError("");
                setProduct(null);


                const response =
                    await fetch(
                        `/api/products/${encodeURIComponent(slug)}`,
                        {
                            signal:
                                controller.signal,
                        }
                    );


                if (response.status === 404) {

                    setError(
                        "Product not found."
                    );

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        "Unable to load product."
                    );

                }


                const data =
                    await response.json();


                setProduct(data);

            } catch (err) {

                if (err.name === "AbortError") {
                    return;
                }


                console.error(
                    "Product loading error:",
                    err
                );


                setError(
                    "We couldn't load this product. Please try again."
                );

            } finally {

                if (!controller.signal.aborted) {
                    setLoading(false);
                }

            }

        }


        loadProduct();


        return () => {

            controller.abort();

        };

    }, [slug]);


    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {

        return (
            <main className="product-page">

                <div className="container">

                    <div className="product-loading">

                        <p>
                            Loading handmade piece...
                        </p>

                    </div>

                </div>

            </main>
        );

    }


    /* =====================================================
       ERROR / PRODUCT NOT FOUND
    ===================================================== */

    if (error || !product) {

        return (
            <main className="product-not-found">

                <div className="container">

                    <h1>
                        {error ||
                            "Product not found."}
                    </h1>


                    <Link to="/shop">

                        <ArrowLeft />

                        Back to Shop

                    </Link>

                </div>

            </main>
        );

    }


    /* =====================================================
       STOCK
    ===================================================== */

    const stockKnown =
        Number.isInteger(product.stock) &&
        product.stock >= 0;


    const soldOut =
        stockKnown &&
        product.stock === 0;


    const stockMessage =
        !stockKnown
            ? "Availability to be confirmed"
            : soldOut
                ? "Sold out"
                : product.stock === 1
                    ? "Only 1 left in stock"
                    : `${product.stock} in stock`;


    const cartItem =
        cartItems.find(
            (item) =>
                item.productId === product.id
        );


    const quantityInBag =
        cartItem?.quantity ?? 0;


    const stockLimitReached =
        stockKnown &&
        !soldOut &&
        quantityInBag >= product.stock;


    /* =====================================================
       WISHLIST
    ===================================================== */

    const isSaved =
        isInWishlist(product.id);


    /* =====================================================
       CARE INFORMATION

       Supports both the older
       careInstructions array and the newer
       MongoDB "care" field.
    ===================================================== */

    const careInstructions =
        Array.isArray(
            product.careInstructions
        )
            ? product.careInstructions

            : product.care
                ? [product.care]

                : [];


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <main className="product-page">

            <div className="container">


                {/* BACK TO SHOP */}

                <Link
                    to="/shop"
                    className="product-back-link"
                >

                    <ArrowLeft />

                    Back to Shop

                </Link>


                <div className="product-page-grid">


                    {/* =================================================
                        PRODUCT IMAGE GALLERY
                    ================================================= */}

                    <ProductGallery
                        key={product.slug}
                        product={product}
                    />


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="product-page-info">


                        {/* CATEGORY */}

                        <span className="section-eyebrow">

                            {product.category}

                        </span>


                        {/* PRODUCT NAME */}

                        <h1>

                            {product.name}

                        </h1>


                        {/* RATING */}

                        {product.rating && (

                            <div className="product-page-rating">

                                <Star />

                                <strong>

                                    {product.rating}

                                </strong>


                                <span>

                                    (
                                    {product.reviews ?? 0}
                                    {" "}
                                    reviews
                                    )

                                </span>

                            </div>

                        )}


                        {/* PRICE */}

                        <div className="product-page-price">

                            {product.oldPrice && (

                                <span className="product-page-old-price">

                                    {product.oldPrice}

                                </span>

                            )}


                            <strong>

                                {product.price}

                            </strong>

                        </div>


                        {/* DESCRIPTION */}

                        <p className="product-page-description">

                            {product.description ||
                                "Carefully handmade by Amma with attention to every detail. Small variations are a natural part of handmade craftsmanship and make every piece unique."}

                        </p>


                        {/* STOCK */}

                        <p
                            className={`product-stock ${
                                soldOut
                                    ? "is-sold-out"
                                    : ""
                            }`}
                            id="product-stock"
                        >

                            {stockMessage}

                        </p>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="product-page-actions">


                            {/* ADD TO BAG */}

                            <button
                                type="button"
                                className="product-page-cart"
                                disabled={
                                    !stockKnown ||
                                    soldOut ||
                                    stockLimitReached
                                }
                                aria-describedby="product-stock"
                                onClick={() =>
                                    addToCart(
                                        product.id
                                    )
                                }
                            >

                                <ShoppingBag />


                                {soldOut
                                    ? "Sold Out"

                                    : !stockKnown
                                        ? "Availability Unconfirmed"

                                        : stockLimitReached
                                            ? "All Available Stock in Bag"

                                            : "Add to Bag"}

                            </button>


                            {/* WISHLIST */}

                            <button
                                type="button"
                                className={`product-page-wishlist ${
                                    isSaved
                                        ? "is-saved"
                                        : ""
                                }`}
                                aria-label={
                                    isSaved
                                        ? `Remove ${product.name} from wishlist`
                                        : `Add ${product.name} to wishlist`
                                }
                                aria-pressed={
                                    isSaved
                                }
                                onClick={() =>
                                    toggleWishlist(
                                        product.id
                                    )
                                }
                            >

                                <Heart
                                    fill={
                                        isSaved
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            </button>

                        </div>


                        {/* CART QUANTITY */}

                        {quantityInBag > 0 && (

                            <p
                                className="product-stock"
                                role="status"
                            >

                                {quantityInBag}
                                {" "}

                                {quantityInBag === 1
                                    ? "of this item is"
                                    : "of this item are"}

                                {" "}
                                in your bag

                            </p>

                        )}


                        {/* =================================================
                            PRODUCT HIGHLIGHTS
                        ================================================= */}

                        <div className="product-highlights">


                            <div className="product-highlight">

                                <span className="product-highlight-symbol">
                                    ♡
                                </span>

                                <span>
                                    Handmade in India
                                </span>

                            </div>


                            <div className="product-highlight">

                                <span className="product-highlight-symbol">
                                    ✦
                                </span>

                                <span>
                                    Small Batch
                                </span>

                            </div>


                            <div className="product-highlight">

                                <span className="product-highlight-symbol">
                                    ◇
                                </span>

                                <span>
                                    One of a Kind
                                </span>

                            </div>


                        </div>


                        {/* =================================================
                            PRODUCT ACCORDIONS
                        ================================================= */}

                        <div className="product-accordions">


                            {/* PRODUCT DETAILS */}

                            <details className="product-accordion">

                                <summary>

                                    <span>
                                        Product Details
                                    </span>

                                    <span className="accordion-plus">
                                        +
                                    </span>

                                </summary>


                                <div className="product-accordion-content">

                                    <p>

                                        {product.description ||
                                            "Each piece is individually handmade by Amma. Small variations in texture, colour and finish are a natural part of handmade craftsmanship."}

                                    </p>


                                    <p>

                                        <strong>
                                            Category:
                                        </strong>

                                        {" "}

                                        {product.category}

                                    </p>


                                    {product.badge && (

                                        <p>

                                            <strong>
                                                Collection:
                                            </strong>

                                            {" "}

                                            {product.badge}

                                        </p>

                                    )}

                                </div>

                            </details>


                            {/* MATERIALS & DIMENSIONS */}

                            <details className="product-accordion">

                                <summary>

                                    <span>
                                        Materials & Dimensions
                                    </span>

                                    <span className="accordion-plus">
                                        +
                                    </span>

                                </summary>


                                <div className="product-accordion-content">


                                    <div className="product-spec-group">

                                        <strong>
                                            Materials
                                        </strong>


                                        {product.materials?.length > 0 ? (

                                            <ul>

                                                {product.materials.map(
                                                    (
                                                        material,
                                                        index
                                                    ) => (

                                                        <li
                                                            key={`${material}-${index}`}
                                                        >

                                                            {material}

                                                        </li>

                                                    )
                                                )}

                                            </ul>

                                        ) : (

                                            <p>
                                                Materials to be confirmed.
                                            </p>

                                        )}

                                    </div>


                                    <div className="product-spec-group">

                                        <strong>
                                            Dimensions
                                        </strong>


                                        <p>

                                            {product.dimensions ||
                                                "Measurements to be confirmed."}

                                        </p>

                                    </div>


                                </div>

                            </details>


                            {/* CARE */}

                            <details className="product-accordion">

                                <summary>

                                    <span>
                                        Care Instructions
                                    </span>

                                    <span className="accordion-plus">
                                        +
                                    </span>

                                </summary>


                                <div className="product-accordion-content">

                                    {careInstructions.length > 0 ? (

                                        <ul>

                                            {careInstructions.map(
                                                (
                                                    instruction,
                                                    index
                                                ) => (

                                                    <li
                                                        key={`${instruction}-${index}`}
                                                    >

                                                        {instruction}

                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    ) : (

                                        <p>
                                            Care instructions to be confirmed for this piece.
                                        </p>

                                    )}

                                </div>

                            </details>


                            {/* SHIPPING */}

                            <details className="product-accordion">

                                <summary>

                                    <span>
                                        Shipping & Returns
                                    </span>

                                    <span className="accordion-plus">
                                        +
                                    </span>

                                </summary>


                                <div className="product-accordion-content">

                                    <p>
                                        Worldwide shipping is available. Shipping charges, estimated delivery times and applicable return conditions will be shown before checkout.
                                    </p>

                                </div>

                            </details>


                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}


export default ProductDetails;
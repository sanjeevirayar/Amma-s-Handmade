import {
    useContext
} from "react";

import {
    Link
} from "react-router-dom";


import ProductCard
    from "../components/ProductCard";

import {
    WishlistContext
} from "../context/WishlistContext";

import {
    ProductContext
} from "../context/ProductContext";


function Wishlist() {

    const {
        wishlistIds
    } = useContext(
        WishlistContext
    );


    const {
        products,
        loading,
        error
    } = useContext(
        ProductContext
    );


    /* =================================================
       SAVED PRODUCTS
    ================================================= */

    const savedProducts =
        products.filter(
            (product) =>
                wishlistIds.includes(
                    product.id
                )
        );


    return (
        <main className="shop-page">

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="shop-page-header">

                    <span className="section-eyebrow">

                        Amma&apos;s Handmade

                    </span>


                    <h1>

                        Your Wishlist

                    </h1>


                    <p>

                        A little collection
                        of things you love.

                    </p>


                    {!loading &&
                        !error && (

                            <span className="shop-product-count">

                                {
                                    savedProducts.length
                                }

                                {" "}

                                {
                                    savedProducts.length ===
                                    1
                                        ? "saved product"
                                        : "saved products"
                                }

                            </span>

                        )}

                </header>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p className="shop-empty">

                        Loading your wishlist...

                    </p>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading &&
                    error && (

                        <p
                            className="shop-empty"
                            role="alert"
                        >

                            {error}

                        </p>

                    )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    savedProducts.length ===
                        0 && (

                        <div className="cart-empty">

                            <p>

                                Your wishlist is
                                empty. Tap a
                                product&apos;s
                                heart to save it
                                here.

                            </p>


                            <Link
                                to="/shop"
                                className="cart-continue"
                            >

                                Explore the shop

                            </Link>

                        </div>

                    )}


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {!loading &&
                    !error &&
                    savedProducts.length >
                        0 && (

                        <div className="shop-product-grid">

                            {savedProducts.map(
                                (product) => (

                                    <ProductCard
                                        key={
                                            product.id
                                        }
                                        product={
                                            product
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

            </div>

        </main>
    );

}


export default Wishlist;
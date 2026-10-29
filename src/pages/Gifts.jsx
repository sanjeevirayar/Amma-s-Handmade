import {
    useContext
} from "react";

import {
    Link
} from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
    ProductContext
} from "../context/ProductContext";


function Gifts() {

    /* =====================================================
       PRODUCTS FROM MONGODB API
    ===================================================== */

    const {
        products,
        loading,
        error
    } = useContext(ProductContext);


    /* =====================================================
       GIFT PRODUCTS
    ===================================================== */

    const giftProducts =
        products.filter(
            (product) => {

                const giftCategory =
                    product.category ===
                    "Gifts";


                const giftCollection =
                    (
                        product.collections ??
                        []
                    ).includes(
                        "Gifts"
                    );


                const hasGiftTags =
                    (
                        product.giftTags ??
                        []
                    ).length > 0;


                return (
                    giftCategory ||
                    giftCollection ||
                    hasGiftTags
                );

            }
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

                        Made for Giving

                    </h1>


                    <p>

                        Thoughtful handmade pieces
                        for special moments and
                        little just-because
                        surprises.

                    </p>


                    {!loading && !error && (

                        <span className="shop-product-count">

                            {
                                giftProducts.length
                            }

                            {" "}

                            {
                                giftProducts.length ===
                                1
                                    ? "gift idea"
                                    : "gift ideas"
                            }

                        </span>

                    )}

                </header>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p className="shop-empty">

                        Loading gift ideas...

                    </p>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

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
                    giftProducts.length === 0 && (

                        <div className="cart-empty">

                            <p>

                                We&apos;re putting
                                together our gift
                                collection. Explore
                                the shop for more
                                handmade finds.

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
                    giftProducts.length > 0 && (

                        <div className="shop-product-grid">

                            {giftProducts.map(
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


export default Gifts;
import {
    useContext,
    useRef
} from "react";

import {
    ArrowLeft,
    ArrowRight
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import ProductCard from "./ProductCard";

import {
    ProductContext
} from "../context/ProductContext";


function BestsellersSection() {

    const carouselRef =
        useRef(null);


    /* =====================================================
       PRODUCTS FROM MONGODB API
    ===================================================== */

    const {
        products,
        loading,
        error
    } = useContext(ProductContext);


    /* =====================================================
       FILTER BESTSELLERS
    ===================================================== */

    const bestsellers =
        products.filter(
            (product) =>
                product.bestseller === true
        );


    /* =====================================================
       CAROUSEL SCROLL
    ===================================================== */

    const scrollProducts =
        (direction) => {

            const carousel =
                carouselRef.current;


            if (!carousel) {
                return;
            }


            const card =
                carousel.querySelector(
                    ".bestseller-card"
                );


            if (!card) {
                return;
            }


            const gap = 22;

            const amount =
                card.offsetWidth + gap;


            carousel.scrollBy({
                left:
                    direction === "left"
                        ? -amount
                        : amount,

                behavior: "smooth",
            });

        };


    return (
        <section className="bestsellers-section">

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="bestsellers-header">

                    <div>

                        <span className="section-eyebrow">

                            Loved Again & Again

                        </span>


                        <h2>

                            Our Bestsellers

                        </h2>


                        <p>

                            The handmade favourites
                            our customers keep coming
                            back for.

                        </p>

                    </div>


                    <div className="bestseller-controls">

                        <button
                            type="button"
                            aria-label="Previous bestsellers"
                            onClick={() =>
                                scrollProducts(
                                    "left"
                                )
                            }
                        >

                            <ArrowLeft />

                        </button>


                        <button
                            type="button"
                            aria-label="Next bestsellers"
                            onClick={() =>
                                scrollProducts(
                                    "right"
                                )
                            }
                        >

                            <ArrowRight />

                        </button>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p className="bestseller-status">

                        Loading bestsellers...

                    </p>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <p
                        className="bestseller-status"
                        role="alert"
                    >

                        {error}

                    </p>

                )}


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {!loading &&
                    !error &&
                    bestsellers.length > 0 && (

                        <div
                            className="bestseller-carousel"
                            ref={carouselRef}
                        >

                            {bestsellers.map(
                                (product) => (

                                    <div
                                        className="bestseller-card"
                                        key={product.id}
                                    >

                                        <ProductCard
                                            product={product}
                                        />

                                    </div>

                                )
                            )}

                        </div>

                    )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading &&
                    !error &&
                    bestsellers.length === 0 && (

                        <p className="bestseller-status">

                            No bestsellers
                            available yet.

                        </p>

                    )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="bestsellers-footer">

                    <Link
                        to="/shop?bestseller=true"
                    >

                        Shop All Bestsellers

                        <ArrowRight />

                    </Link>

                </div>

            </div>

        </section>
    );
}


export default BestsellersSection;
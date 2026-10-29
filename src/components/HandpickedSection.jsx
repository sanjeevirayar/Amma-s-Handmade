import {
    useContext,
    useState
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


function HandpickedSection() {

    const [activeTab, setActiveTab] =
        useState("new");


    /* =====================================================
       PRODUCTS FROM MONGODB API
    ===================================================== */

    const {
        products,
        loading,
        error
    } = useContext(ProductContext);


    /* =====================================================
       FILTER PRODUCTS
    ===================================================== */

    const newArrivals =
        products.filter(
            (product) =>
                product.isNew === true
        );


    const ammasPicks =
        products.filter(
            (product) =>
                product.ammasPick === true
        );


    const displayedProducts =
        activeTab === "new"
            ? newArrivals
            : ammasPicks;


    return (
        <section className="handpicked-section">

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="handpicked-header">

                    <div>

                        <span className="section-eyebrow">
                            Our Favourites
                        </span>

                        <h2>
                            Handpicked Just for You
                        </h2>

                        <p>
                            Discover our newest creations
                            and Amma&apos;s personal picks.
                        </p>

                    </div>


                    <div className="product-section-arrows">

                        <button
                            type="button"
                            aria-label="Previous products"
                        >
                            <ArrowLeft />
                        </button>


                        <button
                            type="button"
                            aria-label="Next products"
                        >
                            <ArrowRight />
                        </button>

                    </div>

                </div>


                {/* =================================================
                    TABS
                ================================================= */}

                <div className="product-tabs">

                    <button
                        type="button"
                        className={
                            activeTab === "new"
                                ? "product-tab active"
                                : "product-tab"
                        }
                        onClick={() =>
                            setActiveTab("new")
                        }
                    >
                        New Arrivals
                    </button>


                    <button
                        type="button"
                        className={
                            activeTab === "picks"
                                ? "product-tab active"
                                : "product-tab"
                        }
                        onClick={() =>
                            setActiveTab("picks")
                        }
                    >
                        Amma&apos;s Picks
                    </button>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p className="handpicked-status">
                        Loading handmade pieces...
                    </p>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <p
                        className="handpicked-status"
                        role="alert"
                    >
                        {error}
                    </p>

                )}


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {!loading && !error && (

                    <div className="handpicked-grid">

                        {displayedProducts.map(
                            (product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading &&
                    !error &&
                    displayedProducts.length === 0 && (

                        <p className="handpicked-status">

                            No products available
                            in this section yet.

                        </p>

                    )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="handpicked-footer">

                    <Link
                        to={
                            activeTab === "new"
                                ? "/shop?new=true"
                                : "/shop?pick=true"
                        }
                    >

                        {activeTab === "new"
                            ? "View All New Arrivals"
                            : "View All Amma's Picks"}

                    </Link>


                    <span>
                        Made with love, always ♡
                    </span>

                </div>


            </div>

        </section>
    );
}


export default HandpickedSection;
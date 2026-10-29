import {
    useContext
} from "react";

import {
    Link
} from "react-router-dom";

import {
    ArrowUpRight
} from "lucide-react";

import {
    ProductContext
} from "../context/ProductContext";


const collectionDefinitions = [
    {
        name: "Crochet Bags",

        image:
            "/images/collections/sunflower-totebag.jpg",
    },

    {
        name: "Macramé Bags",

        image:
            "/images/products/macrame-bags/Cream-Macramé-Fringe-Shoulder-Bag.jpg",
    },

    {
        name: "Crochet Jewellery",

        image:
            "/images/collections/jewellery.jpeg",
    },

    {
        name: "Amigurumi",

        image:
            "/images/collections/puppy-amigurumi.jpg",
    },

    {
        name: "Home Decor",

        image:
            "/images/collections/home-decor.jpg",
    },

    {
        name: "Keychains",

        image:
            "/images/collections/keychains.jpg",
    },

    {
        name: "Accessories",

        image:
            "/images/collections/accessories.jpeg",
    },

    {
        name: "Gifts",

        image:
            "/images/collections/gifts.jpeg",
    },

    {
        name: "Seasonal",

        image:
            "/images/collections/seasonal.jpg",
    },
];


function Collections() {

    /* =====================================================
       PRODUCTS FROM MONGODB API
    ===================================================== */

    const {
        products,
        loading,
        error
    } = useContext(ProductContext);


    /* =====================================================
       COLLECTION PRODUCT COUNTS
    ===================================================== */

    const collections =
        collectionDefinitions.map(
            (collection) => {

                const count =
                    products.filter(
                        (product) => {

                            const matchesCategory =
                                product.category ===
                                collection.name;


                            const matchesCollection =
                                (
                                    product.collections ??
                                    []
                                ).includes(
                                    collection.name
                                );


                            return (
                                matchesCategory ||
                                matchesCollection
                            );

                        }
                    ).length;


                return {
                    ...collection,
                    count,
                };

            }
        );


    return (
        <main className="collections-page">

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="shop-page-header">

                    <span className="section-eyebrow">

                        Amma&apos;s Handmade

                    </span>


                    <h1>

                        Explore Our Collections

                    </h1>


                    <p>

                        Find your favourites,
                        from everyday accessories
                        to little treasures for
                        your home.

                    </p>

                </header>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p className="shop-empty">

                        Loading collections...

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
                    COLLECTION GRID
                ================================================= */}

                {!loading && !error && (

                    <div className="collections-page-grid">

                        {collections.map(
                            (collection) => (

                                <Link
                                    key={
                                        collection.name
                                    }
                                    to={`/shop?category=${encodeURIComponent(
                                        collection.name
                                    )}`}
                                    className="collection-category-card"
                                >

                                    {/* IMAGE */}

                                    <div className="collection-category-image">

                                        <img
                                            src={
                                                collection.image
                                            }
                                            alt={
                                                collection.name
                                            }
                                            loading="lazy"
                                        />

                                    </div>


                                    {/* INFO */}

                                    <div className="collection-category-info">

                                        <div>

                                            <h2>

                                                {
                                                    collection.name
                                                }

                                            </h2>


                                            <p>

                                                {
                                                    collection.count
                                                }

                                                {" "}

                                                {
                                                    collection.count ===
                                                    1
                                                        ? "product"
                                                        : "products"
                                                }

                                            </p>

                                        </div>


                                        <ArrowUpRight
                                            aria-hidden="true"
                                        />

                                    </div>

                                </Link>

                            )
                        )}

                    </div>

                )}

            </div>

        </main>
    );
}


export default Collections;
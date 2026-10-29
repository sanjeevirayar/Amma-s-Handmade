import {
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import ProductCard
    from "../components/ProductCard";

import {
    ProductContext
} from "../context/ProductContext";


function Shop() {

    const [
        searchParams
    ] = useSearchParams();


    const {
        products,
        loading,
        error
    } = useContext(
        ProductContext
    );


    const [
        selectedCategory,
        setSelectedCategory
    ] = useState("All");


    const [
        sortBy,
        setSortBy
    ] = useState(
        "featured"
    );


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const categories =
        useMemo(() => {

            return [
                "All",

                ...new Set([

                    ...products.map(
                        (product) =>
                            product.category
                    ),

                    ...products.flatMap(
                        (product) =>
                            product.collections ??
                            []
                    ),

                    "Macramé Bags",
                    "Gifts",
                    "Seasonal",
                ]),
            ];

        }, [products]);


    /* =====================================================
       URL PARAMETERS
    ===================================================== */

    const requestedCategory =
        searchParams.get(
            "category"
        );


    const searchQuery =
        searchParams.get("q") ??
        "";


    const onlyNew =
        searchParams.get(
            "new"
        ) === "true";


    const onlyBags =
        searchParams.get(
            "group"
        ) === "bags";


    const onlySale =
        searchParams.get(
            "sale"
        ) === "true";


    const onlyPicks =
        searchParams.get(
            "pick"
        ) === "true";


    const onlyBestsellers =
        searchParams.get(
            "bestseller"
        ) === "true";


    const giftTag =
        searchParams.get(
            "gift"
        ) ?? "";


    const query =
        searchQuery
            .trim()
            .toLowerCase();


    /* =====================================================
       UPDATE CATEGORY FROM URL
    ===================================================== */

    useEffect(() => {

        if (
            requestedCategory &&
            categories.includes(
                requestedCategory
            )
        ) {

            setSelectedCategory(
                requestedCategory
            );

        } else {

            setSelectedCategory(
                "All"
            );

        }

    }, [
        requestedCategory,
        categories
    ]);


    /* =====================================================
       FILTER PRODUCTS
    ===================================================== */

    const filteredProducts =
        products.filter(
            (product) => {

                const matchesGift =
                    !giftTag ||
                    (
                        product.giftTags ??
                        []
                    ).includes(
                        giftTag
                    );


                const matchesBestsellers =
                    !onlyBestsellers ||
                    product.bestseller ===
                        true;


                const matchesPicks =
                    !onlyPicks ||
                    product.ammasPick ===
                        true;


                const currentPrice =
                    Number(
                        String(
                            product.price
                        ).replace(
                            /[$,]/g,
                            ""
                        )
                    );


                const previousPrice =
                    product.oldPrice

                        ? Number(
                            String(
                                product.oldPrice
                            ).replace(
                                /[$,]/g,
                                ""
                            )
                        )

                        : null;


                const matchesSale =
                    !onlySale ||
                    (
                        previousPrice !==
                            null &&
                        previousPrice >
                            currentPrice
                    );


                const matchesCategory =
                    selectedCategory ===
                        "All" ||

                    product.category ===
                        selectedCategory ||

                    (
                        product.collections ??
                        []
                    ).includes(
                        selectedCategory
                    );


                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(
                            query
                        ) ||

                    product.category
                        .toLowerCase()
                        .includes(
                            query
                        ) ||

                    (
                        product.collections ??
                        []
                    ).some(
                        (collection) =>
                            collection
                                .toLowerCase()
                                .includes(
                                    query
                                )
                    );


                const matchesNew =
                    !onlyNew ||
                    product.isNew ===
                        true;


                const matchesBags =
                    !onlyBags ||
                    [
                        "Crochet Bags",
                        "Macramé Bags"
                    ].includes(
                        product.category
                    );


                return (
                    matchesCategory &&
                    matchesSearch &&
                    matchesNew &&
                    matchesBags &&
                    matchesSale &&
                    matchesPicks &&
                    matchesBestsellers &&
                    matchesGift
                );

            }
        );


    /* =====================================================
       SORT PRODUCTS
    ===================================================== */

    const sortedProducts =
        [...filteredProducts].sort(
            (a, b) => {

                const priceA =
                    Number(
                        String(
                            a.price
                        ).replace(
                            /[$,]/g,
                            ""
                        )
                    );


                const priceB =
                    Number(
                        String(
                            b.price
                        ).replace(
                            /[$,]/g,
                            ""
                        )
                    );


                if (
                    sortBy ===
                    "price-low"
                ) {

                    return (
                        priceA -
                        priceB
                    );

                }


                if (
                    sortBy ===
                    "price-high"
                ) {

                    return (
                        priceB -
                        priceA
                    );

                }


                if (
                    sortBy ===
                    "name"
                ) {

                    return a.name.localeCompare(
                        b.name
                    );

                }


                return 0;

            }
        );


    /* =====================================================
       PAGE TITLE
    ===================================================== */

    const pageTitle =
        query
            ? "Search Results"

            : giftTag
                ? `Gifts: ${giftTag}`

                : onlyNew
                    ? "New Arrivals"

                    : onlyPicks
                        ? "Amma's Picks"

                        : onlyBestsellers
                            ? "Bestsellers"

                            : onlySale
                                ? "Clearance Sale"

                                : onlyBags
                                    ? "Crochet & Macramé Bags"

                                    : "Shop Handmade";


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <main className="shop-page">

            <div className="container">


                {/* HEADER */}

                <header className="shop-page-header">

                    <span className="section-eyebrow">

                        Amma&apos;s Handmade

                    </span>


                    <h1>

                        {pageTitle}

                    </h1>


                    <p>

                        {query

                            ? `Showing matches for “${searchQuery.trim()}”`

                            : "Discover something lovingly made, for yourself or someone special."
                        }

                    </p>


                    {!loading &&
                        !error && (

                            <span className="shop-product-count">

                                {
                                    filteredProducts.length
                                }

                                {" "}

                                {
                                    filteredProducts.length ===
                                    1
                                        ? "product"
                                        : "products"
                                }

                            </span>

                        )}

                </header>


                {/* LOADING */}

                {loading && (

                    <p className="shop-empty">

                        Loading handmade pieces...

                    </p>

                )}


                {/* ERROR */}

                {!loading &&
                    error && (

                        <p
                            className="shop-empty"
                            role="alert"
                        >

                            {error}

                        </p>

                    )}


                {!loading &&
                    !error && (

                        <>


                            {/* FILTERS */}

                            <div className="shop-filters">

                                <label htmlFor="shop-category">

                                    Category

                                </label>


                                <select
                                    id="shop-category"
                                    value={
                                        selectedCategory
                                    }
                                    onChange={(event) =>
                                        setSelectedCategory(
                                            event.target.value
                                        )
                                    }
                                >

                                    {categories.map(
                                        (
                                            category
                                        ) => (

                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >

                                                {
                                                    category
                                                }

                                            </option>

                                        )
                                    )}

                                </select>


                                <label htmlFor="shop-sort">

                                    Sort by

                                </label>


                                <select
                                    id="shop-sort"
                                    value={
                                        sortBy
                                    }
                                    onChange={(event) =>
                                        setSortBy(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="featured">

                                        Featured

                                    </option>


                                    <option value="price-low">

                                        Price: Low to High

                                    </option>


                                    <option value="price-high">

                                        Price: High to Low

                                    </option>


                                    <option value="name">

                                        Name: A to Z

                                    </option>

                                </select>

                            </div>


                            {/* EMPTY */}

                            {sortedProducts.length ===
                                0 && (

                                <p
                                    className="shop-empty"
                                    role="status"
                                >

                                    No products match your search.
                                    Try another word or choose a
                                    different category.

                                </p>

                            )}


                            {/* PRODUCTS */}

                            <div className="shop-product-grid">

                                {sortedProducts.map(
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

                        </>

                    )}

            </div>

        </main>
    );

}


export default Shop;
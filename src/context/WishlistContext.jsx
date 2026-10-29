import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    ProductContext
} from "./ProductContext";


export const WishlistContext =
    createContext(null);


const WISHLIST_STORAGE_KEY =
    "ammas-handmade-wishlist";


/* =====================================================
   LOAD SAVED WISHLIST
===================================================== */

function loadWishlist() {

    try {

        const savedWishlist =
            localStorage.getItem(
                WISHLIST_STORAGE_KEY
            );


        if (!savedWishlist) {
            return [];
        }


        const parsedWishlist =
            JSON.parse(
                savedWishlist
            );


        if (
            !Array.isArray(
                parsedWishlist
            )
        ) {
            return [];
        }


        /*
           Remove invalid values
           and duplicates.
        */

        return [
            ...new Set(
                parsedWishlist.filter(
                    (productId) =>
                        Number.isInteger(
                            productId
                        )
                )
            ),
        ];

    } catch {

        return [];

    }

}


/* =====================================================
   PROVIDER
===================================================== */

export function WishlistProvider({
    children
}) {

    const {
        products,
        loading,
        error
    } = useContext(ProductContext);


    const [
        wishlistIds,
        setWishlistIds
    ] = useState(
        loadWishlist
    );


    /* =================================================
       VALIDATE AGAINST MONGODB
    ================================================= */

    useEffect(() => {

        if (
            loading ||
            error
        ) {
            return;
        }


        setWishlistIds(
            (currentIds) =>
                currentIds.filter(
                    (productId) =>
                        products.some(
                            (product) =>
                                product.id ===
                                productId
                        )
                )
        );

    }, [
        products,
        loading,
        error
    ]);


    /* =================================================
       SAVE WISHLIST
    ================================================= */

    useEffect(() => {

        try {

            localStorage.setItem(
                WISHLIST_STORAGE_KEY,

                JSON.stringify(
                    wishlistIds
                )
            );

        } catch {

            /*
               Wishlist still works
               in memory.
            */

        }

    }, [wishlistIds]);


    /* =================================================
       TOGGLE PRODUCT
    ================================================= */

    function toggleWishlist(
        productId
    ) {

        const productExists =
            products.some(
                (product) =>
                    product.id ===
                    productId
            );


        if (!productExists) {
            return;
        }


        setWishlistIds(
            (currentIds) =>
                currentIds.includes(
                    productId
                )

                    ? currentIds.filter(
                        (id) =>
                            id !==
                            productId
                    )

                    : [
                        ...currentIds,
                        productId,
                    ]
        );

    }


    /* =================================================
       CHECK PRODUCT
    ================================================= */

    function isInWishlist(
        productId
    ) {

        return wishlistIds.includes(
            productId
        );

    }


    /* =================================================
       CLEAR WISHLIST
    ================================================= */

    function clearWishlist() {

        setWishlistIds([]);

    }


    return (

        <WishlistContext.Provider
            value={{
                wishlistIds,

                wishlistCount:
                    wishlistIds.length,

                toggleWishlist,
                isInWishlist,
                clearWishlist,
            }}
        >

            {children}

        </WishlistContext.Provider>

    );

}
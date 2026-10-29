import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    ProductContext
} from "./ProductContext";


export const CartContext =
    createContext(null);


const CART_STORAGE_KEY =
    "ammas-handmade-cart";


/* =====================================================
   LOAD CART FROM LOCAL STORAGE
===================================================== */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(
                CART_STORAGE_KEY
            );


        if (!savedCart) {

            return [];

        }


        const parsedCart =
            JSON.parse(
                savedCart
            );


        if (
            !Array.isArray(
                parsedCart
            )
        ) {

            return [];

        }


        /*
           Keep only valid cart items.
        */

        return parsedCart.filter(
            (item) =>
                item &&
                Number.isInteger(
                    item.productId
                ) &&
                Number.isInteger(
                    item.quantity
                ) &&
                item.quantity > 0
        );

    } catch (error) {

        console.error(
            "Unable to load cart:",
            error
        );


        return [];

    }

}


/* =====================================================
   CART PROVIDER
===================================================== */

export function CartProvider({
    children
}) {

    /* =================================================
       PRODUCTS FROM MONGODB API
    ================================================= */

    const {
        products,
        loading,
        error
    } = useContext(
        ProductContext
    );


    /* =================================================
       CART STATE
    ================================================= */

    const [
        cartItems,
        setCartItems
    ] = useState(
        loadCart
    );


    /* =================================================
       VALIDATE SAVED CART AGAINST CURRENT PRODUCTS
    ================================================= */

    useEffect(() => {

        /*
           Wait until the product catalogue
           has loaded successfully.
        */

        if (
            loading ||
            error
        ) {

            return;

        }


        setCartItems(
            (currentItems) => {

                const validatedItems =
                    new Map();


                for (
                    const item
                    of currentItems
                ) {

                    const product =
                        products.find(
                            (product) =>
                                product.id ===
                                item.productId
                        );


                    /*
                       Product was removed or
                       disabled in MongoDB.
                    */

                    if (!product) {

                        continue;

                    }


                    /*
                       Do not keep products in
                       the cart unless stock is
                       confirmed and available.
                    */

                    if (
                        !Number.isInteger(
                            product.stock
                        ) ||
                        product.stock <= 0
                    ) {

                        continue;

                    }


                    const previousQuantity =
                        validatedItems.get(
                            product.id
                        ) ?? 0;


                    /*
                       Never allow saved cart
                       quantity to exceed current
                       MongoDB stock.
                    */

                    const safeQuantity =
                        Math.min(
                            previousQuantity +
                                item.quantity,

                            product.stock
                        );


                    validatedItems.set(
                        product.id,
                        safeQuantity
                    );

                }


                return Array.from(
                    validatedItems,
                    (
                        [
                            productId,
                            quantity
                        ]
                    ) => ({
                        productId,
                        quantity,
                    })
                );

            }
        );

    }, [
        products,
        loading,
        error
    ]);


    /* =================================================
       SAVE CART TO LOCAL STORAGE
    ================================================= */

    useEffect(() => {

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,

                JSON.stringify(
                    cartItems
                )
            );

        } catch (error) {

            console.error(
                "Unable to save cart:",
                error
            );

        }

    }, [cartItems]);


    /* =================================================
       ADD PRODUCT TO CART
    ================================================= */

    function addToCart(
        productId
    ) {

        const product =
            products.find(
                (item) =>
                    item.id ===
                    productId
            );


        /*
           Product must exist.
        */

        if (!product) {

            return;

        }


        /*
           Stock must be confirmed
           and greater than zero.
        */

        if (
            !Number.isInteger(
                product.stock
            ) ||
            product.stock <= 0
        ) {

            return;

        }


        setCartItems(
            (currentItems) => {

                const existingItem =
                    currentItems.find(
                        (item) =>
                            item.productId ===
                            productId
                    );


                /*
                   Product already in cart.
                */

                if (existingItem) {

                    /*
                       Do not exceed MongoDB
                       stock quantity.
                    */

                    if (
                        existingItem.quantity >=
                        product.stock
                    ) {

                        return currentItems;

                    }


                    return currentItems.map(
                        (item) =>
                            item.productId ===
                            productId

                                ? {
                                    ...item,

                                    quantity:
                                        item.quantity +
                                        1,
                                }

                                : item
                    );

                }


                /*
                   First time adding product.
                */

                return [
                    ...currentItems,

                    {
                        productId,
                        quantity: 1,
                    },
                ];

            }
        );

    }


    /* =================================================
       DECREASE PRODUCT QUANTITY
    ================================================= */

    function decreaseQuantity(
        productId
    ) {

        setCartItems(
            (currentItems) =>
                currentItems.map(
                    (item) => {

                        if (
                            item.productId !==
                            productId
                        ) {

                            return item;

                        }


                        return {
                            ...item,

                            quantity:
                                Math.max(
                                    1,
                                    item.quantity -
                                        1
                                ),
                        };

                    }
                )
        );

    }


    /* =================================================
       REMOVE PRODUCT FROM CART
    ================================================= */

    function removeFromCart(
        productId
    ) {

        setCartItems(
            (currentItems) =>
                currentItems.filter(
                    (item) =>
                        item.productId !==
                        productId
                )
        );

    }


    /* =================================================
       CLEAR CART

       IMPORTANT:
       This will be called only after
       Razorpay payment has been verified
       successfully by the backend.
    ================================================= */

    function clearCart() {

        setCartItems([]);

    }


    /* =================================================
       CART ITEM COUNT
    ================================================= */

    const cartCount =
        cartItems.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,

            0
        );


    /* =================================================
       CONTEXT
    ================================================= */

    return (

        <CartContext.Provider
            value={{
                cartItems,

                cartCount,

                addToCart,
                decreaseQuantity,
                removeFromCart,
                clearCart,
            }}
        >

            {children}

        </CartContext.Provider>

    );

}
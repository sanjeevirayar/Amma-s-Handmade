import {
    useContext
} from "react";

import {
    Link
} from "react-router-dom";

import {
    Minus,
    Plus,
    ShoppingBag,
    Trash2
} from "lucide-react";

import {
    CartContext
} from "../context/CartContext";

import {
    ProductContext
} from "../context/ProductContext";


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(
    minorUnits,
    currency = "INR"
) {

    const value =
        Number(minorUnits);


    if (
        !Number.isFinite(value)
    ) {

        return "₹0";

    }


    const amount =
        value / 100;


    const hasPaise =
        value % 100 !== 0;


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",

            currency,

            minimumFractionDigits:
                hasPaise
                    ? 2
                    : 0,

            maximumFractionDigits: 2,
        }
    ).format(amount);

}


/* =====================================================
   CART
===================================================== */

function Cart() {

    const {
        cartItems,
        addToCart,
        decreaseQuantity,
        removeFromCart
    } = useContext(
        CartContext
    );


    const {
        products,
        loading,
        error
    } = useContext(
        ProductContext
    );


    /* =================================================
       LOADING
    ================================================= */

    if (loading) {

        return (
            <main className="cart-page">

                <div className="container">

                    <p className="cart-status">

                        Loading your bag...

                    </p>

                </div>

            </main>
        );

    }


    /* =================================================
       PRODUCT ERROR
    ================================================= */

    if (error) {

        return (
            <main className="cart-page">

                <div className="container">

                    <div className="cart-empty">

                        <ShoppingBag />


                        <h1>

                            Unable to load your bag

                        </h1>


                        <p>

                            We couldn&apos;t load the
                            product catalogue right now.

                        </p>


                        <Link
                            to="/shop"
                            className="checkout-primary-button"
                        >

                            Return to Shop

                        </Link>

                    </div>

                </div>

            </main>
        );

    }


    /* =================================================
       BUILD CART PRODUCTS
    ================================================= */

    const cartProducts =
        cartItems
            .map(
                (cartItem) => {

                    const product =
                        products.find(
                            (product) =>
                                product.id ===
                                cartItem.productId
                        );


                    if (!product) {

                        return null;

                    }


                    const unitPriceMinor =
                        Number(
                            product.priceMinor
                        );


                    if (
                        !Number.isInteger(
                            unitPriceMinor
                        ) ||
                        unitPriceMinor < 0
                    ) {

                        return null;

                    }


                    const lineTotalMinor =
                        unitPriceMinor *
                        cartItem.quantity;


                    return {

                        ...product,

                        quantity:
                            cartItem.quantity,

                        unitPriceMinor,

                        lineTotalMinor,

                    };

                }
            )
            .filter(Boolean);


    /* =================================================
       EMPTY CART
    ================================================= */

    if (
        cartProducts.length === 0
    ) {

        return (
            <main className="cart-page">

                <div className="container">

                    <div className="cart-empty">

                        <ShoppingBag />


                        <span className="section-eyebrow">

                            Your Bag

                        </span>


                        <h1>

                            Your bag is empty

                        </h1>


                        <p>

                            Discover something handmade
                            with love by Amma.

                        </p>


                        <Link
                            to="/shop"
                            className="checkout-primary-button"
                        >

                            Explore the Shop

                        </Link>

                    </div>

                </div>

            </main>
        );

    }


    /* =================================================
       CURRENCY

       At the moment all products use INR.
       Later this can use CurrencyContext.
    ================================================= */

    const currency =
        cartProducts[0]
            ?.currency ||
        "INR";


    /* =================================================
       SUBTOTAL
    ================================================= */

    const subtotalMinor =
        cartProducts.reduce(
            (
                total,
                product
            ) =>
                total +
                product.lineTotalMinor,

            0
        );


    /* =================================================
       CART PAGE
    ================================================= */

    return (
        <main className="cart-page">

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="cart-header">

                    <span className="section-eyebrow">

                        Your Bag

                    </span>


                    <h1>

                        Shopping Bag

                    </h1>


                    <p>

                        Review your handmade pieces
                        before checkout.

                    </p>

                </header>


                {/* =================================================
                    CART LAYOUT
                ================================================= */}

                <div className="cart-layout">


                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <section className="cart-items">

                        {cartProducts.map(
                            (
                                product
                            ) => (

                                <article
                                    key={
                                        product.id
                                    }
                                    className="cart-item"
                                >


                                    {/* =========================================
                                        PRODUCT IMAGE
                                    ========================================= */}

                                    <Link
                                        to={
                                            `/product/${product.slug}`
                                        }
                                        className="cart-item-image"
                                    >

                                        <img
                                            src={
                                                product.image
                                            }
                                            alt={
                                                product.name
                                            }
                                        />

                                    </Link>


                                    {/* =========================================
                                        PRODUCT INFORMATION
                                    ========================================= */}

                                    <div className="cart-item-info">


                                        <div className="cart-item-top">

                                            <div>

                                                <span className="cart-item-category">

                                                    {
                                                        product.category
                                                    }

                                                </span>


                                                <Link
                                                    to={
                                                        `/product/${product.slug}`
                                                    }
                                                    className="cart-item-name"
                                                >

                                                    {
                                                        product.name
                                                    }

                                                </Link>

                                            </div>


                                            {/* =================================
                                                REMOVE
                                            ================================= */}

                                            <button
                                                type="button"
                                                className="cart-remove-button"
                                                aria-label={
                                                    `Remove ${product.name}`
                                                }
                                                onClick={() =>
                                                    removeFromCart(
                                                        product.id
                                                    )
                                                }
                                            >

                                                <Trash2 />

                                            </button>

                                        </div>


                                        {/* =====================================
                                            UNIT PRICE
                                        ===================================== */}

                                        <div className="cart-item-price">

                                            {
                                                formatMoney(
                                                    product.unitPriceMinor,
                                                    product.currency
                                                )
                                            }

                                        </div>


                                        {/* =====================================
                                            BOTTOM AREA
                                        ===================================== */}

                                        <div className="cart-item-bottom">


                                            {/* =================================
                                                QUANTITY
                                            ================================= */}

                                            <div className="cart-quantity">

                                                <button
                                                    type="button"
                                                    aria-label="Decrease quantity"
                                                    disabled={
                                                        product.quantity <= 1
                                                    }
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            product.id
                                                        )
                                                    }
                                                >

                                                    <Minus />

                                                </button>


                                                <span>

                                                    {
                                                        product.quantity
                                                    }

                                                </span>


                                                <button
                                                    type="button"
                                                    aria-label="Increase quantity"
                                                    disabled={
                                                        !Number.isInteger(
                                                            product.stock
                                                        ) ||
                                                        product.quantity >=
                                                            product.stock
                                                    }
                                                    onClick={() =>
                                                        addToCart(
                                                            product.id
                                                        )
                                                    }
                                                >

                                                    <Plus />

                                                </button>

                                            </div>


                                            {/* =================================
                                                LINE TOTAL
                                            ================================= */}

                                            <strong className="cart-item-total">

                                                {
                                                    formatMoney(
                                                        product.lineTotalMinor,
                                                        product.currency
                                                    )
                                                }

                                            </strong>

                                        </div>


                                        {/* =====================================
                                            STOCK INFORMATION
                                        ===================================== */}

                                        {Number.isInteger(
                                            product.stock
                                        ) && (

                                            <p className="cart-stock-note">

                                                {product.stock <= 5
                                                    ? `Only ${product.stock} left`
                                                    : "In stock"}

                                            </p>

                                        )}

                                    </div>

                                </article>

                            )
                        )}

                    </section>


                    {/* =================================================
                        ORDER SUMMARY
                    ================================================= */}

                    <aside className="cart-summary">

                        <span className="section-eyebrow">

                            Summary

                        </span>


                        <h2>

                            Order Summary

                        </h2>


                        <div className="cart-summary-row">

                            <span>

                                Subtotal

                            </span>


                            <strong>

                                {
                                    formatMoney(
                                        subtotalMinor,
                                        currency
                                    )
                                }

                            </strong>

                        </div>


                        <div className="cart-summary-row">

                            <span>

                                Shipping

                            </span>


                            <span>

                                Calculated at checkout

                            </span>

                        </div>


                        <div className="cart-summary-divider" />


                        <div className="cart-summary-total">

                            <span>

                                Current Total

                            </span>


                            <strong>

                                {
                                    formatMoney(
                                        subtotalMinor,
                                        currency
                                    )
                                }

                            </strong>

                        </div>


                        <p className="cart-summary-note">

                            Final availability and pricing
                            will be verified securely before
                            payment.

                        </p>


                        {/* =================================================
                            CHECKOUT
                        ================================================= */}

                        <Link
                            to="/checkout"
                            className="checkout-primary-button"
                        >

                            Proceed to Checkout

                        </Link>


                        {/* =================================================
                            CONTINUE SHOPPING
                        ================================================= */}

                        <Link
                            to="/shop"
                            className="cart-continue-shopping"
                        >

                            Continue Shopping

                        </Link>

                    </aside>

                </div>

            </div>

        </main>
    );

}


export default Cart;
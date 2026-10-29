import {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    ShoppingBag
} from "lucide-react";

import {
    CartContext
} from "../context/CartContext";


/* =====================================================
   LOAD RAZORPAY CHECKOUT SCRIPT
===================================================== */

function loadRazorpayScript() {

    return new Promise(
        (resolve) => {

            if (
                window.Razorpay
            ) {

                resolve(true);

                return;

            }


            const existingScript =
                document.getElementById(
                    "razorpay-checkout-script"
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    () =>
                        resolve(
                            Boolean(
                                window.Razorpay
                            )
                        ),
                    {
                        once: true
                    }
                );


                existingScript.addEventListener(
                    "error",
                    () =>
                        resolve(false),
                    {
                        once: true
                    }
                );


                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.id =
                "razorpay-checkout-script";


            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";


            script.async =
                true;


            script.onload =
                () =>
                    resolve(
                        Boolean(
                            window.Razorpay
                        )
                    );


            script.onerror =
                () =>
                    resolve(false);


            document.body.appendChild(
                script
            );

        }
    );

}


/* =====================================================
   SAFE JSON RESPONSE
===================================================== */

async function readJsonResponse(
    response,
    fallbackMessage
) {

    const contentType =
        response.headers.get(
            "content-type"
        );


    if (
        !contentType?.includes(
            "application/json"
        )
    ) {

        const responseText =
            await response.text();


        console.error(
            "Unexpected server response:",
            responseText
        );


        throw new Error(
            fallbackMessage
        );

    }


    return response.json();

}


/* =====================================================
   CHECKOUT
===================================================== */

function Checkout() {

    const navigate =
        useNavigate();


    const {
        cartItems,
        clearCart
    } = useContext(
        CartContext
    );


    /* =====================================================
       STATE
    ===================================================== */

    const [
        quote,
        setQuote
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        quoteError,
        setQuoteError
    ] = useState("");


    const [
        submitError,
        setSubmitError
    ] = useState("");


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        createdOrder,
        setCreatedOrder
    ] = useState(null);


    const [
        paymentProcessing,
        setPaymentProcessing
    ] = useState(false);


    const [
        paymentError,
        setPaymentError
    ] = useState("");


    const [
        paymentSuccess,
        setPaymentSuccess
    ] = useState(null);


    /* =====================================================
       LOAD TRUSTED ORDER QUOTE
    ===================================================== */

    useEffect(() => {

        /*
           After successful payment,
           clearCart() changes cartItems.

           Do not reload checkout.
        */

        if (
            paymentSuccess
        ) {

            return;

        }


        if (
            cartItems.length === 0
        ) {

            setQuote(null);

            setCreatedOrder(null);

            setLoading(false);

            return;

        }


        const controller =
            new AbortController();


        async function loadQuote() {

            try {

                setLoading(true);

                setQuoteError("");

                setSubmitError("");

                setPaymentError("");

                setCreatedOrder(null);

                setQuote(null);


                const response =
                    await fetch(
                        "/api/orders/quote",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify({
                                    items:
                                        cartItems,
                                }),

                            signal:
                                controller.signal,
                        }
                    );


                const data =
                    await readJsonResponse(
                        response,
                        "The server returned an unexpected response while calculating your order."
                    );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to calculate your order."
                    );

                }


                setQuote(data);

            } catch (err) {

                if (
                    err.name ===
                    "AbortError"
                ) {

                    return;

                }


                console.error(
                    "Checkout quote error:",
                    err
                );


                setQuoteError(
                    err.message ||
                    "Unable to calculate your order."
                );

            } finally {

                if (
                    !controller.signal.aborted
                ) {

                    setLoading(false);

                }

            }

        }


        loadQuote();


        return () => {

            controller.abort();

        };

    }, [
        cartItems,
        paymentSuccess
    ]);


    /* =====================================================
       VERIFY PAYMENT
    ===================================================== */

    async function verifyPayment(
        order,
        razorpayResponse
    ) {

        try {

            setPaymentProcessing(true);

            setPaymentError("");


            const response =
                await fetch(
                    "/api/payments/verify",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({

                                orderId:
                                    order.id,

                                razorpay_payment_id:
                                    razorpayResponse
                                        .razorpay_payment_id,

                                razorpay_order_id:
                                    razorpayResponse
                                        .razorpay_order_id,

                                razorpay_signature:
                                    razorpayResponse
                                        .razorpay_signature,

                            }),
                    }
                );


            const data =
                await readJsonResponse(
                    response,
                    "The payment server returned an unexpected response."
                );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to verify payment."
                );

            }


            /*
               The backend has now verified:

               - Razorpay signature
               - Razorpay order ID
               - amount
               - currency
               - captured payment status
            */

            setPaymentSuccess(
                data.order
            );


            /*
               Clear the cart ONLY after
               backend verification.
            */

            clearCart();

        } catch (err) {

            console.error(
                "Payment verification error:",
                err
            );


            setPaymentError(
                err.message ||
                "We couldn't verify your payment."
            );

        } finally {

            setPaymentProcessing(false);

        }

    }


    /* =====================================================
       OPEN RAZORPAY CHECKOUT
    ===================================================== */

    async function openRazorpayPayment(
        order
    ) {

        try {

            if (!order?.id) {

                throw new Error(
                    "A valid order is required before payment."
                );

            }


            setPaymentProcessing(true);

            setPaymentError("");


            /* =================================================
               LOAD CHECKOUT.JS
            ================================================= */

            const scriptLoaded =
                await loadRazorpayScript();


            if (!scriptLoaded) {

                throw new Error(
                    "Razorpay Checkout could not be loaded. Please check your internet connection."
                );

            }


            /* =================================================
               CREATE RAZORPAY ORDER ON BACKEND
            ================================================= */

            const response =
                await fetch(
                    "/api/payments/create",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                orderId:
                                    order.id,
                            }),
                    }
                );


            const paymentData =
                await readJsonResponse(
                    response,
                    "The payment server returned an unexpected response."
                );


            if (!response.ok) {

                throw new Error(
                    paymentData.message ||
                    "Unable to start payment."
                );

            }


            /* =================================================
               RAZORPAY OPTIONS
            ================================================= */

            const options = {

                key:
                    paymentData.keyId,

                amount:
                    paymentData.amount,

                currency:
                    paymentData.currency,

                name:
                    "Amma's Handmade",

                description:
                    `Order ${paymentData.orderNumber}`,

                order_id:
                    paymentData
                        .razorpayOrderId,


                /* =============================================
                   SUCCESS CALLBACK
                ============================================= */

                handler:
                    async function (
                        razorpayResponse
                    ) {

                        await verifyPayment(
                            order,
                            razorpayResponse
                        );

                    },


                /* =============================================
                   PREFILL
                ============================================= */

                prefill: {

                    name:
                        `${paymentData.customer.firstName} ${paymentData.customer.lastName}`,

                    email:
                        paymentData
                            .customer
                            .email,

                    contact:
                        paymentData
                            .customer
                            .phone,

                },


                /* =============================================
                   APPEARANCE
                ============================================= */

                theme: {

                    color:
                        "#C65D4B",

                },


                /* =============================================
                   MODAL EVENTS
                ============================================= */

                modal: {

                    ondismiss:
                        function () {

                            setPaymentProcessing(
                                false
                            );


                            setPaymentError(
                                "Payment was not completed. Your order is still waiting for payment."
                            );

                        },

                },

            };


            /* =================================================
               CREATE RAZORPAY INSTANCE
            ================================================= */

            const razorpay =
                new window.Razorpay(
                    options
                );


            /* =================================================
               PAYMENT FAILURE
            ================================================= */

            razorpay.on(
                "payment.failed",

                function (response) {

                    console.error(
                        "Razorpay payment failed:",
                        response.error
                    );


                    setPaymentProcessing(
                        false
                    );


                    setPaymentError(
                        response.error
                            ?.description ||
                        "Payment failed. Please try again."
                    );

                }
            );


            /* =================================================
               OPEN CHECKOUT
            ================================================= */

            razorpay.open();

        } catch (err) {

            console.error(
                "Razorpay startup error:",
                err
            );


            setPaymentError(
                err.message ||
                "Unable to open secure payment."
            );


            setPaymentProcessing(false);

        }

    }


    /* =====================================================
       CREATE PENDING ORDER
    ===================================================== */

    async function handleSubmit(
        event
    ) {

        event.preventDefault();


        if (
            !quote ||
            submitting ||
            paymentProcessing ||
            createdOrder
        ) {

            return;

        }


        try {

            setSubmitting(true);

            setSubmitError("");

            setPaymentError("");


            const formData =
                new FormData(
                    event.currentTarget
                );


            const checkoutData = {

                customer: {

                    firstName:
                        String(
                            formData.get(
                                "firstName"
                            ) ?? ""
                        ).trim(),

                    lastName:
                        String(
                            formData.get(
                                "lastName"
                            ) ?? ""
                        ).trim(),

                    email:
                        String(
                            formData.get(
                                "email"
                            ) ?? ""
                        ).trim(),

                    phone:
                        String(
                            formData.get(
                                "phone"
                            ) ?? ""
                        ).trim(),

                },


                shippingAddress: {

                    addressLine1:
                        String(
                            formData.get(
                                "addressLine1"
                            ) ?? ""
                        ).trim(),

                    addressLine2:
                        String(
                            formData.get(
                                "addressLine2"
                            ) ?? ""
                        ).trim(),

                    city:
                        String(
                            formData.get(
                                "city"
                            ) ?? ""
                        ).trim(),

                    state:
                        String(
                            formData.get(
                                "state"
                            ) ?? ""
                        ).trim(),

                    postalCode:
                        String(
                            formData.get(
                                "postalCode"
                            ) ?? ""
                        ).trim(),

                    country:
                        String(
                            formData.get(
                                "country"
                            ) ?? ""
                        ).trim(),

                },


                /*
                   Never send trusted price
                   from React.

                   Backend receives only:
                   productId + quantity.
                */

                items:
                    cartItems,

            };


            /* =================================================
               CREATE OUR MONGODB ORDER
            ================================================= */

            const response =
                await fetch(
                    "/api/orders",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                checkoutData
                            ),
                    }
                );


            const data =
                await readJsonResponse(
                    response,
                    "The server returned an unexpected response while creating your order."
                );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to create your order."
                );

            }


            console.log(
                "Order created:",
                data
            );


            const order =
                data.order;


            setCreatedOrder(
                order
            );


            /* =================================================
               IMMEDIATELY OPEN RAZORPAY
            ================================================= */

            await openRazorpayPayment(
                order
            );

        } catch (err) {

            console.error(
                "Checkout order error:",
                err
            );


            setSubmitError(
                err.message ||
                "Unable to create your order."
            );

        } finally {

            setSubmitting(false);

        }

    }


    /* =====================================================
       PAYMENT SUCCESS SCREEN
    ===================================================== */

    if (
        paymentSuccess
    ) {

        return (
            <main className="checkout-page">

                <div className="container checkout-empty">

                    <CheckCircle2 />


                    <span className="section-eyebrow">

                        Payment Confirmed

                    </span>


                    <h1>

                        Thank you for your order.

                    </h1>


                    <p>

                        Your payment has been
                        verified successfully.

                    </p>


                    <p>

                        Order number:
                        {" "}

                        <strong>

                            {
                                paymentSuccess
                                    .orderNumber
                            }

                        </strong>

                    </p>


                    <Link
                        to="/shop"
                        className="checkout-primary-button"
                    >

                        Continue Shopping

                    </Link>

                </div>

            </main>
        );

    }


    /* =====================================================
       EMPTY BAG
    ===================================================== */

    if (
        !loading &&
        cartItems.length === 0
    ) {

        return (
            <main className="checkout-page">

                <div className="container checkout-empty">

                    <ShoppingBag />


                    <h1>

                        Your bag is empty

                    </h1>


                    <p>

                        Add something handmade
                        before heading to checkout.

                    </p>


                    <Link
                        to="/shop"
                        className="checkout-primary-button"
                    >

                        Explore the Shop

                    </Link>

                </div>

            </main>
        );

    }


    /* =====================================================
       CHECKOUT PAGE
    ===================================================== */

    return (
        <main className="checkout-page">

            <div className="container">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    className="checkout-back"
                    onClick={() =>
                        navigate(
                            "/cart"
                        )
                    }
                >

                    <ArrowLeft />

                    Back to Bag

                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="checkout-header">

                    <span className="section-eyebrow">

                        Amma&apos;s Handmade

                    </span>


                    <h1>

                        Checkout

                    </h1>


                    <p>

                        Almost yours. Enter your
                        delivery details below.

                    </p>

                </header>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p className="checkout-status">

                        Confirming prices
                        and availability...

                    </p>

                )}


                {/* =================================================
                    QUOTE ERROR
                ================================================= */}

                {!loading &&
                    quoteError && (

                        <div
                            className="checkout-error"
                            role="alert"
                        >

                            <p>

                                {quoteError}

                            </p>


                            <Link to="/cart">

                                Return to Bag

                            </Link>

                        </div>

                    )}


                {/* =================================================
                    FORM
                ================================================= */}

                {!loading &&
                    !quoteError &&
                    quote && (

                        <form
                            className="checkout-layout"
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* =================================================
                                CUSTOMER + SHIPPING
                            ================================================= */}

                            <div className="checkout-form-column">


                                {/* =================================================
                                    CONTACT
                                ================================================= */}

                                <section className="checkout-card">

                                    <div className="checkout-card-heading">

                                        <span>
                                            01
                                        </span>


                                        <div>

                                            <h2>

                                                Contact

                                            </h2>


                                            <p>

                                                Where can we
                                                reach you about
                                                your order?

                                            </p>

                                        </div>

                                    </div>


                                    <div className="checkout-fields">


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-first-name">

                                                First name

                                            </label>


                                            <input
                                                id="checkout-first-name"
                                                name="firstName"
                                                type="text"
                                                autoComplete="given-name"
                                                maxLength={100}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-last-name">

                                                Last name

                                            </label>


                                            <input
                                                id="checkout-last-name"
                                                name="lastName"
                                                type="text"
                                                autoComplete="family-name"
                                                maxLength={100}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-email">

                                                Email

                                            </label>


                                            <input
                                                id="checkout-email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                maxLength={200}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-phone">

                                                Phone

                                            </label>


                                            <input
                                                id="checkout-phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                maxLength={30}
                                                required
                                            />

                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                                    DELIVERY ADDRESS
                                ================================================= */}

                                <section className="checkout-card">

                                    <div className="checkout-card-heading">

                                        <span>
                                            02
                                        </span>


                                        <div>

                                            <h2>

                                                Delivery Address

                                            </h2>


                                            <p>

                                                Where should Amma
                                                send your handmade
                                                pieces?

                                            </p>

                                        </div>

                                    </div>


                                    <div className="checkout-fields">


                                        <div className="checkout-field checkout-field-full">

                                            <label htmlFor="checkout-address-1">

                                                Address

                                            </label>


                                            <input
                                                id="checkout-address-1"
                                                name="addressLine1"
                                                type="text"
                                                autoComplete="address-line1"
                                                maxLength={250}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field checkout-field-full">

                                            <label htmlFor="checkout-address-2">

                                                Apartment,
                                                suite, etc.

                                                <span>

                                                    Optional

                                                </span>

                                            </label>


                                            <input
                                                id="checkout-address-2"
                                                name="addressLine2"
                                                type="text"
                                                autoComplete="address-line2"
                                                maxLength={250}
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-city">

                                                City

                                            </label>


                                            <input
                                                id="checkout-city"
                                                name="city"
                                                type="text"
                                                autoComplete="address-level2"
                                                maxLength={120}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-state">

                                                State / Region

                                            </label>


                                            <input
                                                id="checkout-state"
                                                name="state"
                                                type="text"
                                                autoComplete="address-level1"
                                                maxLength={120}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-postal">

                                                Postal code

                                            </label>


                                            <input
                                                id="checkout-postal"
                                                name="postalCode"
                                                type="text"
                                                autoComplete="postal-code"
                                                maxLength={30}
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label htmlFor="checkout-country">

                                                Country

                                            </label>


                                            <input
                                                id="checkout-country"
                                                name="country"
                                                type="text"
                                                autoComplete="country-name"
                                                maxLength={120}
                                                required
                                            />

                                        </div>

                                    </div>

                                </section>

                            </div>


                            {/* =================================================
                                ORDER SUMMARY
                            ================================================= */}

                            <aside className="checkout-summary">

                                <span className="section-eyebrow">

                                    Your Order

                                </span>


                                <h2>

                                    Order Summary

                                </h2>


                                {/* =================================================
                                    PRODUCTS
                                ================================================= */}

                                <div className="checkout-summary-products">

                                    {quote.items.map(
                                        (
                                            item
                                        ) => (

                                            <article
                                                className="checkout-summary-product"
                                                key={
                                                    item.productId
                                                }
                                            >

                                                <div className="checkout-summary-image">

                                                    <img
                                                        src={
                                                            item.image
                                                        }
                                                        alt={
                                                            item.name
                                                        }
                                                    />


                                                    <span>

                                                        {
                                                            item.quantity
                                                        }

                                                    </span>

                                                </div>


                                                <div className="checkout-summary-product-info">

                                                    <strong>

                                                        {
                                                            item.name
                                                        }

                                                    </strong>


                                                    <span>

                                                        {
                                                            item.unitPrice
                                                        }

                                                        {" × "}

                                                        {
                                                            item.quantity
                                                        }

                                                    </span>

                                                </div>


                                                <strong className="checkout-summary-line-total">

                                                    {
                                                        item.lineTotal
                                                    }

                                                </strong>

                                            </article>

                                        )
                                    )}

                                </div>


                                {/* =================================================
                                    TOTALS
                                ================================================= */}

                                <div className="checkout-summary-totals">

                                    <div>

                                        <span>

                                            Subtotal

                                        </span>


                                        <strong>

                                            {
                                                quote.subtotal
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>

                                            Shipping

                                        </span>


                                        <span>

                                            Calculated later

                                        </span>

                                    </div>

                                </div>


                                <div className="checkout-summary-total">

                                    <span>

                                        Current Total

                                    </span>


                                    <strong>

                                        {
                                            quote.subtotal
                                        }

                                    </strong>

                                </div>


                                <p className="checkout-summary-note">

                                    Prices and availability
                                    have been verified securely
                                    by Amma&apos;s Handmade.

                                </p>


                                {/* =================================================
                                    ORDER ERROR
                                ================================================= */}

                                {submitError && (

                                    <div
                                        className="checkout-error"
                                        role="alert"
                                    >

                                        <p>

                                            {
                                                submitError
                                            }

                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                    PAYMENT ERROR
                                ================================================= */}

                                {paymentError && (

                                    <div
                                        className="checkout-error"
                                        role="alert"
                                    >

                                        <p>

                                            {
                                                paymentError
                                            }

                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                    PENDING ORDER INFO
                                ================================================= */}

                                {createdOrder && (

                                    <div
                                        className="checkout-order-created"
                                        role="status"
                                    >

                                        <strong>

                                            Order created

                                        </strong>


                                        <p>

                                            Order number:
                                            {" "}

                                            <strong>

                                                {
                                                    createdOrder
                                                        .orderNumber
                                                }

                                            </strong>

                                        </p>


                                        <p>

                                            Your order is
                                            waiting for payment.

                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                    PAYMENT / SUBMIT BUTTON
                                ================================================= */}

                                {createdOrder ? (

                                    <button
                                        type="button"
                                        className="checkout-primary-button"
                                        disabled={
                                            paymentProcessing
                                        }
                                        onClick={() =>
                                            openRazorpayPayment(
                                                createdOrder
                                            )
                                        }
                                    >

                                        {paymentProcessing
                                            ? "Opening Secure Payment..."
                                            : "Pay Securely"}

                                    </button>

                                ) : (

                                    <button
                                        type="submit"
                                        className="checkout-primary-button"
                                        disabled={
                                            submitting ||
                                            paymentProcessing
                                        }
                                    >

                                        {submitting
                                            ? "Preparing Order..."
                                            : paymentProcessing
                                                ? "Opening Secure Payment..."
                                                : "Continue to Payment"}

                                    </button>

                                )}


                                <p className="checkout-payment-note">

                                    {createdOrder
                                        ? "Your order has been created. Complete payment securely through Razorpay."

                                        : "Your payment details are handled securely by Razorpay."}

                                </p>

                            </aside>

                        </form>

                    )}

            </div>

        </main>
    );

}


export default Checkout;
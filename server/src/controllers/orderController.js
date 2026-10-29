import Product from "../models/Product.js";
import Order from "../models/Order.js";


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

        return null;

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
   CREATE ORDER NUMBER
===================================================== */

function createOrderNumber() {

    const timestamp =
        Date.now()
            .toString()
            .slice(-8);


    const random =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return `AMMA-${timestamp}-${random}`;

}


/* =====================================================
   NORMALIZE CART ITEMS
===================================================== */

function normalizeRequestedItems(
    items
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        throw new Error(
            "Your cart is empty."
        );

    }


    const mergedItems =
        new Map();


    for (
        const item
        of items
    ) {

        const productId =
            Number(
                item?.productId
            );


        const quantity =
            Number(
                item?.quantity
            );


        if (
            !Number.isInteger(
                productId
            ) ||
            !Number.isInteger(
                quantity
            ) ||
            quantity <= 0
        ) {

            throw new Error(
                "Your cart contains an invalid item."
            );

        }


        const previousQuantity =
            mergedItems.get(
                productId
            ) ?? 0;


        mergedItems.set(
            productId,
            previousQuantity +
                quantity
        );

    }


    return Array.from(
        mergedItems,
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


/* =====================================================
   BUILD TRUSTED ORDER ITEMS

   IMPORTANT:

   Prices are loaded directly from MongoDB.

   The browser never decides:
   - product price
   - currency
   - line total
   - subtotal
===================================================== */

async function buildRequestedItems(
    items
) {

    const requestedItems =
        normalizeRequestedItems(
            items
        );


    const productIds =
        requestedItems.map(
            (item) =>
                item.productId
        );


    const products =
        await Product.find({
            productId: {
                $in: productIds,
            },

            active: true,
        }).lean();


    /* =================================================
       MAKE PRODUCT LOOKUP MAP
    ================================================= */

    const productMap =
        new Map(
            products.map(
                (product) => [
                    product.productId,
                    product,
                ]
            )
        );


    const trustedItems = [];

    let currency = null;


    /* =================================================
       VALIDATE EVERY PRODUCT
    ================================================= */

    for (
        const requestedItem
        of requestedItems
    ) {

        const product =
            productMap.get(
                requestedItem.productId
            );


        /* =============================================
           PRODUCT EXISTS
        ============================================= */

        if (!product) {

            throw new Error(
                `Product ${requestedItem.productId} is no longer available.`
            );

        }


        /* =============================================
           STOCK MUST BE CONFIRMED
        ============================================= */

        if (
            !Number.isInteger(
                product.stock
            )
        ) {

            throw new Error(
                `Stock for ${product.name} has not been confirmed yet.`
            );

        }


        if (
            product.stock <= 0
        ) {

            throw new Error(
                `${product.name} is sold out.`
            );

        }


        if (
            requestedItem.quantity >
            product.stock
        ) {

            throw new Error(
                `Only ${product.stock} of ${product.name} are available.`
            );

        }


        /* =============================================
           VALIDATE PRICE
        ============================================= */

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

            throw new Error(
                `Price for ${product.name} is not configured correctly.`
            );

        }


        /* =============================================
           VALIDATE CURRENCY
        ============================================= */

        const productCurrency =
            String(
                product.currency ||
                "INR"
            ).toUpperCase();


        if (!currency) {

            currency =
                productCurrency;

        } else if (
            currency !==
            productCurrency
        ) {

            throw new Error(
                "Products with different currencies cannot be purchased together."
            );

        }


        /* =============================================
           CALCULATE TRUSTED LINE TOTAL
        ============================================= */

        const lineTotalMinor =
            unitPriceMinor *
            requestedItem.quantity;


        trustedItems.push({

            productId:
                product.productId,

            productMongoId:
                product._id,

            slug:
                product.slug,

            name:
                product.name,

            image:
                product.image,

            quantity:
                requestedItem.quantity,

            unitPriceMinor,

            lineTotalMinor,

        });

    }


    return {

        items:
            trustedItems,

        currency:
            currency ||
            "INR",

    };

}


/* =====================================================
   CREATE ORDER QUOTE
===================================================== */

export const createOrderQuote =
    async (
        req,
        res
    ) => {

        try {

            const {
                items
            } = req.body;


            const trustedData =
                await buildRequestedItems(
                    items
                );


            const subtotalMinor =
                trustedData.items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.lineTotalMinor,

                    0
                );


            /* =================================================
               FORMAT RESPONSE FOR FRONTEND
            ================================================= */

            const quotedItems =
                trustedData.items.map(
                    (item) => ({

                        productId:
                            item.productId,

                        slug:
                            item.slug,

                        name:
                            item.name,

                        image:
                            item.image,

                        quantity:
                            item.quantity,

                        unitPriceMinor:
                            item.unitPriceMinor,

                        unitPrice:
                            formatMoney(
                                item.unitPriceMinor,
                                trustedData.currency
                            ),

                        lineTotalMinor:
                            item.lineTotalMinor,

                        lineTotal:
                            formatMoney(
                                item.lineTotalMinor,
                                trustedData.currency
                            ),

                    })
                );


            return res.json({

                currency:
                    trustedData.currency,

                items:
                    quotedItems,

                subtotalMinor,

                subtotal:
                    formatMoney(
                        subtotalMinor,
                        trustedData.currency
                    ),

            });

        } catch (error) {

            console.error(
                "Create order quote error:",
                error
            );


            return res
                .status(400)
                .json({
                    message:
                        error.message ||
                        "Unable to calculate your order.",
                });

        }

    };


/* =====================================================
   CREATE REAL PENDING ORDER
===================================================== */

export const createOrder =
    async (
        req,
        res
    ) => {

        try {

            const {
                customer,
                shippingAddress,
                items
            } = req.body;


            /* =================================================
               VALIDATE CUSTOMER
            ================================================= */

            const firstName =
                String(
                    customer?.firstName ??
                    ""
                ).trim();


            const lastName =
                String(
                    customer?.lastName ??
                    ""
                ).trim();


            const email =
                String(
                    customer?.email ??
                    ""
                ).trim();


            const phone =
                String(
                    customer?.phone ??
                    ""
                ).trim();


            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Please complete your contact information.",
                    });

            }


            /* =================================================
               VALIDATE SHIPPING ADDRESS
            ================================================= */

            const addressLine1 =
                String(
                    shippingAddress
                        ?.addressLine1 ??
                    ""
                ).trim();


            const addressLine2 =
                String(
                    shippingAddress
                        ?.addressLine2 ??
                    ""
                ).trim();


            const city =
                String(
                    shippingAddress
                        ?.city ??
                    ""
                ).trim();


            const state =
                String(
                    shippingAddress
                        ?.state ??
                    ""
                ).trim();


            const postalCode =
                String(
                    shippingAddress
                        ?.postalCode ??
                    ""
                ).trim();


            const country =
                String(
                    shippingAddress
                        ?.country ??
                    ""
                ).trim();


            if (
                !addressLine1 ||
                !city ||
                !state ||
                !postalCode ||
                !country
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Please complete your delivery address.",
                    });

            }


            /* =================================================
               RELOAD PRODUCTS + TRUSTED PRICES
            ================================================= */

            const trustedData =
                await buildRequestedItems(
                    items
                );


            const subtotalMinor =
                trustedData.items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.lineTotalMinor,

                    0
                );


            /*
               Shipping and tax remain zero
               until we implement those systems.
            */

            const shippingMinor =
                0;


            const taxMinor =
                0;


            const totalMinor =
                subtotalMinor +
                shippingMinor +
                taxMinor;


            /* =================================================
               CREATE ORDER
            ================================================= */

            const order =
                await Order.create({

                    orderNumber:
                        createOrderNumber(),


                    customer: {

                        firstName,

                        lastName,

                        email,

                        phone,

                    },


                    shippingAddress: {

                        addressLine1,

                        addressLine2,

                        city,

                        state,

                        postalCode,

                        country,

                    },


                    items:
                        trustedData.items,


                    /*
                       INR is now sourced from
                       the MongoDB products.
                    */

                    currency:
                        trustedData.currency,


                    subtotalMinor,

                    shippingMinor,

                    taxMinor,

                    totalMinor,


                    paymentStatus:
                        "pending",

                    orderStatus:
                        "pending",

                });


            /* =================================================
               RETURN SAFE ORDER DATA
            ================================================= */

            return res
                .status(201)
                .json({

                    message:
                        "Order created successfully.",

                    order: {

                        id:
                            order._id,

                        orderNumber:
                            order.orderNumber,

                        currency:
                            order.currency,

                        subtotalMinor:
                            order.subtotalMinor,

                        subtotal:
                            formatMoney(
                                order.subtotalMinor,
                                order.currency
                            ),

                        shippingMinor:
                            order.shippingMinor,

                        taxMinor:
                            order.taxMinor,

                        totalMinor:
                            order.totalMinor,

                        total:
                            formatMoney(
                                order.totalMinor,
                                order.currency
                            ),

                        paymentStatus:
                            order.paymentStatus,

                        orderStatus:
                            order.orderStatus,

                    },

                });

        } catch (error) {

            console.error(
                "Create order error:",
                error
            );


            return res
                .status(400)
                .json({
                    message:
                        error.message ||
                        "Unable to create your order.",
                });

        }

    };
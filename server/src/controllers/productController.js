import Product from "../models/Product.js";


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(
    minorUnits,
    currency = "INR"
) {

    if (
        minorUnits === null ||
        minorUnits === undefined
    ) {
        return null;
    }


    const numericValue =
        Number(minorUnits);


    if (
        !Number.isFinite(
            numericValue
        )
    ) {
        return null;
    }


    const amount =
        numericValue / 100;


    const hasDecimals =
        numericValue % 100 !== 0;


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",

            currency,

            minimumFractionDigits:
                hasDecimals
                    ? 2
                    : 0,

            maximumFractionDigits: 2,
        }
    ).format(amount);

}


/* =====================================================
   FORMAT PRODUCT
===================================================== */

function formatProduct(
    product
) {

    const currency =
        product.currency ||
        "INR";


    const productImages =
        Array.isArray(
            product.images
        ) &&
        product.images.length > 0

            ? product.images

            : Array.isArray(
                product.gallery
            ) &&
            product.gallery.length > 0

                ? product.gallery

                : product.image

                    ? [
                        product.image
                    ]

                    : [];


    return {

        /* =================================================
           BASIC INFORMATION
        ================================================= */

        id:
            product.productId,

        slug:
            product.slug,

        name:
            product.name,

        category:
            product.category,


        /* =================================================
           PRICE
        ================================================= */

        currency,

        priceMinor:
            product.priceMinor,

        price:
            formatMoney(
                product.priceMinor,
                currency
            ),

        oldPriceMinor:
            product.oldPriceMinor ??
            null,

        oldPrice:
            product.oldPriceMinor !==
                null &&
            product.oldPriceMinor !==
                undefined

                ? formatMoney(
                    product.oldPriceMinor,
                    currency
                )

                : null,


        /* =================================================
           REVIEWS
        ================================================= */

        rating:
            product.rating,

        reviews:
            product.reviews,


        /* =================================================
           BADGES
        ================================================= */

        badge:
            product.badge,

        badgeType:
            product.badgeType,


        /* =================================================
           IMAGES
        ================================================= */

        image:
            product.image,

        images:
            productImages,

        gallery:
            productImages,


        /* =================================================
           DETAILS
        ================================================= */

        description:
            product.description,

        materials:
            product.materials ||
            [],

        dimensions:
            product.dimensions ||
            "",

        careInstructions:
            product.careInstructions ||
            [],


        /*
           Temporary compatibility
           with older frontend code.
        */

        care:
            Array.isArray(
                product.careInstructions
            ) &&
            product.careInstructions.length > 0

                ? product
                    .careInstructions
                    .join(" ")

                : null,


        /* =================================================
           INVENTORY
        ================================================= */

        stock:
            product.stock,


        /* =================================================
           COLLECTIONS
        ================================================= */

        collections:
            product.collections ||
            [],

        giftTags:
            product.giftTags ||
            [],


        /* =================================================
           FLAGS
        ================================================= */

        isNew:
            Boolean(
                product.isNewArrival
            ),

        ammasPick:
            Boolean(
                product.ammasPick
            ),

        bestseller:
            Boolean(
                product.bestseller
            ),

    };

}


/* =====================================================
   GET ALL PRODUCTS
===================================================== */

export const getProducts =
    async (
        req,
        res
    ) => {

        try {

            const products =
                await Product.find({
                    active: true,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .lean();


            const formattedProducts =
                products.map(
                    formatProduct
                );


            return res.json(
                formattedProducts
            );

        } catch (error) {

            console.error(
                "Get products error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load products.",
                });

        }

    };


/* =====================================================
   GET PRODUCT BY SLUG
===================================================== */

export const getProductBySlug =
    async (
        req,
        res
    ) => {

        try {

            const product =
                await Product.findOne({
                    slug:
                        req.params.slug,

                    active:
                        true,
                }).lean();


            if (!product) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Product not found.",
                    });

            }


            return res.json(
                formatProduct(
                    product
                )
            );

        } catch (error) {

            console.error(
                "Get product by slug error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load product.",
                });

        }

    };
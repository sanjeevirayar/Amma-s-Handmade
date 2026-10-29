import dotenv from "dotenv";

import connectDB
    from "../config/db.js";

import Product
    from "../models/Product.js";

import products
    from "../data/products.js";


dotenv.config();


async function seedProducts() {

    try {

        await connectDB();


        console.log(
            "Starting product seed..."
        );


        for (
            const product
            of products
        ) {

            const {
                id,
                isNew,
                ...productData
            } = product;


            await Product.findOneAndUpdate(
                {
                    slug:
                        product.slug,
                },
                {
                    /* =========================================
                       SET NEW PRODUCT DATA
                    ========================================= */

                    $set: {

                        ...productData,

                        productId:
                            id,

                        currency:
                            product.currency ||
                            "INR",

                        isNewArrival:
                            Boolean(
                                isNew
                            ),

                        active:
                            true,

                    },


                    /* =========================================
                       REMOVE OLD USD PRICE FIELDS
                    ========================================= */

                    $unset: {

                        price: "",

                        oldPrice: "",

                        care: "",

                    },

                },
                {
                    upsert: true,

                    new: true,

                    runValidators: true,

                    setDefaultsOnInsert: true,
                }
            );


            console.log(
                `Seeded: ${product.name}`
            );

        }


        console.log(
            "Products seeded successfully."
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "Product seed failed:",
            error
        );


        process.exit(1);

    }

}


seedProducts();
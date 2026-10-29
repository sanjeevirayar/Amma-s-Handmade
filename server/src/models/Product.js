import mongoose from "mongoose";


const productSchema =
    new mongoose.Schema(
        {
            productId: {
                type: Number,
                required: true,
                unique: true,
                index: true,
            },


            slug: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                index: true,
            },


            name: {
                type: String,
                required: true,
                trim: true,
            },


            category: {
                type: String,
                required: true,
                trim: true,
            },


            /* =================================================
               PRICING

               All money is stored in the smallest unit.

               INR:
               ₹1 = 100 paise

               Example:
               ₹2,000 = 200000
            ================================================= */

            currency: {
                type: String,
                required: true,
                default: "INR",
                uppercase: true,
                trim: true,
            },


            priceMinor: {
                type: Number,
                required: true,
                min: 0,
            },


            oldPriceMinor: {
                type: Number,
                default: null,
                min: 0,
            },


            /* =================================================
               PRODUCT INFO
            ================================================= */

            rating: {
                type: String,
                default: null,
            },


            reviews: {
                type: Number,
                default: 0,
                min: 0,
            },


            badge: {
                type: String,
                default: null,
            },


            badgeType: {
                type: String,
                default: null,
            },


            image: {
                type: String,
                default: "",
            },


            images: {
                type: [String],
                default: [],
            },


            /*
               Legacy compatibility.

               We can remove gallery later if
               nothing uses it anymore.
            */

            gallery: {
                type: [String],
                default: [],
            },


            description: {
                type: String,
                default: "",
            },


            materials: {
                type: [String],
                default: [],
            },


            dimensions: {
                type: String,
                default: "",
            },


            careInstructions: {
                type: [String],
                default: [],
            },


            collections: {
                type: [String],
                default: [],
            },


            giftTags: {
                type: [String],
                default: [],
            },


            /* =================================================
               STOCK
            ================================================= */

            stock: {
                type: Number,
                default: null,
                min: 0,
            },


            /* =================================================
               FLAGS
            ================================================= */

            isNewArrival: {
                type: Boolean,
                default: false,
            },


            ammasPick: {
                type: Boolean,
                default: false,
            },


            bestseller: {
                type: Boolean,
                default: false,
            },


            active: {
                type: Boolean,
                default: true,
            },
        },
        {
            timestamps: true,
        }
    );


const Product =
    mongoose.model(
        "Product",
        productSchema
    );


export default Product;
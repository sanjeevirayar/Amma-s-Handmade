import express from "express";

import {
    getProducts,
    getProductBySlug
} from "../controllers/productController.js";


const router =
    express.Router();


/* =====================================================
   GET ALL PRODUCTS
===================================================== */

router.get(
    "/",
    getProducts
);


/* =====================================================
   GET PRODUCT BY SLUG
===================================================== */

router.get(
    "/:slug",
    getProductBySlug
);


export default router;
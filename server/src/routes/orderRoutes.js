import express from "express";

import {
    createOrderQuote,
    createOrder
} from "../controllers/orderController.js";


const router =
    express.Router();


router.post(
    "/quote",
    createOrderQuote
);


router.post(
    "/",
    createOrder
);


export default router;
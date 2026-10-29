import express from "express";
import dotenv from "dotenv";

import connectDB
    from "./config/db.js";

import productRoutes
    from "./routes/productRoutes.js";

import orderRoutes
    from "./routes/orderRoutes.js";

import paymentRoutes
    from "./routes/paymentRoutes.js";

import {
    handleRazorpayWebhook
} from "./controllers/webhookController.js";


dotenv.config();


const app =
    express();


const PORT =
    process.env.PORT ||
    3001;


/* =====================================================
   DATABASE
===================================================== */

connectDB();

app.post(
    "/api/webhooks/razorpay",

    express.raw({
        type:
            "application/json",
    }),

    handleRazorpayWebhook
);

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
    express.json()
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/api/health",

    (req, res) => {

        res.json({
            status:
                "ok",

            message:
                "Amma's Handmade backend is running",
        });

    }
);


/* =====================================================
   PRODUCT ROUTES
===================================================== */

app.use(
    "/api/products",
    productRoutes
);


/* =====================================================
   ORDER ROUTES
===================================================== */

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);

/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    "127.0.0.1",

    () => {

        console.log(
            `Backend running at http://127.0.0.1:${PORT}`
        );

    }
);
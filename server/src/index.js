import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename =
    fileURLToPath(
        import.meta.url
    );

const __dirname =
    path.dirname(
        __filename
    );

const frontendDistPath =
    path.resolve(
        __dirname,
        "../../dist"
    );

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
   SERVE REACT FRONTEND
===================================================== */

app.use(
    express.static(
        frontendDistPath
    )
);


/* =====================================================
   REACT ROUTER FALLBACK

   Any normal GET request that is not /api/*
   should return React's index.html.
===================================================== */

app.use(
    (req, res, next) => {

        if (
            req.method !== "GET" ||
            req.path.startsWith("/api/")
        ) {

            return next();

        }


        return res.sendFile(
            path.join(
                frontendDistPath,
                "index.html"
            )
        );

    }
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
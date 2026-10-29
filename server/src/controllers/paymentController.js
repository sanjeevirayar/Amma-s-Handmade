import crypto from "crypto";
import mongoose from "mongoose";

import Product from "../models/Product.js";
import Order from "../models/Order.js";

import {
    getRazorpayClient
} from "../config/razorpay.js";

import {
    sendOrderConfirmationOnce
} from "../services/emailService.js";


/* =====================================================
   CREATE RAZORPAY ORDER
===================================================== */

export const createRazorpayOrder =
    async (
        req,
        res
    ) => {

        try {

            const {
                orderId
            } = req.body;


            /* =================================================
               VALIDATE ORDER ID
            ================================================= */

            if (!orderId) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Order ID is required.",
                    });

            }


            /* =================================================
               LOAD ORDER
            ================================================= */

            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Order not found.",
                    });

            }


            /* =================================================
               ALREADY PAID
            ================================================= */

            if (
                order.paymentStatus ===
                "paid"
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "This order has already been paid.",
                    });

            }


            const {
                razorpay,
                keyId
            } = getRazorpayClient();


            /* =================================================
               REUSE EXISTING RAZORPAY ORDER

               Prevents creating multiple Razorpay orders
               for the same business order.
            ================================================= */

            if (
                order.razorpayOrderId
            ) {

                return res.json({

                    keyId,

                    businessOrderId:
                        order._id,

                    orderNumber:
                        order.orderNumber,

                    razorpayOrderId:
                        order.razorpayOrderId,

                    amount:
                        order.totalMinor,

                    currency:
                        order.currency,

                    customer:
                        order.customer,

                });

            }


            /* =================================================
               CREATE RAZORPAY ORDER

               Amount and currency come only
               from our MongoDB order.
            ================================================= */

            const razorpayOrder =
                await razorpay
                    .orders
                    .create({

                        amount:
                            order.totalMinor,

                        currency:
                            order.currency,

                        receipt:
                            order.orderNumber,

                        notes: {

                            businessOrderId:
                                order
                                    ._id
                                    .toString(),

                            orderNumber:
                                order.orderNumber,

                        },

                    });


            /* =================================================
               SAVE RAZORPAY ORDER ID
            ================================================= */

            order.razorpayOrderId =
                razorpayOrder.id;


            await order.save();


            /* =================================================
               RESPONSE
            ================================================= */

            return res.json({

                keyId,

                businessOrderId:
                    order._id,

                orderNumber:
                    order.orderNumber,

                razorpayOrderId:
                    razorpayOrder.id,

                amount:
                    razorpayOrder.amount,

                currency:
                    razorpayOrder.currency,

                customer:
                    order.customer,

            });

        } catch (error) {

            console.error(
                "Create Razorpay order error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        error?.error
                            ?.description ||
                        "Unable to create payment order.",
                });

        }

    };


/* =====================================================
   VERIFY RAZORPAY PAYMENT
===================================================== */

export const verifyRazorpayPayment =
    async (
        req,
        res
    ) => {

        try {

            const {
                orderId,

                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature

            } = req.body;


            /* =================================================
               VALIDATE REQUEST
            ================================================= */

            if (
                !orderId ||
                !razorpay_payment_id ||
                !razorpay_order_id ||
                !razorpay_signature
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment verification data is incomplete.",
                    });

            }


            /* =================================================
               LOAD ORDER
            ================================================= */

            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Order not found.",
                    });

            }


            /* =================================================
               ALREADY COMPLETELY PROCESSED

               Prevent duplicate inventory deduction.

               We still try the confirmation email in case
               payment was previously processed before the
               email functionality was added.
            ================================================= */

            if (
                order.paymentStatus ===
                    "paid" &&
                order.inventoryAdjusted ===
                    true
            ) {

                try {

                    await sendOrderConfirmationOnce(
                        order._id
                    );

                } catch (emailError) {

                    console.error(
                        "Order already paid, but confirmation email failed:",
                        emailError
                    );

                }


                return res.json({

                    message:
                        "Payment already verified.",

                    order: {

                        id:
                            order._id,

                        orderNumber:
                            order.orderNumber,

                        paymentStatus:
                            order.paymentStatus,

                        orderStatus:
                            order.orderStatus,

                        inventoryAdjusted:
                            order.inventoryAdjusted,

                    },

                });

            }


            /* =================================================
               RAZORPAY ORDER MUST EXIST
            ================================================= */

            if (
                !order.razorpayOrderId
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "No Razorpay order exists for this order.",
                    });

            }


            /* =================================================
               VERIFY RAZORPAY ORDER ID
            ================================================= */

            if (
                razorpay_order_id !==
                order.razorpayOrderId
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment order mismatch.",
                    });

            }


            const {
                razorpay,
                keySecret
            } = getRazorpayClient();


            /* =================================================
               VERIFY SIGNATURE
            ================================================= */

            const signatureBody =
                `${order.razorpayOrderId}|${razorpay_payment_id}`;


            const expectedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        keySecret
                    )
                    .update(
                        signatureBody
                    )
                    .digest(
                        "hex"
                    );


            const expectedBuffer =
                Buffer.from(
                    expectedSignature,
                    "hex"
                );


            const receivedBuffer =
                Buffer.from(
                    razorpay_signature,
                    "hex"
                );


            const signatureValid =
                expectedBuffer.length ===
                    receivedBuffer.length &&

                crypto.timingSafeEqual(
                    expectedBuffer,
                    receivedBuffer
                );


            if (!signatureValid) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment signature verification failed.",
                    });

            }


            /* =================================================
               FETCH PAYMENT DIRECTLY FROM RAZORPAY
            ================================================= */

            const payment =
                await razorpay
                    .payments
                    .fetch(
                        razorpay_payment_id
                    );


            /* =================================================
               VERIFY PAYMENT BELONGS TO ORDER
            ================================================= */

            if (
                payment.order_id !==
                order.razorpayOrderId
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment does not belong to this order.",
                    });

            }


            /* =================================================
               VERIFY AMOUNT
            ================================================= */

            if (
                Number(
                    payment.amount
                ) !==
                Number(
                    order.totalMinor
                )
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment amount does not match the order.",
                    });

            }


            /* =================================================
               VERIFY CURRENCY
            ================================================= */

            if (
                String(
                    payment.currency
                ).toUpperCase() !==
                String(
                    order.currency
                ).toUpperCase()
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment currency does not match the order.",
                    });

            }


            /* =================================================
               PAYMENT MUST BE CAPTURED
            ================================================= */

            if (
                payment.status !==
                "captured"
            ) {

                return res
                    .status(409)
                    .json({
                        message:
                            `Payment is not captured yet. Current status: ${payment.status}`,
                    });

            }


            /* =================================================
               START MONGODB TRANSACTION

               Inside this transaction:

               1. Reload order
               2. Deduct inventory once
               3. Save Razorpay details
               4. Mark paid
               5. Mark confirmed
            ================================================= */

            const session =
                await mongoose.startSession();


            let confirmedOrder;


            try {

                await session.withTransaction(
                    async () => {

                        /* =========================================
                           RELOAD ORDER INSIDE TRANSACTION
                        ========================================= */

                        const transactionOrder =
                            await Order.findById(
                                order._id
                            ).session(
                                session
                            );


                        if (
                            !transactionOrder
                        ) {

                            throw new Error(
                                "Order no longer exists."
                            );

                        }


                        /* =========================================
                           UPDATE INVENTORY ONLY ONCE
                        ========================================= */

                        if (
                            !transactionOrder
                                .inventoryAdjusted
                        ) {

                            for (
                                const item
                                of transactionOrder.items
                            ) {

                                console.log(
                                    "Attempting inventory update:",
                                    {
                                        productId:
                                            item.productId,

                                        productMongoId:
                                            item.productMongoId,

                                        quantity:
                                            item.quantity,
                                    }
                                );


                                const result =
                                    await Product.updateOne(
                                        {
                                            _id:
                                                item.productMongoId,

                                            stock: {
                                                $gte:
                                                    item.quantity,
                                            },
                                        },

                                        {
                                            $inc: {
                                                stock:
                                                    -item.quantity,
                                            },
                                        },

                                        {
                                            session,
                                        }
                                    );


                                console.log(
                                    "Inventory update result:",
                                    {
                                        productId:
                                            item.productId,

                                        matchedCount:
                                            result.matchedCount,

                                        modifiedCount:
                                            result.modifiedCount,
                                    }
                                );


                                if (
                                    result.modifiedCount !==
                                    1
                                ) {

                                    throw new Error(
                                        `Unable to update stock for ${item.name}.`
                                    );

                                }

                            }


                            transactionOrder
                                .inventoryAdjusted =
                                true;

                        }


                        /* =========================================
                           SAVE PAYMENT DETAILS
                        ========================================= */

                        transactionOrder
                            .razorpayPaymentId =
                            razorpay_payment_id;


                        transactionOrder
                            .razorpaySignature =
                            razorpay_signature;


                        /* =========================================
                           MARK ORDER PAID + CONFIRMED
                        ========================================= */

                        transactionOrder
                            .paymentStatus =
                            "paid";


                        transactionOrder
                            .orderStatus =
                            "confirmed";


                        await transactionOrder.save({
                            session,
                        });


                        confirmedOrder =
                            transactionOrder;

                    }
                );

            } catch (
                inventoryError
            ) {

                console.error(
                    "Inventory adjustment error:",
                    inventoryError
                );


                /*
                   Razorpay already confirmed the payment.

                   If inventory handling fails,
                   NEVER mark the payment as unpaid.
                */

                await Order.findByIdAndUpdate(
                    order._id,
                    {
                        razorpayPaymentId:
                            razorpay_payment_id,

                        razorpaySignature:
                            razorpay_signature,

                        paymentStatus:
                            "paid",

                        /*
                           Inventory requires attention,
                           therefore the order stays pending.
                        */

                        orderStatus:
                            "pending",

                        inventoryAdjusted:
                            false,
                    }
                );


                return res
                    .status(409)
                    .json({

                        message:
                            "Payment was received, but inventory could not be finalized. Please contact us with your order number.",

                        orderNumber:
                            order.orderNumber,

                    });

            } finally {

                await session.endSession();

            }


            /* =================================================
               SEND CONFIRMATION EMAIL

               IMPORTANT:

               This is now on the SUCCESS path.

               Email failure must NEVER undo:
               - successful payment
               - stock deduction
               - confirmed order
            ================================================= */

            try {

                const emailResult =
                    await sendOrderConfirmationOnce(
                        confirmedOrder._id
                    );


                console.log(
                    "Confirmation email result:",
                    emailResult
                );

            } catch (emailError) {

                console.error(
                    "Payment succeeded but confirmation email failed:",
                    emailError
                );

            }


            /* =================================================
               SUCCESS RESPONSE
            ================================================= */

            return res.json({

                message:
                    "Payment verified successfully.",

                order: {

                    id:
                        confirmedOrder._id,

                    orderNumber:
                        confirmedOrder
                            .orderNumber,

                    paymentStatus:
                        confirmedOrder
                            .paymentStatus,

                    orderStatus:
                        confirmedOrder
                            .orderStatus,

                    inventoryAdjusted:
                        confirmedOrder
                            .inventoryAdjusted,

                },

            });

        } catch (error) {

            /* =================================================
               OUTER ERROR HANDLER

               Confirmation email logic does NOT belong here.
            ================================================= */

            console.error(
                "Verify Razorpay payment error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to verify payment.",
                });

        }

    };
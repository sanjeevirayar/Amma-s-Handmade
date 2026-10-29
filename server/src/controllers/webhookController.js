import crypto from "crypto";
import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
    sendOrderConfirmationOnce
} from "../services/emailService.js";


/* =====================================================
   VERIFY WEBHOOK SIGNATURE
===================================================== */

function verifyWebhookSignature(
    rawBody,
    receivedSignature
) {

    const secret =
        process.env
            .RAZORPAY_WEBHOOK_SECRET;


    if (!secret) {

        throw new Error(
            "RAZORPAY_WEBHOOK_SECRET is not configured."
        );

    }


    if (
        !Buffer.isBuffer(
            rawBody
        )
    ) {

        return false;

    }


    if (
        !receivedSignature ||
        !/^[0-9a-f]{64}$/i.test(
            receivedSignature
        )
    ) {

        return false;

    }


    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                secret
            )
            .update(
                rawBody
            )
            .digest();


    const receivedBuffer =
        Buffer.from(
            receivedSignature,
            "hex"
        );


    if (
        expectedSignature.length !==
        receivedBuffer.length
    ) {

        return false;

    }


    return crypto.timingSafeEqual(
        expectedSignature,
        receivedBuffer
    );

}


/* =====================================================
   RAZORPAY WEBHOOK
===================================================== */

export const handleRazorpayWebhook =
    async (
        req,
        res
    ) => {

        try {

            /* =================================================
               VERIFY RAW BODY
            ================================================= */

            if (
                !Buffer.isBuffer(
                    req.body
                )
            ) {

                console.error(
                    "Webhook body was not raw."
                );


                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid webhook body.",
                    });

            }


            /* =================================================
               VERIFY SIGNATURE
            ================================================= */

            const signature =
                req.get(
                    "x-razorpay-signature"
                );


            const signatureValid =
                verifyWebhookSignature(
                    req.body,
                    signature
                );


            if (
                !signatureValid
            ) {

                console.error(
                    "Invalid Razorpay webhook signature."
                );


                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid webhook signature.",
                    });

            }


            /* =================================================
               PARSE WEBHOOK ONLY AFTER VERIFICATION
            ================================================= */

            let webhook;


            try {

                webhook =
                    JSON.parse(
                        req.body
                            .toString(
                                "utf8"
                            )
                    );

            } catch {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid webhook JSON.",
                    });

            }


            const eventId =
                req.get(
                    "x-razorpay-event-id"
                );


            console.log(
                "Razorpay webhook received:",
                {
                    eventId,
                    event:
                        webhook.event,
                }
            );


            /* =================================================
               IGNORE EVENTS WE DO NOT USE YET
            ================================================= */

            if (
                webhook.event !==
                "payment.captured"
            ) {

                return res
                    .status(200)
                    .json({
                        message:
                            "Webhook received.",
                    });

            }


            /* =================================================
               GET PAYMENT
            ================================================= */

            const payment =
                webhook
                    ?.payload
                    ?.payment
                    ?.entity;


            if (
                !payment ||
                !payment.id ||
                !payment.order_id
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Payment data is missing.",
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
                    .status(200)
                    .json({
                        message:
                            "Payment is not captured.",
                    });

            }


            /* =================================================
               FIND OUR ORDER USING RAZORPAY ORDER ID
            ================================================= */

            const order =
                await Order.findOne({
                    razorpayOrderId:
                        payment.order_id,
                });


            if (!order) {

                /*
                   This might be a Razorpay payment
                   unrelated to this application.

                   Do not retry forever.
                */

                console.warn(
                    "No Amma's Handmade order found for Razorpay order:",
                    payment.order_id
                );


                return res
                    .status(200)
                    .json({
                        message:
                            "Order not found. Webhook ignored.",
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

                console.error(
                    "Webhook payment amount mismatch:",
                    {
                        razorpayAmount:
                            payment.amount,

                        orderAmount:
                            order.totalMinor,

                        orderNumber:
                            order.orderNumber,
                    }
                );


                return res
                    .status(400)
                    .json({
                        message:
                            "Payment amount mismatch.",
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

                console.error(
                    "Webhook currency mismatch."
                );


                return res
                    .status(400)
                    .json({
                        message:
                            "Payment currency mismatch.",
                    });

            }


            /* =================================================
               ALREADY PROCESSED

               Browser verification may have completed
               before this webhook arrived.
            ================================================= */

            if (
                order.paymentStatus ===
                "paid" &&
                order.inventoryAdjusted ===
                true
            ) {

                console.log(
                    "Webhook already processed:",
                    order.orderNumber
                );


                return res
                    .status(200)
                    .json({
                        message:
                            "Order already processed.",
                    });

            }


            /* =================================================
               TRANSACTION
            ================================================= */

            const session =
                await mongoose.startSession();


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
                           INVENTORY

                           Do this only once.
                        ========================================= */

                        if (
                            !transactionOrder
                                .inventoryAdjusted
                        ) {

                            for (
                                const item
                                of transactionOrder.items
                            ) {

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
                                    "Webhook inventory update:",
                                    {
                                        productId:
                                            item.productId,

                                        quantity:
                                            item.quantity,

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
                           PAYMENT DETAILS
                        ========================================= */

                        transactionOrder
                            .razorpayPaymentId =
                            payment.id;


                        transactionOrder
                            .paymentStatus =
                            "paid";


                        transactionOrder
                            .orderStatus =
                            "confirmed";


                        await transactionOrder.save({
                            session,
                        });

                    }
                );


                console.log(
                    "Webhook completed:",
                    order.orderNumber
                );


                return res
                    .status(200)
                    .json({
                        message:
                            "Webhook processed successfully.",
                    });

            } catch (
            transactionError
            ) {

                console.error(
                    "Webhook transaction failed:",
                    transactionError
                );


                /*
                   Razorpay confirms that payment was captured,
                   but inventory processing failed.

                   Record the payment so we never mistake
                   this for an unpaid order.
                */

                try {

                    await Order.findByIdAndUpdate(
                        order._id,
                        {
                            razorpayPaymentId:
                                payment.id,

                            paymentStatus:
                                "paid",

                            orderStatus:
                                "pending",

                            inventoryAdjusted:
                                false,
                        }
                    );

                } catch (
                updateError
                ) {

                    console.error(
                        "Unable to record captured webhook payment:",
                        updateError
                    );


                    /*
                       Return 500 so Razorpay can retry.
                    */

                    return res
                        .status(500)
                        .json({
                            message:
                                "Webhook processing failed.",
                        });

                }


                /*
                   Payment is recorded but inventory needs
                   manual review.

                   No reason to repeatedly reduce/retry stock.
                */

                return res
                    .status(200)
                    .json({
                        message:
                            "Payment recorded. Inventory requires review.",
                    });

            } finally {

                await session.endSession();

            }

        } catch (error) {

            console.error(
                "Razorpay webhook error:",
                error
            );

            try {

                await sendOrderConfirmationOnce(
                    order._id
                );

            } catch (emailError) {

                console.error(
                    "Webhook payment succeeded but confirmation email failed:",
                    emailError
                );

            }


            return res
                .status(500)
                .json({
                    message:
                        "Webhook processing failed.",
                });

        }

    };
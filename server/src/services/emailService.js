import { Resend } from "resend";
import Order from "../models/Order.js";


let resendClient = null;


/* =====================================================
   GET RESEND CLIENT
===================================================== */

function getResendClient() {

    const apiKey =
        process.env.RESEND_API_KEY;


    if (!apiKey) {

        throw new Error(
            "RESEND_API_KEY is not configured."
        );

    }


    if (!resendClient) {

        resendClient =
            new Resend(
                apiKey
            );

    }


    return resendClient;

}


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(
    minorUnits,
    currency = "INR"
) {

    const value =
        Number(
            minorUnits
        );


    if (
        !Number.isFinite(
            value
        )
    ) {

        return "";

    }


    return new Intl.NumberFormat(
        "en-IN",
        {
            style:
                "currency",

            currency,

            maximumFractionDigits:
                2,
        }
    ).format(
        value / 100
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   SEND ORDER CONFIRMATION
===================================================== */

export async function sendOrderConfirmation(
    order
) {

    const resend =
        getResendClient();


    const from =
        process.env
            .ORDER_EMAIL_FROM ||
        "Amma's Handmade <onboarding@resend.dev>";


    const itemRows =
        order.items
            .map(
                (item) => {

                    return `
                        <tr>
                            <td style="
                                padding:12px 0;
                                border-bottom:1px solid #eeeeee;
                            ">
                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <br />

                                <span style="
                                    color:#666666;
                                    font-size:14px;
                                ">
                                    Qty: ${item.quantity}
                                </span>
                            </td>

                            <td
                                align="right"
                                style="
                                    padding:12px 0;
                                    border-bottom:1px solid #eeeeee;
                                "
                            >
                                ${formatMoney(
                                    item.lineTotalMinor,
                                    order.currency
                                )}
                            </td>
                        </tr>
                    `;

                }
            )
            .join("");


    const shippingAddress =
        order.shippingAddress;


    const html = `
        <!DOCTYPE html>

        <html>

            <body
                style="
                    margin:0;
                    padding:0;
                    background:#f7f4ef;
                    font-family:Arial, Helvetica, sans-serif;
                    color:#332f2b;
                "
            >

                <div
                    style="
                        max-width:620px;
                        margin:0 auto;
                        padding:40px 20px;
                    "
                >

                    <div
                        style="
                            background:#ffffff;
                            border-radius:16px;
                            padding:36px;
                        "
                    >

                        <p
                            style="
                                margin:0 0 10px;
                                color:#8a765f;
                                font-size:13px;
                                letter-spacing:2px;
                                text-transform:uppercase;
                            "
                        >
                            Amma's Handmade
                        </p>


                        <h1
                            style="
                                margin:0 0 14px;
                                font-size:28px;
                            "
                        >
                            Thank you for your order.
                        </h1>


                        <p
                            style="
                                line-height:1.6;
                            "
                        >
                            Hi
                            ${escapeHtml(
                                order.customer.firstName
                            )},

                            your payment has been received
                            and your order has been confirmed.
                        </p>


                        <p>
                            <strong>
                                Order number:
                            </strong>

                            ${escapeHtml(
                                order.orderNumber
                            )}
                        </p>


                        <hr
                            style="
                                border:none;
                                border-top:1px solid #eeeeee;
                                margin:30px 0;
                            "
                        />


                        <h2
                            style="
                                font-size:18px;
                            "
                        >
                            Your order
                        </h2>


                        <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            style="
                                border-collapse:collapse;
                            "
                        >

                            ${itemRows}

                        </table>


                        <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            style="
                                margin-top:24px;
                            "
                        >

                            <tr>

                                <td>
                                    Subtotal
                                </td>

                                <td align="right">

                                    ${formatMoney(
                                        order.subtotalMinor,
                                        order.currency
                                    )}

                                </td>

                            </tr>


                            <tr>

                                <td
                                    style="
                                        padding-top:10px;
                                        font-weight:bold;
                                    "
                                >
                                    Total
                                </td>

                                <td
                                    align="right"
                                    style="
                                        padding-top:10px;
                                        font-weight:bold;
                                    "
                                >

                                    ${formatMoney(
                                        order.totalMinor,
                                        order.currency
                                    )}

                                </td>

                            </tr>

                        </table>


                        <hr
                            style="
                                border:none;
                                border-top:1px solid #eeeeee;
                                margin:30px 0;
                            "
                        />


                        <h2
                            style="
                                font-size:18px;
                            "
                        >
                            Delivery address
                        </h2>


                        <p
                            style="
                                line-height:1.7;
                            "
                        >

                            ${escapeHtml(
                                order.customer.firstName
                            )}
                            ${escapeHtml(
                                order.customer.lastName
                            )}

                            <br />

                            ${escapeHtml(
                                shippingAddress.addressLine1
                            )}

                            ${
                                shippingAddress.addressLine2
                                    ? `<br />${escapeHtml(
                                        shippingAddress.addressLine2
                                    )}`
                                    : ""
                            }

                            <br />

                            ${escapeHtml(
                                shippingAddress.city
                            )},
                            ${escapeHtml(
                                shippingAddress.state
                            )}

                            <br />

                            ${escapeHtml(
                                shippingAddress.postalCode
                            )}

                            <br />

                            ${escapeHtml(
                                shippingAddress.country
                            )}

                        </p>


                        <p
                            style="
                                margin-top:34px;
                                color:#777777;
                                font-size:14px;
                                line-height:1.6;
                            "
                        >
                            Your handmade pieces will be
                            prepared with care by Amma's
                            Handmade.
                        </p>

                    </div>

                </div>

            </body>

        </html>
    `;


    const {
        data,
        error
    } =
        await resend
            .emails
            .send({

                from,

                to: [
                    order.customer.email
                ],

                subject:
                    `Order confirmed — ${order.orderNumber}`,

                html,

            });


    if (error) {

        throw new Error(
            error.message ||
            "Unable to send confirmation email."
        );

    }


    console.log(
        "Order confirmation email sent:",
        {
            orderNumber:
                order.orderNumber,

            emailId:
                data?.id,
        }
    );


    return data;

}

/* =====================================================
   SEND CONFIRMATION ONLY ONCE
===================================================== */

export async function sendOrderConfirmationOnce(
    orderId
) {

    /*
       Atomically claim the email.

       If the browser verification and webhook
       arrive at the same time, only one of them
       is allowed to send it.
    */

    const order =
        await Order.findOneAndUpdate(
            {
                _id:
                    orderId,

                paymentStatus:
                    "paid",

                confirmationEmailStatus: {
                    $in: [
                        "pending",
                        "failed"
                    ],
                },
            },

            {
                $set: {
                    confirmationEmailStatus:
                        "sending",

                    confirmationEmailLastError:
                        null,
                },
            },

            {
                new: true,
            }
        );


    /*
       No order means either:

       - already sent
       - currently being sent
       - not paid
    */

    if (!order) {

        return {
            sent: false,
            reason:
                "Confirmation email already handled or order is not eligible.",
        };

    }


    try {

        const result =
            await sendOrderConfirmation(
                order
            );


        await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {

                    confirmationEmailStatus:
                        "sent",

                    confirmationEmailSentAt:
                        new Date(),

                    confirmationEmailLastError:
                        null,

                },
            }
        );


        return {
            sent: true,
            result,
        };

    } catch (error) {

        console.error(
            "Order confirmation email failed:",
            error
        );


        await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {

                    confirmationEmailStatus:
                        "failed",

                    confirmationEmailLastError:
                        error.message ||
                        "Unknown email error",

                },
            }
        );


        throw error;

    }

}
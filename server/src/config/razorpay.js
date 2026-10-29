import Razorpay from "razorpay";


let razorpayClient = null;


export function getRazorpayClient() {

    const keyId =
        process.env.RAZORPAY_KEY_ID;


    const keySecret =
        process.env.RAZORPAY_KEY_SECRET;


    if (
        !keyId ||
        !keySecret
    ) {

        throw new Error(
            "Razorpay credentials are not configured."
        );

    }


    if (!razorpayClient) {

        razorpayClient =
            new Razorpay({
                key_id:
                    keyId,

                key_secret:
                    keySecret,
            });

    }


    return {
        razorpay:
            razorpayClient,

        keyId,

        keySecret,
    };

}
import {
    ArrowRight,
    ImagePlus,
    MessageCircle,
    Sparkles
} from "lucide-react";

import { Link } from "react-router-dom";


function CustomOrderSection() {

    return (
        <section className="custom-order-section">

            <div className="container custom-order-card">


                {/* CONTENT */}

                <div className="custom-order-content">

                    <span className="custom-order-eyebrow">
                        Custom Made by Amma
                    </span>


                    <h2>
                        Have something
                        <span>in mind?</span>
                    </h2>


                    <p className="custom-order-intro">
                        Share your idea, your colours,
                        or even a reference image and
                        let's turn it into something
                        handmade especially for you.
                    </p>


                    <div className="custom-order-points">

                        <div className="custom-order-point">

                            <ImagePlus />

                            <div>
                                <strong>
                                    Share your idea
                                </strong>

                                <span>
                                    Upload references or tell us
                                    what you have in mind.
                                </span>
                            </div>

                        </div>


                        <div className="custom-order-point">

                            <MessageCircle />

                            <div>
                                <strong>
                                    Amma reviews it
                                </strong>

                                <span>
                                    We'll confirm what's possible,
                                    the price and making time.
                                </span>
                            </div>

                        </div>


                        <div className="custom-order-point">

                            <Sparkles />

                            <div>
                                <strong>
                                    Made just for you
                                </strong>

                                <span>
                                    Once approved, your custom
                                    piece comes to life.
                                </span>
                            </div>

                        </div>

                    </div>


                    <Link
                        to="/custom-orders"
                        className="custom-order-button"
                    >
                        Start Your Custom Request
                        <ArrowRight />
                    </Link>

                </div>


                {/* IMAGE SIDE */}

                <div className="custom-order-visual">

                    <img
                        src="/images/A-handmade-crochet-piece-being-created.jpg"
                        alt="A handmade crochet piece being created"
                    />


                    <div className="custom-order-quote">
                        <span>
                            Your idea.
                        </span>

                        <strong>
                            Amma's hands.
                        </strong>
                    </div>

                </div>


            </div>

        </section>
    );
}


export default CustomOrderSection;
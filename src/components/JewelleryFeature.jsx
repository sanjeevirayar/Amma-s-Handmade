import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function JewelleryFeature() {
    return (
        <section className="jewellery-feature">

            <div className="container jewellery-grid">

                {/* IMAGE */}
                <div className="jewellery-image-wrapper">

                    <img
                        src="/images/products/jewellery/Maroon-Beaded-Crochet-Jewelry-Set.jpg"
                        alt="Handmade crochet jewellery by Amma"
                        className="jewellery-image"
                    />

                    <span className="jewellery-note">
                        A little colour goes a long way ♡
                    </span>

                </div>


                {/* CONTENT */}
                <div className="jewellery-content">

                    <span className="section-eyebrow">
                        Crochet Jewellery
                    </span>

                    <h2>
                        Wear a little
                        <span>handmade joy.</span>
                    </h2>

                    <p>
                        Delicate pieces shaped from thread,
                        colour and patience. Each one is made
                        by hand to feel playful, expressive
                        and uniquely yours.
                    </p>

                    <Link
                        to={`/shop?category=${encodeURIComponent("Crochet Jewellery")}`}
                        className="jewellery-button"
                    >
                        Explore Jewellery
                        <ArrowRight />
                    </Link>


                    {/* DECORATIVE THREAD */}
                    <svg
                        className="jewellery-thread"
                        viewBox="0 0 360 120"
                        aria-hidden="true"
                    >
                        <path
                            d="
                            M5 70
                            C70 20, 130 115, 190 62
                            C225 30, 255 35, 275 65
                            "
                        />

                        <path
                            d="
                            M275 65
                            C260 45, 238 50, 240 69
                            C242 88, 275 104, 275 104
                            C275 104, 308 88, 310 69
                            C312 50, 290 45, 275 65
                            "
                        />
                    </svg>

                </div>

            </div>

        </section>
    );
}

export default JewelleryFeature;
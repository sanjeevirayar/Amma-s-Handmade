import { ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

const promos = [
    {
        type: "new",
        eyebrow: "Fresh from Amma",
        title: "What's New",
        description:
            "Discover the latest handmade pieces, fresh colours and little creations just added to the shop.",
        buttonText: "Explore New Arrivals",
        to: "/shop?new=true",
        image: "/images/promos/purple-crescent-handbag.jpg",
    },
    {
        type: "sale",
        eyebrow: "Limited-Time Offer",
        title: "Clearence Sale",
        to: "/shop?sale=true",
        description:
            "A little handmade happiness for a little less. Explore selected pieces while the offer lasts.",
        buttonText: "Shop the Sale",
        image: "/images/promos/Rainbow-Macramé-Beaded-Lantern-Ornament.jpg",
    },
];

function PromoDuo() {
    return (
        <section className="promo-section">

            <div className="container promo-grid">

                {promos.map((promo) => (

                    <article
                        className={`promo-card promo-card-${promo.type}`}
                        key={promo.title}
                    >

                        <img
                            src={promo.image}
                            alt={promo.title}
                            className="promo-image"
                        />

                        <div className="promo-shade"></div>

                        <div className="promo-content">

                            <span className="promo-eyebrow">
                                {promo.eyebrow}
                            </span>

                            <h2>
                                {promo.title}
                            </h2>

                            <p>
                                {promo.description}
                            </p>

                            <Link
                                to={promo.to}
                                className="promo-button"
                            >
                                {promo.buttonText}
                                <ArrowRight />
                            </Link>

                        </div>

                    </article>

                ))}

            </div>

        </section>
    );
}

export default PromoDuo;
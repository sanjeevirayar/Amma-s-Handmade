import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const giftCategories = [
    {
        title: "For Her",
        subtitle: "Little things she'll love",
        image: "/images/products/earrings/Golden-Spiral-Earrings.jpg",
    },

    {
        title: "Birthdays",
        subtitle: "Made for happy days",
        image: "/images/products/accessories/Hanging-Doll.jpg",
    },

    {
        title: "Little Ones",
        subtitle: "Soft, playful & handmade",
        image: "/images/products/amigurumi/Heart-Sprout-Planter.jpg",
    },

    {
        title: "Thank You",
        subtitle: "A thoughtful little gesture",
        image: "/images/products/keychains/Hot-Pink-Heart-Keychain.jpg",
    },

    {
        title: "Housewarming",
        subtitle: "For a place called home",
        image: "/images/products/home-decor/Utensil-Rack.jpg",
    },

    {
        title: "Just Because",
        subtitle: "No occasion required",
        image: "/images/products/accessories/Navy-Bottle-Cover-with-Pink-Tassels.jpg",
    },
];


function GiftDiscovery() {

    return (
        <section className="gift-section">

            <div className="container">


                <div className="gift-header">

                    <div>

                        <span className="section-eyebrow">
                            Thoughtful Little Things
                        </span>

                        <h2>
                            Made for Giving
                        </h2>

                        <p>
                            Find something handmade for
                            every person and every little occasion.
                        </p>

                    </div>


                    <Link
                        to="/gifts"
                        className="gift-view-all"
                    >
                        View All Gifts
                        <ArrowUpRight />
                    </Link>

                </div>


                <div className="gift-grid">

                    {giftCategories.map((gift) => (

                        <Link
                            to={`/shop?category=Gifts&gift=${encodeURIComponent(gift.title)}`}
                            className="gift-card"
                            key={gift.title}
                        >

                            <img
                                src={gift.image}
                                alt={gift.title}
                            />


                            <div className="gift-overlay"></div>


                            <div className="gift-card-content">

                                <div>

                                    <span>
                                        {gift.subtitle}
                                    </span>

                                    <h3>
                                        {gift.title}
                                    </h3>

                                </div>


                                <div className="gift-arrow">
                                    <ArrowUpRight />
                                </div>

                            </div>

                        </Link>

                    ))}

                </div>

            </div>

        </section>
    );
}


export default GiftDiscovery;
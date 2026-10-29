import {
    ArrowRight,
    ArrowUpRight,
    Heart,
    Leaf,
    Sparkles,
    Gem
} from "lucide-react";

import { Link } from "react-router-dom";

const heroTiles = [
    {
        title: "Crochet & Macramé Bags",
        subtitle: "Everyday favourites",
        image: "/images/hero/Cream-Macramé-Fringe-Shoulder-Bag.jpg",
        to: "/shop?group=bags",
    },
    {
        title: "Crochet Jewellery",
        subtitle: "Wear a little joy",
        image: "/images/hero/jewellery.jpeg",
        to: `/shop?category=${encodeURIComponent("Crochet Jewellery")}`,
    },
    {
        title: "Amigurumi",
        subtitle: "Little companions",
        image: "/images/hero/amigurumi.jpeg",
        to: "/shop?category=Amigurumi",
    },
    {
        title: "Gifts",
        subtitle: "Made for giving",
        image: "/images/hero/gifts.jpeg",
        to: "/gifts",
    },
];


const values = [
    {
        title: "Handmade with Love",
        text: "Every piece is carefully made by hand.",
        icon: Heart,
        color: "coral",
    },
    {
        title: "Small Batch",
        text: "Thoughtfully created in limited quantities.",
        icon: Leaf,
        color: "sage",
    },
    {
        title: "Thoughtfully Crafted",
        text: "Attention goes into every knot and detail.",
        icon: Sparkles,
        color: "mustard",
    },
    {
        title: "Wonderfully Unique",
        text: "Tiny variations make every piece its own.",
        icon: Gem,
        color: "terracotta",
    },
];


function CampaignHero() {

    return (
        <section className="campaign-hero">

            <div className="container campaign-grid">

                {/* MAIN CAMPAIGN */}

                <article
                    className="campaign-main"
                    style={{
                        backgroundImage:
                            'url("/images/hero/main-campaign.jpeg")'
                    }}
                >

                    <div className="campaign-main-overlay"></div>


                    <div className="campaign-content">

                        <span className="campaign-eyebrow">
                            Handmade with Heart
                        </span>


                        <h1>
                            New knots.

                            <span>
                                New colours.
                            </span>

                            <span>
                                New little joys.
                            </span>
                        </h1>


                        <p>
                            Discover Amma&apos;s newest handmade
                            creations, thoughtfully made one piece
                            at a time.
                        </p>


                        <Link
                            to="/shop?new=true"
                            className="campaign-button"
                        >
                            Shop New Arrivals
                            <ArrowRight />
                        </Link>

                    </div>


                    {/* THREAD / HEART DECORATION */}

                    <svg
                        className="hero-thread"
                        viewBox="0 0 500 180"
                        aria-hidden="true"
                    >

                        <path
                            d="
                                M5 95
                                C90 25, 165 145, 245 80
                                C300 35, 345 55, 365 95
                            "
                        />

                        <path
                            d="
                                M365 95
                                C347 67, 316 73, 318 98
                                C320 123, 365 145, 365 145
                                C365 145, 410 123, 412 98
                                C414 73, 383 67, 365 95
                            "
                        />

                    </svg>

                </article>


                {/* SUPPORTING CARDS */}

                <div className="campaign-tiles">

                    {heroTiles.map((tile) => (

                        <Link
                            to={tile.to}
                            className="campaign-tile"
                            key={tile.title}
                            style={{
                                backgroundImage: `url("${tile.image}")`
                            }}
                        >

                            <div className="tile-shade"></div>


                            <div className="campaign-tile-content">

                                <span>
                                    {tile.subtitle}
                                </span>


                                <h2>
                                    {tile.title}
                                </h2>


                                <ArrowUpRight />

                            </div>

                        </Link>

                    ))}

                </div>

            </div>


            {/* BRAND VALUES */}

            <div className="container campaign-values">

                {values.map((value) => {

                    const Icon = value.icon;

                    return (

                        <div
                            className="campaign-value"
                            key={value.title}
                        >

                            <div
                                className={`campaign-value-icon ${value.color}`}
                            >
                                <Icon />
                            </div>


                            <div className="campaign-value-text">

                                <h3>
                                    {value.title}
                                </h3>

                                <p>
                                    {value.text}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>
    );
}


export default CampaignHero;
import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    ArrowLeft,
    ArrowRight
} from "lucide-react";

import { Link } from "react-router-dom";


const collections = [
    {
        title: "Crochet Bags",
        category: "Crochet Bags",
        subtitle: "Everyday favourites",
        image: "/images/collections/sunflower-totebag.jpg",
    },
    {
        title: "Macramé Bags",
        category: "Macramé Bags",
        subtitle: "Knotted with love",
        image: "/images/products/macrame-bags/Cream-Macramé-Fringe-Shoulder-Bag.jpg",
    },
    {
        title: "Crochet Jewellery",
        category: "Crochet Jewellery",
        subtitle: "Wear a little joy",
        image: "/images/collections/jewellery.jpeg",
    },
    {
        title: "Amigurumi",
        category: "Amigurumi",
        subtitle: "Little companions",
        image: "/images/collections/puppy-amigurumi.jpg",
    },
    {
        title: "Bracelets & Accessories",
        category: "Accessories",
        subtitle: "Colourful details",
        image: "/images/collections/accessories.jpeg",
    },
    {
        title: "Keychains",
        category: "Keychains",
        subtitle: "Small & joyful",
        image: "/images/collections/keychains.jpg",
    },
    {
        title: "Home Décor",
        category: "Home Decor",
        subtitle: "Made for cozy spaces",
        image: "/images/collections/home-decor.jpg",
    },
    {
        title: "Gifts",
        category: "Gifts",
        subtitle: "Thoughtful treasures",
        image: "/images/collections/gifts.jpeg",
    },
    {
        title: "Seasonal",
        category: "Seasonal",
        subtitle: "Made for special moments",
        image: "/images/collections/seasonal.jpg",
    },
];


function CollectionCarousel() {

    const carouselRef = useRef(null);

    const [isPaused, setIsPaused] =
        useState(false);


    /* =========================================
       SCROLL FUNCTION
    ========================================= */

    const scrollCarousel = (direction) => {

        const carousel =
            carouselRef.current;

        if (!carousel) return;


        const firstCard =
            carousel.querySelector(
                ".collection-card"
            );


        if (!firstCard) return;


        const gap = 24;

        const scrollAmount =
            firstCard.offsetWidth + gap;


        carousel.scrollBy({
            left:
                direction === "left"
                    ? -scrollAmount
                    : scrollAmount,

            behavior: "smooth",
        });

    };


    /* =========================================
       AUTO SCROLL
    ========================================= */

    useEffect(() => {

        if (isPaused) return;


        const interval =
            setInterval(() => {

                const carousel =
                    carouselRef.current;

                if (!carousel) return;


                const firstCard =
                    carousel.querySelector(
                        ".collection-card"
                    );


                if (!firstCard) return;


                const gap = 24;

                const scrollAmount =
                    firstCard.offsetWidth + gap;


                const reachedEnd =
                    carousel.scrollLeft +
                    carousel.clientWidth >=
                    carousel.scrollWidth -
                    scrollAmount;


                if (reachedEnd) {

                    carousel.scrollTo({
                        left: 0,
                        behavior: "smooth",
                    });

                } else {

                    carousel.scrollBy({
                        left: scrollAmount,
                        behavior: "smooth",
                    });

                }

            }, 2800);


        return () =>
            clearInterval(interval);

    }, [isPaused]);


    return (
        <section className="collection-section">

            <div className="container">


                <div className="collection-heading">

                    <div>

                        <span className="section-eyebrow">
                            Explore Amma's World
                        </span>

                        <h2>
                            Shop by Collection
                        </h2>

                        <p>
                            Find something made for
                            every little moment.
                        </p>

                    </div>


                    <div className="carousel-controls">

                        <button
                            type="button"
                            aria-label="Previous collections"
                            onClick={() =>
                                scrollCarousel("left")
                            }
                        >
                            <ArrowLeft />
                        </button>


                        <button
                            type="button"
                            aria-label="Next collections"
                            onClick={() =>
                                scrollCarousel("right")
                            }
                        >
                            <ArrowRight />
                        </button>

                    </div>

                </div>


                <div
                    className="collection-carousel"
                    ref={carouselRef}

                    onMouseEnter={() =>
                        setIsPaused(true)
                    }

                    onMouseLeave={() =>
                        setIsPaused(false)
                    }
                >

                    {collections.map((collection) => (
                        <Link
                            to={`/shop?category=${encodeURIComponent(collection.category)}`}
                            className="collection-card"
                            key={collection.category}
                        >
                            <div className="collection-image">
                                <img
                                    src={collection.image}
                                    alt=""
                                    loading="lazy"
                                />
                            </div>

                            <div className="collection-info">
                                <h3>{collection.title}</h3>

                                <span>{collection.subtitle}</span>
                            </div>
                        </Link>
                    ))}

                </div>

            </div>

        </section>
    );
}


export default CollectionCarousel;
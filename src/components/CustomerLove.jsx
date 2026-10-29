import {
    ArrowRight,
    Camera,
    Heart,
    Star
} from "lucide-react";


const reviews = [
    // Real customer reviews will go here later.
];


function CustomerLove() {

    const hasReviews = reviews.length > 0;


    return (
        <section className="customer-love-section">

            <div className="container">


                <div className="customer-love-header">

                    <span className="section-eyebrow">
                        Handmade, Shared & Loved
                    </span>

                    <h2>
                        Loved Around the World
                    </h2>

                    <p>
                        Little handmade pieces finding
                        their way into homes, celebrations
                        and everyday moments.
                    </p>

                </div>


                {hasReviews ? (

                    <div className="customer-review-grid">

                        {reviews.map((review) => (

                            <article
                                className="customer-review-card"
                                key={review.id}
                            >

                                {review.image && (

                                    <div className="customer-review-image">

                                        <img
                                            src={review.image}
                                            alt=""
                                        />

                                    </div>

                                )}


                                <div className="customer-review-content">

                                    <div className="review-stars">

                                        {Array.from({
                                            length: review.rating
                                        }).map((_, index) => (

                                            <Star
                                                key={index}
                                            />

                                        ))}

                                    </div>


                                    <blockquote>
                                        “{review.quote}”
                                    </blockquote>


                                    <div className="review-customer">

                                        <strong>
                                            {review.name}
                                        </strong>

                                        <span>
                                            {review.location}
                                        </span>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                ) : (

                    <div className="customer-love-empty">

                        <div className="customer-love-decoration">

                            <span className="love-circle love-circle-one">
                                <Heart />
                            </span>

                            <span className="love-circle love-circle-two">
                                <Camera />
                            </span>

                            <span className="love-circle love-circle-three">
                                <Star />
                            </span>

                        </div>


                        <div className="customer-love-empty-content">

                            <span className="customer-love-small">
                                Our story is just beginning
                            </span>

                            <h3>
                                Soon, this space will belong
                                <span>to our customers.</span>
                            </h3>

                            <p>
                                As Amma's handmade pieces find
                                new homes, we'll share genuine
                                customer stories, photographs
                                and little moments of joy here.
                            </p>


                            <a
                                href="#"
                                className="customer-love-button"
                            >
                                Discover Our Creations

                                <ArrowRight />
                            </a>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}


export default CustomerLove;    
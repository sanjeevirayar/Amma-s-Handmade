import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function OurStory() {
    return (
        <main className="our-story-page">
            {/* MEET AMMA */}

            <section
                className="amma-story"
                aria-labelledby="our-story-title"
            >
                <div className="container amma-story-grid">
                    <div className="amma-story-image-wrapper">
                        <img
                            src="/images/branding/amma.jpg"
                            alt="Amma, the maker behind Amma's Handmade"
                            className="amma-story-image"
                        />

                        <div className="story-photo-note">
                            A lifetime of learning, a love for making ♡
                        </div>
                    </div>

                    <div className="amma-story-content">
                        <span className="section-eyebrow">
                            Meet the Hands Behind the Handmade
                        </span>

                        <h1
                            id="our-story-title"
                            className="our-story-title"
                        >
                            A mother's words.
                            <span>A daughter's lifelong craft.</span>
                        </h1>

                        <p className="story-intro">
                            Amma's Handmade began long before it
                            had a name—with a schoolgirl in
                            Pondicherry and a few words of
                            encouragement from her mother.
                        </p>

                        <p>
                            While studying in the 12th grade,
                            Amma began learning handicrafts.
                            What started with her mother's advice
                            grew into a lasting love for creating
                            things by hand.
                        </p>

                        <p>
                            Today, at 51 years young, she brings
                            years of learning, practice, and
                            imagination to Amma's Handmade—a way
                            to share her love of art and craft
                            with the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* THE WORDS THAT STARTED IT */}

            <section
                className="story-quote-section"
                aria-labelledby="story-quote-title"
            >
                <div className="container">
                    <div className="story-quote-card">
                        <span
                            id="story-quote-title"
                            className="section-eyebrow"
                        >
                            The Words She Grew Up With
                        </span>

                        <blockquote>
                            <p lang="ta">
                                கைத்தொழில் ஒன்றைக் கற்றுக்கொள்,
                                <br />
                                கவலை உனக்கில்லை ஒத்துக்கொள்.
                            </p>
                        </blockquote>

                        <p className="story-quote-meaning">
                            “Learn a craft, and you will always
                            have a skill to lean on.”
                        </p>

                        <p className="story-quote-caption">
                            The spirit of her mother's advice,
                            carried with her through the years.
                        </p>
                    </div>
                </div>
            </section>

            {/* HER JOURNEY */}

            <section
                className="story-journey"
                aria-labelledby="story-journey-title"
            >
                <div className="container">
                    <header className="story-section-heading">
                        <span className="section-eyebrow">
                            Learning, Practising, Creating
                        </span>

                        <h2 id="story-journey-title">
                            A craft that grew with her.
                        </h2>
                    </header>

                    <div className="story-journey-grid">
                        <article className="story-journey-card">
                            <span className="story-step-number">
                                01
                            </span>

                            <h3>The first stitches</h3>

                            <p>
                                Her training began with hand
                                embroidery and crochet at a
                                government institute in
                                Mudaliarpet, Pondicherry.
                                A natural aptitude for handwork
                                gave her a starting point;
                                her attention to detail helped
                                her develop it.
                            </p>
                        </article>

                        <article className="story-journey-card">
                            <span className="story-step-number">
                                02
                            </span>

                            <h3>Always more to learn</h3>

                            <p>
                                She went on to learn stitching
                                through an ITI in Pondicherry.
                                As her interest grew, she
                                continued at private institutes,
                                exploring machine embroidery,
                                aari work, painting, and macramé.
                                Each craft gave her another way
                                to express an idea.
                            </p>
                        </article>

                        <article className="story-journey-card">
                            <span className="story-step-number">
                                03
                            </span>

                            <h3>From imagination to her hands</h3>

                            <p>
                                Years of practice helped her
                                turn the designs she imagined
                                into pieces she could hold.
                                Her instinct to keep refining
                                the details became part of
                                her work—from the choice of
                                colour to the finishing touches.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* THE BRAND */}

            <section
                className="story-brand-section"
                aria-labelledby="story-brand-title"
            >
                <div className="container">
                    <div className="story-brand-content">
                        <span className="section-eyebrow">
                            And So, Amma's Handmade
                        </span>

                        <h2 id="story-brand-title">
                            A mother's love, made by hand.
                        </h2>

                        <p>
                            “Amma” means “mother” in Tamil—and that feeling
                            is at the heart of Amma's Handmade.
                        </p>

                        <p>
                            Each piece is made with a mother's love, patience,
                            and care, with the hope that whoever receives it
                            feels something familiar: the warmth of having
                            something made especially for them by their own mum.
                        </p>

                        <p>
                            Her love for craft extends beyond the pieces she makes.
                            Amma also shares what she has learned with others
                            who are eager to learn, passing on the skills,
                            patience, and attention to detail that have shaped
                            her own journey.
                        </p>

                        <p className="story-brand-tagline">
                            A touch of love in every knot.
                        </p>

                        <div className="story-page-actions">
                            <Link
                                to="/learn-with-amma"
                                className="story-custom-link"
                            >
                                Learn with Amma
                                <ArrowRight aria-hidden="true" />
                            </Link>

                            <Link
                                to="/custom-orders"
                                className="story-custom-link"
                            >
                                Create something with Amma
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default OurStory;
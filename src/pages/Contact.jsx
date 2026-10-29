import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";

function Contact() {
    return (
        <main className="contact-page">
            <div className="container">
                <header className="contact-header">
                    <span className="section-eyebrow">
                        Let’s Talk
                    </span>

                    <h1>A little conversation starts here.</h1>

                    <p>
                        Have a handmade idea in mind, or want to
                        learn a craft with Amma? Find the right
                        place to begin below.
                    </p>
                </header>

                <div className="contact-grid">
                    <article className="contact-card">
                        <Sparkles
                            className="contact-card-icon"
                            aria-hidden="true"
                        />

                        <h2>Something made for you</h2>

                        <p>
                            Share your ideas, favourite colours,
                            or a reference image for a custom
                            handmade piece.
                        </p>

                        <Link
                            to="/custom-orders"
                            className="contact-card-link"
                        >
                            Explore custom orders
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </article>

                    <article className="contact-card">
                        <MessageCircle
                            className="contact-card-icon"
                            aria-hidden="true"
                        />

                        <h2>Learn with Amma</h2>

                        <p>
                            Explore the crafts you could learn
                            and preview an enquiry about an
                            upcoming workshop.
                        </p>

                        <Link
                            to="/learn-with-amma"
                            className="contact-card-link"
                        >
                            Explore workshops
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </article>
                </div>

                <div className="contact-direct">
                    <h2>Get in touch</h2>

                    <p>
                        Have a question about a product, custom order,
                        or learning with Amma? Email or call us.
                    </p>

                    <a href="mailto:support.ammashandmade@gmail.com">
                        support.ammashandmade@gmail.com
                    </a>

                    <a href="tel:+919150387179">
                        +91 91503 87179
                    </a>
                </div>
            </div>
        </main>
    );
}

export default Contact;
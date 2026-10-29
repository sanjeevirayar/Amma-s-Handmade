import {
    ArrowRight,
    Heart,
    Camera,
    Mail,
    MessageCircle
} from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">

            <div className="container footer-main">

                {/* BRAND */}
                <div className="footer-brand">

                    <Link
                        to="/"
                        className="footer-logo"
                        aria-label="Amma's Handmade Home"
                    >
                        <img
                            src="/images/branding/ammas-handmade-logo.png"
                            alt="Amma's Handmade"
                            className="footer-logo-image"
                        />
                    </Link>

                    <p className="footer-description">
                        Handmade crochet pieces,
                        thoughtful gifts and little
                        creations made slowly with care.
                    </p>

                    <div className="footer-socials">

                        <a href="#" aria-label="Instagram">
                            <Camera />
                        </a>

                        <a href="#" aria-label="WhatsApp">
                            <MessageCircle />
                        </a>

                        <a
                            href="mailto:support.ammashandmade@gmail.com"
                            aria-label="Email Amma's Handmade"
                        >
                            <Mail aria-hidden="true" />
                        </a>

                    </div>

                </div>


                {/* SHOP */}

                <div className="footer-column">
                    <h3>Shop</h3>

                    <Link to="/shop?category=Crochet%20Bags">
                        Crochet Bags
                    </Link>

                    <Link to={`/shop?category=${encodeURIComponent("Macramé Bags")}`}>
                        Macramé Bags
                    </Link>

                    <Link to="/shop?category=Crochet%20Jewellery">
                        Crochet Jewellery
                    </Link>

                    <Link to="/shop?category=Amigurumi">
                        Amigurumi
                    </Link>

                    <Link to="/shop?category=Accessories">
                        Accessories
                    </Link>

                    <Link to="/shop?category=Keychains">
                        Keychains
                    </Link>

                    <Link to="/shop?category=Home%20Decor">
                        Home Décor
                    </Link>

                    <Link to="/gifts">
                        Gifts
                    </Link>

                    <Link to="/shop?category=Seasonal">
                        Seasonal
                    </Link>
                </div>

                {/* ABOUT */}

                <div className="footer-column">
                    <h3>About</h3>

                    <Link to="/our-story">
                        Our Story
                    </Link>

                    <Link to="/learn-with-amma">
                        Learn with Amma
                    </Link>

                    <Link to="/custom-orders">
                        Custom Orders
                    </Link>

                    <Link to="/collections">
                        Our Collections
                    </Link>
                </div>


                {/* HELP */}
                <div className="footer-column">

                    <h3>Help</h3>

                    <a href="#">Shipping</a>
                    <a href="#">Returns</a>
                    <a href="#">Care Guide</a>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/contact">Contact</Link>
                    <a href="#">Track Order</a>

                </div>


                {/* NEWSLETTER */}
                <div className="footer-newsletter">

                    <span className="footer-newsletter-small">
                        Stay a little closer ♡
                    </span>

                    <h3>
                        A little love

                        <span>
                            in your inbox.
                        </span>
                    </h3>

                    <p>
                        New creations, seasonal drops
                        and small handmade updates.
                    </p>

                    <div className="newsletter-form">

                        <input
                            type="email"
                            placeholder="Your email address"
                            aria-label="Email address"
                        />

                        <button
                            type="button"
                            aria-label="Join newsletter"
                        >
                            <ArrowRight />
                        </button>

                    </div>

                    <span className="newsletter-note">
                        No clutter. Just the lovely stuff.
                    </span>

                </div>

            </div>


            <div className="container footer-bottom">

                <div className="footer-copyright">

                    <Heart />

                    <span>
                        © {currentYear} Amma&apos;s Handmade.
                        Made with care in India.
                    </span>

                </div>


                <div className="footer-policies">

                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Shipping</a>
                    <a href="#">Returns</a>
                    <a href="#">Sitemap</a>

                </div>

            </div>

        </footer>
    );
}


export default Footer;
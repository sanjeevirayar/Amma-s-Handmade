import {
    Heart,
    Sparkles,
    Leaf,
    Gem,
    ArrowRight
} from "lucide-react";

import { Link } from "react-router-dom";


function AmmaStory() {
    return (
        <section className="amma-story">

            <div className="container amma-story-grid">

                {/* IMAGE */}

                <div className="amma-story-image-wrapper">

                    <img
                        src="/images/branding/amma.jpg"
                        alt="Amma creating a handmade crochet piece"
                        className="amma-story-image"
                    />

                    <div className="story-photo-note">
                        Made slowly, with love ♡
                    </div>

                </div>


                {/* STORY */}

                <div className="amma-story-content">

                    <span className="section-eyebrow">
                        Behind Every Knot
                    </span>

                    <h2>
                        From Amma's hands
                        <span>to yours.</span>
                    </h2>

                    <p className="story-intro">
                        Every piece at Amma's Handmade begins
                        in the same place — in Amma's hands.
                    </p>

                    <p>
                        With yarn, patience and an eye for colour,
                        simple threads slowly become bags,
                        jewellery, little companions and gifts
                        made to be loved.
                    </p>

                    <p>
                        Nothing here is rushed or mass-produced.
                        Each creation carries the small details
                        and tiny variations that make handmade
                        work special.
                    </p>

                    <Link
                        to="/our-story"
                        className="story-button"
                    >
                        Meet Amma
                        <ArrowRight />
                    </Link>

                </div>

            </div>


        </section>
    );
}


export default AmmaStory;
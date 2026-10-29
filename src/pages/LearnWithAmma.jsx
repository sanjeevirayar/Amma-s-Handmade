import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    ArrowRight
} from "lucide-react";

import {
    ProductContext
} from "../context/ProductContext";


const lessonPreviews = [
    {
        productSlug:
            "half-moon-shoulder-bag",

        title:
            "Crochet a shoulder bag",

        description:
            "A future look at how Amma shapes yarn into a handmade bag.",
    },

    {
        productSlug:
            "mandala-earrings",

        title:
            "Create crochet jewellery",

        description:
            "A closer look at the stitches and details behind Amma's crochet earrings.",
    },

    {
        productSlug:
            "bunny-hugging-red-heart",

        title:
            "Discover amigurumi",

        description:
            "See how crochet shapes come together to create a little character.",
    },
];


function getUpcomingMondays() {

    const date =
        new Date();


    date.setHours(
        12,
        0,
        0,
        0
    );


    const daysUntilMonday =
        (
            8 -
            date.getDay()
        ) %
        7 ||
        7;


    date.setDate(
        date.getDate() +
        daysUntilMonday
    );


    return Array.from(
        {
            length: 8
        },

        () => {

            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() +
                    1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    date.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const option = {

                value:
                    `${year}-${month}-${day}`,

                label:
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday:
                                "long",

                            day:
                                "numeric",

                            month:
                                "long",

                            year:
                                "numeric",
                        }
                    ),
            };


            date.setDate(
                date.getDate() +
                7
            );


            return option;

        }
    );

}


function LearnWithAmma() {

    const {
        products,
        loading,
        error
    } = useContext(
        ProductContext
    );


    const [
        enquiryPreview,
        setEnquiryPreview
    ] = useState(null);


    const upcomingMondays =
        getUpcomingMondays();


    const previewRef =
        useRef(null);


    /* =====================================================
       FOCUS ENQUIRY PREVIEW
    ===================================================== */

    useEffect(() => {

        if (
            enquiryPreview
        ) {

            previewRef.current
                ?.focus();

        }

    }, [enquiryPreview]);


    /* =====================================================
       ENQUIRY PREVIEW
    ===================================================== */

    function handleEnquiryPreview(
        event
    ) {

        event.preventDefault();


        const formData =
            new FormData(
                event.currentTarget
            );


        setEnquiryPreview({

            name:
                formData
                    .get("name")
                    .trim(),

            phone:
                formData
                    .get("phone")
                    .trim(),

            craft:
                formData.get(
                    "craft"
                ),

            experience:
                formData.get(
                    "experience"
                ),

            preferredMonday:
                formData.get(
                    "preferredMonday"
                ),

            callbackTime:
                formData
                    .get(
                        "callbackTime"
                    )
                    .trim(),

            message:
                formData
                    .get("message")
                    .trim(),
        });

    }


    return (
        <main className="learn-page">


            {/* =====================================================
                VIDEO PREVIEWS
            ===================================================== */}

            <section
                className="learn-previews"
                aria-labelledby="learn-previews-title"
            >

                <div className="container">


                    <div className="learn-section-heading">

                        <span className="section-eyebrow">

                            Learn with Amma

                        </span>


                        <h1 id="learn-previews-title">

                            A glimpse into the making.

                        </h1>


                        <p>

                            Discover the stitches, knots,
                            and little details behind
                            Amma&apos;s handmade pieces.
                            Teaching videos are coming soon.

                        </p>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <p>

                            Loading handmade pieces...

                        </p>

                    )}


                    {/* ERROR */}

                    {!loading &&
                        error && (

                            <p role="alert">

                                {error}

                            </p>

                        )}


                    {/* PREVIEWS */}

                    {!loading &&
                        !error && (

                            <div className="learn-preview-grid">

                                {lessonPreviews.map(
                                    (
                                        lesson
                                    ) => {

                                        const product =
                                            products.find(
                                                (
                                                    item
                                                ) =>
                                                    item.slug ===
                                                    lesson.productSlug
                                            );


                                        if (
                                            !product
                                        ) {

                                            return null;

                                        }


                                        return (

                                            <article
                                                className="learn-preview-card"
                                                key={
                                                    lesson.productSlug
                                                }
                                            >

                                                <div className="learn-preview-image">

                                                    <img
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        loading="lazy"
                                                    />


                                                    <span className="learn-preview-badge">

                                                        Video coming soon

                                                    </span>

                                                </div>


                                                <div className="learn-preview-content">

                                                    <h3>

                                                        {
                                                            lesson.title
                                                        }

                                                    </h3>


                                                    <p>

                                                        {
                                                            lesson.description
                                                        }

                                                    </p>


                                                    <Link
                                                        to={`/product/${product.slug}`}
                                                        className="learn-preview-link"
                                                    >

                                                        View finished product

                                                        <ArrowRight
                                                            aria-hidden="true"
                                                        />

                                                    </Link>

                                                </div>

                                            </article>

                                        );

                                    }
                                )}

                            </div>

                        )}

                </div>

            </section>


            {/* =====================================================
                WORKSHOP INFORMATION
            ===================================================== */}

            <section
                className="learn-workshop"
                aria-labelledby="learn-workshop-title"
            >

                <div className="container learn-workshop-grid">


                    <div className="learn-workshop-info">

                        <span className="section-eyebrow">

                            Make Time for Making

                        </span>


                        <h2 id="learn-workshop-title">

                            Begin your craft journey with Amma.

                        </h2>


                        <p>

                            Interested in learning something new?
                            Tell us which craft you would like to
                            explore and when you&apos;re available
                            for a call.

                        </p>


                        <div className="learn-workshop-note">

                            <strong>

                                New batches planned every Monday

                            </strong>


                            <p>

                                Share your preferred start date.
                                Workshop availability, timings,
                                fees, and materials will be
                                confirmed before booking.

                            </p>

                        </div>


                        <p>

                            You&apos;re welcome to enquire whether
                            you&apos;re picking up a hook or needle
                            for the first time, or building on
                            skills you already have.

                        </p>

                    </div>


                    {/* =================================================
                        ENQUIRY FORM
                    ================================================= */}

                    <div className="learn-enquiry-card">

                        <h3>

                            Request a callback

                        </h3>


                        <p
                            id="learn-form-notice"
                            className="learn-form-notice"
                        >

                            This form is currently a preview.
                            Your details will not be sent, and
                            no callback or workshop place will
                            be booked.

                        </p>


                        <form
                            className="learn-enquiry-form"
                            onSubmit={
                                handleEnquiryPreview
                            }
                            onChange={() =>
                                setEnquiryPreview(
                                    null
                                )
                            }
                            aria-describedby="learn-form-notice"
                        >

                            <div className="learn-form-fields">


                                {/* NAME */}

                                <div className="learn-field">

                                    <label htmlFor="learn-name">

                                        Your name (required)

                                    </label>


                                    <input
                                        id="learn-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Your full name"
                                        maxLength={
                                            100
                                        }
                                        required
                                    />

                                </div>


                                {/* PHONE */}

                                <div className="learn-field">

                                    <label htmlFor="learn-phone">

                                        Phone number (required)

                                    </label>


                                    <input
                                        id="learn-phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="Include your country code"
                                        maxLength={
                                            30
                                        }
                                        required
                                    />

                                </div>


                                {/* CRAFT */}

                                <div className="learn-field">

                                    <label htmlFor="learn-craft">

                                        Craft of interest (required)

                                    </label>


                                    <select
                                        id="learn-craft"
                                        name="craft"
                                        defaultValue=""
                                        required
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >

                                            Choose a craft

                                        </option>

                                        <option>
                                            Crochet
                                        </option>

                                        <option>
                                            Macramé
                                        </option>

                                        <option>
                                            Hand embroidery
                                        </option>

                                        <option>
                                            Machine embroidery
                                        </option>

                                        <option>
                                            Stitching
                                        </option>

                                        <option>
                                            Aari work
                                        </option>

                                        <option>
                                            Painting
                                        </option>

                                        <option>
                                            Help me choose
                                        </option>

                                    </select>

                                </div>


                                {/* EXPERIENCE */}

                                <div className="learn-field">

                                    <label htmlFor="learn-experience">

                                        Your experience (required)

                                    </label>


                                    <select
                                        id="learn-experience"
                                        name="experience"
                                        defaultValue=""
                                        required
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >

                                            Choose your experience

                                        </option>

                                        <option>

                                            Complete beginner

                                        </option>

                                        <option>

                                            I have tried it before

                                        </option>

                                        <option>

                                            I want to develop my skills

                                        </option>

                                    </select>

                                </div>


                                {/* PREFERRED MONDAY */}

                                <div className="learn-field">

                                    <label htmlFor="learn-monday">

                                        Preferred Monday (optional)

                                    </label>


                                    <select
                                        id="learn-monday"
                                        name="preferredMonday"
                                        defaultValue=""
                                    >

                                        <option value="">

                                            Help me choose a date

                                        </option>


                                        {upcomingMondays.map(
                                            (
                                                monday
                                            ) => (

                                                <option
                                                    key={
                                                        monday.value
                                                    }
                                                    value={
                                                        monday.value
                                                    }
                                                >

                                                    {
                                                        monday.label
                                                    }

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* CALLBACK TIME */}

                                <div className="learn-field">

                                    <label htmlFor="learn-callback">

                                        Best time to call (optional)

                                    </label>


                                    <input
                                        id="learn-callback"
                                        name="callbackTime"
                                        type="text"
                                        placeholder="For example, 5–7 pm IST"
                                        maxLength={
                                            100
                                        }
                                    />

                                </div>


                                {/* MESSAGE */}

                                <div className="learn-field learn-field-full">

                                    <label htmlFor="learn-message">

                                        What would you like to learn?
                                        {" "}
                                        (optional)

                                    </label>


                                    <textarea
                                        id="learn-message"
                                        name="message"
                                        rows={
                                            4
                                        }
                                        placeholder="Tell Amma about your interests or any questions."
                                        maxLength={
                                            1500
                                        }
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="learn-submit-button"
                            >

                                Preview my enquiry

                                <ArrowRight
                                    aria-hidden="true"
                                />

                            </button>

                        </form>


                        {/* =================================================
                            LOCAL ENQUIRY PREVIEW
                        ================================================= */}

                        {enquiryPreview && (

                            <div
                                ref={
                                    previewRef
                                }
                                className="learn-enquiry-preview"
                                tabIndex={
                                    -1
                                }
                                aria-labelledby="learn-preview-title"
                            >

                                <h4 id="learn-preview-title">

                                    Your enquiry preview

                                </h4>


                                <dl>

                                    <div>

                                        <dt>
                                            Name
                                        </dt>

                                        <dd>

                                            {
                                                enquiryPreview.name
                                            }

                                        </dd>

                                    </div>


                                    <div>

                                        <dt>
                                            Phone
                                        </dt>

                                        <dd>

                                            {
                                                enquiryPreview.phone
                                            }

                                        </dd>

                                    </div>


                                    <div>

                                        <dt>
                                            Craft
                                        </dt>

                                        <dd>

                                            {
                                                enquiryPreview.craft
                                            }

                                        </dd>

                                    </div>


                                    <div>

                                        <dt>
                                            Experience
                                        </dt>

                                        <dd>

                                            {
                                                enquiryPreview.experience
                                            }

                                        </dd>

                                    </div>


                                    <div>

                                        <dt>
                                            Preferred Monday
                                        </dt>

                                        <dd>

                                            {
                                                enquiryPreview.preferredMonday ||
                                                "No preference"
                                            }

                                        </dd>

                                    </div>


                                    <div>

                                        <dt>
                                            Callback time
                                        </dt>

                                        <dd>

                                            {
                                                enquiryPreview.callbackTime ||
                                                "No preference"
                                            }

                                        </dd>

                                    </div>


                                    {enquiryPreview.message && (

                                        <div>

                                            <dt>
                                                Message
                                            </dt>

                                            <dd>

                                                {
                                                    enquiryPreview.message
                                                }

                                            </dd>

                                        </div>

                                    )}

                                </dl>


                                <p>

                                    Preview only — your enquiry
                                    has not been sent.

                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </section>

        </main>
    );

}


export default LearnWithAmma;
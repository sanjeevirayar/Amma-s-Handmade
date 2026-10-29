import { useEffect, useRef, useState } from "react";

function CustomOrders() {

    const [referenceImage, setReferenceImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageError, setImageError] = useState("");

    const imageInputRef = useRef(null);
    const requestPreviewRef = useRef(null);

    useEffect(() => {
        if (!referenceImage) {
            setImagePreview("");
            return;
        }

        const previewUrl = URL.createObjectURL(referenceImage);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [referenceImage]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        productType: "",
        colours: "",
        description: "",
    });

    const [showPreview, setShowPreview] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setShowPreview(false);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setShowPreview(true);
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const maxSize = 5 * 1024 * 1024;

        setShowPreview(false);
        setImageError("");

        if (!allowedTypes.includes(file.type)) {
            setImageError("Please choose a JPG, PNG, or WebP image.");
            event.target.value = "";
            setReferenceImage(null);
            return;
        }

        if (file.size > maxSize) {
            setImageError("Please choose an image smaller than 5 MB.");
            event.target.value = "";
            setReferenceImage(null);
            return;
        }

        setReferenceImage(file);
    }

    function removeReferenceImage() {
        setReferenceImage(null);
        setImageError("");
        setShowPreview(false);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    }

    useEffect(() => {
        if (showPreview) {
            requestPreviewRef.current?.focus();
        }
    }, [showPreview]);

    return (
        <main className="custom-request-page">
            <div className="container">
                <header className="shop-page-header">
                    <span className="section-eyebrow">
                        Custom Made by Amma
                    </span>

                    <h1>Make It Yours</h1>

                    <p>
                        Tell us about the handmade piece
                        you have in mind.
                    </p>
                </header>

                <form
                    className="custom-request-form"
                    onSubmit={handleSubmit}
                >
                    <div className="custom-request-field">
                        <label htmlFor="request-name">
                            Your name (required)
                        </label>

                        <input
                            id="request-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="custom-request-field">
                        <label htmlFor="request-email">
                            Email address (required)
                        </label>

                        <input
                            id="request-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            maxLength={254}
                            required
                        />
                    </div>

                    <div className="custom-request-field">
                        <label htmlFor="request-type">
                            What would you like? (required)
                        </label>

                        <select
                            id="request-type"
                            name="productType"
                            value={form.productType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose a type</option>
                            <option value="Crochet Bag">Crochet Bag</option>
                            <option value="Macramé Bag">Macramé Bag</option>
                            <option value="Jewellery">Jewellery</option>
                            <option value="Amigurumi">Amigurumi</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Keychain">Keychain</option>
                            <option value="Other">Other / Not sure yet</option>
                        </select>
                    </div>

                    <div className="custom-request-field">
                        <label htmlFor="request-colours">
                            Preferred colours (optional)
                        </label>

                        <input
                            id="request-colours"
                            name="colours"
                            type="text"
                            placeholder="For example, sage green and cream"
                            value={form.colours}
                            onChange={handleChange}
                            maxLength={150}
                        />
                    </div>

                    <div className="custom-request-field">
                        <label htmlFor="request-description">
                            Describe your idea (required)
                        </label>

                        <textarea
                            id="request-description"
                            name="description"
                            rows={6}
                            placeholder="Tell us about the design, size, occasion, or details you would love."
                            value={form.description}
                            onChange={handleChange}
                            maxLength={3000}
                            required
                        />
                    </div>

                    <div className="custom-request-field">
                        <label htmlFor="request-image">
                            Reference image (optional)
                        </label>

                        <input
                            ref={imageInputRef}
                            id="request-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            aria-describedby={
                                imageError
                                    ? "request-image-help request-image-error"
                                    : "request-image-help"
                            }
                            aria-invalid={Boolean(imageError)}
                        />

                        <p id="request-image-help" className="request-image-help">
                            Add a photo to help explain your idea.
                            JPG, PNG, or WebP, up to 5 MB.
                        </p>

                        {imageError && (
                            <p
                                id="request-image-error"
                                className="request-image-error"
                                role="alert"
                            >
                                {imageError}
                            </p>
                        )}

                        {referenceImage && imagePreview && (
                            <div className="request-image-preview">
                                <img
                                    src={imagePreview}
                                    alt="Your selected custom-order reference"
                                />

                                <p>{referenceImage.name}</p>

                                <button
                                    type="button"
                                    onClick={removeReferenceImage}
                                >
                                    Remove image
                                </button>
                            </div>
                        )}
                    </div>

                    <p id="request-preview-note">
                        This form currently previews your request.
                        It does not send it to Amma.
                    </p>

                    <button
                        type="submit"
                        className="custom-order-button"
                        aria-describedby="request-preview-note"
                    >
                        Preview Your Request
                    </button>

                    {showPreview && (
                        <section
                            ref={requestPreviewRef}
                            tabIndex={-1}
                            className="custom-request-preview"
                            aria-labelledby="request-preview-title"
                        >
                            <h2 id="request-preview-title">
                                Your Request Preview
                            </h2>

                            <p role="status">
                                Your preview is ready below.
                                Nothing has been sent.
                            </p>

                            <dl>
                                <dt>Name</dt>
                                <dd>{form.name}</dd>

                                <dt>Email</dt>
                                <dd>{form.email}</dd>

                                <dt>Product</dt>
                                <dd>{form.productType}</dd>

                                <dt>Colours</dt>
                                <dd>{form.colours || "Not specified"}</dd>

                                <dt>Your idea</dt>
                                <dd style={{ whiteSpace: "pre-wrap" }}>
                                    {form.description}
                                </dd>

                                <dt>Reference image</dt>
                                <dd>
                                    {referenceImage && imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Reference image for your custom request"
                                                className="request-summary-image"
                                            />

                                            <span>{referenceImage.name}</span>
                                        </>
                                    ) : (
                                        "Not added"
                                    )}
                                </dd>
                            </dl>
                        </section>
                    )}
                </form>
            </div>
        </main>
    );
}

export default CustomOrders;
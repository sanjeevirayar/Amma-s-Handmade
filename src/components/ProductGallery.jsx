import { useState } from "react";

function ProductGallery({ product }) {
    const images = [
        ...new Set([
            product.image,
            ...(product.images ?? []),
        ]),
    ].filter(Boolean);

    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="product-gallery">
            <div className="product-page-image">
                <img
                    src={selectedImage}
                    alt={product.name}
                />

                {product.badge && (
                    <span
                        className={`product-badge badge-${product.badgeType}`}
                    >
                        {product.badge}
                    </span>
                )}
            </div>

            {images.length > 1 && (
                <div
                    className="product-thumbnails"
                    aria-label="Product photos"
                >
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            className="product-thumbnail"
                            aria-label={`View photo ${index + 1} of ${product.name}`}
                            aria-pressed={selectedImage === image}
                            onClick={() => setSelectedImage(image)}
                        >
                            <img src={image} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductGallery;
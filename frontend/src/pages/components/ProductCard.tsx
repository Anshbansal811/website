import { Link } from "react-router-dom";
import { useState } from "react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    type: string;
    description: string;
    variation: {
      color: string;
      mrp: number;
      stock: number;
    };
    images: {
      front: string;
      back: string;
      left?: string;
      right?: string;
      top?: string;
      bottom?: string;
      details: string[];
      others: string[];
    };
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create an array of all available images
  const allImages = [
    product.images.front,
    product.images.back,
    product.images.left,
    product.images.right,
    product.images.top,
    product.images.bottom,
    ...product.images.details,
    ...product.images.others,
  ].filter(Boolean); // Remove any undefined/null values

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="relative">
          <img
            className="w-full h-64 object-contain object-center"
            src={allImages[currentImageIndex]}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                →
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-gray-600 text-sm">{product.type}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              RS {product.variation.mrp.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.variation.stock}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

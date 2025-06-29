import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/types"; //in// Type for a single image card
import { useAuth } from "../../contexts/auth-context";
import { useNavigate, useLocation } from "react-router-dom";

export interface ImageCard {
  productId: string;
  productName: string;
  productType: string;
  description: string;
  variationColor: string;
  mrp: number;
  stock: number;
  imageUrl: string;
  imageType: string;
}

// Utility to flatten products into image cards
export function flattenProductsToImageCards(products: Product[]): ImageCard[] {
  const cards: ImageCard[] = [];
  products.forEach((product) => {
    product.variations.forEach((variation) => {
      variation.images.forEach((imageGroup) => {
        imageGroup.images.forEach((image) => {
          cards.push({
            productId: product.id,
            productName: product.name,
            productType: product.type.name,
            description: product.description,
            variationColor: variation.color,
            mrp: variation.mrp,
            stock: variation.stock,
            imageUrl: image.url,
            imageType: image.imageType.name,
          });
        });
      });
    });
  });
  return cards;
}

interface ProductCardProps {
  card: ImageCard;
  page?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ card, page }) => {
  const [zoomed, setZoomed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to signup, preserve intended action and product info
      navigate("/signup", {
        state: {
          from: location,
          addToCartAfterAuth: true,
          productId: card.productId,
          variationColor: card.variationColor,
        },
        replace: false,
      });
      return;
    }
    // TODO: Implement actual add to cart logic here
    alert("Added to cart! (placeholder)");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full max-w-xs mx-auto border border-gray-200">
      <div className="relative flex justify-center items-center h-70 bg-gray-50">
        <Link
          to={page === "shope" ? `/product/${card.productId}` : "#"}
          className="w-full flex justify-center items-center"
        >
          <img
            src={card.imageUrl}
            alt={card.productName + " image"}
            className="object-contain h-48 w-auto transition-transform duration-300"
            loading="lazy"
            width={250}
            height={300}
            style={{ cursor: "zoom-in" }}
          />
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 z-30"
          onClick={() => setZoomed(true)}
          tabIndex={-1}
        >
          {/* Zoom in icon (plus in magnifier) */}
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="11" y1="8" x2="11" y2="14" strokeWidth="2" />
            <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
          </svg>
        </button>
        {/* Modal Overlay for Zoomed Image */}
        {zoomed && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={() => setZoomed(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={card.imageUrl}
                alt={card.productName + " zoomed"}
                className="max-h-[80vh] max-w-[90vw] rounded shadow-lg bg-white"
                style={{ objectFit: "contain" }}
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100"
                onClick={() => setZoomed(false)}
                aria-label="Close zoom"
              >
                {/* Close (X) icon */}
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
                  <line x1="6" y1="18" x2="18" y2="6" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="font-semibold text-base text-gray-900 truncate text-center">
            {card.productType}
          </h3>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
            Article: {card.productName}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Color: {card.variationColor}
          </p>
        </div>
        {page === "shope" && (
          <>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ₹{card.mrp}
              </span>
              <span className="text-xs text-gray-500">Stock: {card.stock}</span>
            </div>
            <button
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/types"; //in// Type for a single image card
import { useAuth } from "../../contexts/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/axios";

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
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);
  const [place, setPlace] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [quantity, setQuantity] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location,
          addToCartAfterAuth: true,
          productId: card.productId,
        },
        replace: false,
      });
      return;
    }
    try {
      await api.post("/cart/add", { productId: card.productId, quantity: 1 });
      alert("Added to cart!");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to add to cart");
    }
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location,
          buyAfterAuth: true,
          productId: card.productId,
        },
        replace: false,
      });
      return;
    }
    setShowBuyModal(true);
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyLoading(true);
    setBuyError(null);
    setBuySuccess(null);
    try {
      await api.post("/purchase/buy", {
        productId: card.productId,
        place,
        state,
        city,
      });
      setBuySuccess("Purchase successful!");
      setShowBuyModal(false);
      setPlace("");
      setState("");
      setCity("");
    } catch (error: any) {
      setBuyError(error.response?.data?.error || "Failed to complete purchase");
    } finally {
      setBuyLoading(false);
    }
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
            <button
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-colors"
              onClick={handleBuyClick}
            >
              Buy
            </button>
            {/* Buy Modal */}
            {showBuyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <form
                  className="bg-white p-6 rounded shadow-lg w-full max-w-sm"
                  onSubmit={handleBuySubmit}
                >
                  <h2 className="text-xl font-bold mb-4">
                    Enter Delivery Details
                  </h2>
                  <input
                    type="text"
                    placeholder="Place"
                    className="w-full mb-2 p-2 border rounded"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full mb-2 p-2 border rounded"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full mb-4 p-2 border rounded"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  {buyError && (
                    <div className="text-red-600 mb-2">{buyError}</div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setShowBuyModal(false)}
                      disabled={buyLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={buyLoading}
                    >
                      {buyLoading ? "Processing..." : "Buy Now"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

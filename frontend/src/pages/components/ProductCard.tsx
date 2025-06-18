import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/types";

interface ProductCardProps {
  key: string;
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ key, product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full max-w-xs mx-auto border border-gray-200">
      <Link
        to={`/product/${product._id}`}
        className="flex justify-center items-center p-4 h-64 bg-gray-50"
      >
        <img
          src={product.images.front}
          alt={product.name}
          className="object-contain h-48 w-auto"
          loading="lazy"
          width={200}
          height={240}
        />
      </Link>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="font-semibold text-base text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
            {product.type}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.variation.mrp}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {product.variation.stock}
          </span>
        </div>
        <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

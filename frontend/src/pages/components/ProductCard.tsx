import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface Product {
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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={product.images.front}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            width={400}
            height={400}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.type}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.variation.mrp}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.variation.stock}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

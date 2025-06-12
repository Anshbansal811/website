import { Link } from "react-router-dom";

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
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <img
          className="w-full h-64 object-fill object-center"
          src={product.images.front}
          alt={product.name}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-gray-600 text-sm">{product.type}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              RS {product.variation.mrp.toFixed(2)}
            </span>
            {/* Add more product details or actions here if needed */}
          </div>
        </div>
      </div>
    </Link>
  );
};

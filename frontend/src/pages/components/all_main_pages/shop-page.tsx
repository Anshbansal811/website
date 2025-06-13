import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import api from "../../../utils/axios";

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

const Shopepage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products"); // Assuming this is your endpoint to fetch all products
        setProducts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mt-10 mb-8">
        Welcome to Our Shop
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Shopepage;
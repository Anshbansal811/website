import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard, {
  flattenProductsToImageCards,
  ImageCard,
} from "../ProductCard";
import api from "../../../utils/axios";
import { Product } from "../../../types/types";

const Shopepage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/allproduct");
        console.log(response);
        // Filter out any productswith null variations
        const validProducts = response.data.filter(
          (product: any) => product.variation !== null
        );
        setProducts(validProducts);
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

  const imageCards: ImageCard[] = flattenProductsToImageCards(products);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mt-10 mb-8">
        Welcome to Our Shop
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {imageCards.length > 0 ? (
          imageCards.map((card, idx) => (
            <ProductCard card={card} page={"shope"} />
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

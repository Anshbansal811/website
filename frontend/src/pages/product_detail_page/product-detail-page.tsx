import { useEffect, useState } from "react";
import { SidePanel } from "../side_panel/side-panel";
import api from "../../utils/axios";

/* {loading ? (
            <p>Loading contacts...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (*/

const ProductDetailPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/allproductdetails?page=${page}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="flex flex-row">
      <SidePanel />
      <div className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Product Detail
          </h2>
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      color Name And Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </>
          .
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;

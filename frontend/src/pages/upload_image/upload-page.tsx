import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { SidePanel } from "../../pages/side_panel/side-panel";

interface FormData {
  quantity: string;
  productType: string;
  color: string;
  mrp?: string;
  productName: string;
  description: string;
  existingProductId?: string;
}

interface ExistingProduct {
  _id: string;
  name: string;
  type: string;
}

interface ImageFiles {
  front: File | null;
  back: File | null;
  left: File | null;
  right: File | null;
  top: File | null;
  bottom: File | null;
  details: File[];
  others: File[];
}

interface ImagePreview {
  id: string;
  url: string;
  type: string;
  file: File;
}

export const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<ImageFiles>({
    front: null,
    back: null,
    left: null,
    right: null,
    top: null,
    bottom: null,
    details: [],
    others: [],
  });
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    quantity: "",
    productType: "",
    color: "",
    mrp: "",
    productName: "",
    description: "",
    existingProductId: undefined,
  });

  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>(
    []
  );
  const [selectedExistingProductId, setSelectedExistingProductId] =
    useState<string>("");

  useEffect(() => {
    const fetchExistingProducts = async () => {
      try {
        const response = await api.get<ExistingProduct[]>("/products/existing");
        setExistingProducts(response.data);
      } catch (err: any) {
        console.error("Error fetching existing products:", err);
      }
    };
    fetchExistingProducts();
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: keyof ImageFiles
  ) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    // Update selected files
    setSelectedFiles((prev) => ({
      ...prev,
      [type]:
        type === "details" || type === "others" ? [...prev[type], file] : file,
    }));

    // Create preview
    const preview: ImagePreview = {
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      type,
      file,
    };

    setPreviews((prev) => [...prev, preview]);
  };

  const removeImage = (id: string) => {
    setPreviews((prev) => {
      const preview = prev.find((p) => p.id === id);
      if (!preview) return prev;

      // Remove from selected files
      setSelectedFiles((current) => {
        if (preview.type === "details" || preview.type === "others") {
          return {
            ...current,
            [preview.type]: current[preview.type].filter(
              (f) => f !== preview.file
            ),
          };
        }
        return {
          ...current,
          [preview.type]: null,
        };
      });

      return prev.filter((p) => p.id !== id);
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "existingProductId") {
      setSelectedExistingProductId(value);
      if (value === "") {
        // Reset product name and type if no existing product is selected
        setFormData((prev) => ({
          ...prev,
          productName: "",
          productType: "",
          description: "",
        }));
      } else {
        // Populate product name and type if an existing product is selected
        const selectedProduct = existingProducts.find((p) => p._id === value);
        if (selectedProduct) {
          setFormData((prev) => ({
            ...prev,
            productName: selectedProduct.name,
            productType: selectedProduct.type,
            description: "", // Description should be manually entered for new variations
          }));
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.front || !selectedFiles.back) {
      setError("Front and back images are required");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Conditionally append product details or existing product ID
      if (selectedExistingProductId) {
        formDataToSend.append("existingProductId", selectedExistingProductId);
      } else {
        formDataToSend.append("productName", formData.productName);
        formDataToSend.append("productType", formData.productType);
        formDataToSend.append("description", formData.description);
      }
      formDataToSend.append("color", formData.color);
      formDataToSend.append("mrp", formData.mrp || "");
      formDataToSend.append("quantity", formData.quantity);

      // Append images
      formDataToSend.append("frontImage", selectedFiles.front);
      formDataToSend.append("backImage", selectedFiles.back);
      if (selectedFiles.left)
        formDataToSend.append("leftImage", selectedFiles.left);
      if (selectedFiles.right)
        formDataToSend.append("rightImage", selectedFiles.right);
      if (selectedFiles.top)
        formDataToSend.append("topImage", selectedFiles.top);
      if (selectedFiles.bottom)
        formDataToSend.append("bottomImage", selectedFiles.bottom);

      // Append detail images
      selectedFiles.details.forEach((file) => {
        formDataToSend.append("detailImages", file);
      });

      // Append other images
      selectedFiles.others.forEach((file) => {
        formDataToSend.append("otherImages", file);
      });

      const response = await api.post("/products/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Clear form after successful upload
        setSelectedFiles({
          front: null,
          back: null,
          left: null,
          right: null,
          top: null,
          bottom: null,
          details: [],
          others: [],
        });
        setPreviews([]);
        setFormData({
          quantity: "",
          productType: "",
          color: "",
          mrp: "",
          productName: "",
          description: "",
          existingProductId: undefined,
        });
        setSelectedExistingProductId(""); // Reset selected existing product

        // Show success message
        alert("Product uploaded successfully!");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to upload product. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-row">
      <SidePanel />
      <div className="py-2 w-64 flex-1">
        <div className="bg-white shadow rounded-lg p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upload Product
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <label className="col-span-3">
                <div className="text-gray-700">
                  Select Existing Product (Optional)
                </div>
                <select
                  name="existingProductId"
                  value={selectedExistingProductId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                >
                  <option value="">-- Create New Product --</option>
                  {existingProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.type})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Product Quantity
                </div>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max="100"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="Quantity"
                  required
                />
              </label>

              <label>
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Product Type
                </div>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="Enter product type"
                  required={!selectedExistingProductId}
                  disabled={!!selectedExistingProductId}
                />
              </label>

              <label>
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Color
                </div>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="Enter color"
                  required
                />
              </label>

              <label>
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  MRP
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    RS
                  </span>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                    placeholder="Enter price"
                  />
                </div>
              </label>

              <label className="col-span-2">
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Product Name
                </div>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="Enter product name"
                  required={!selectedExistingProductId}
                  disabled={!!selectedExistingProductId}
                />
              </label>

              <label className="col-span-3">
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Product Description
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="Enter product description"
                  rows={3}
                  required={!selectedExistingProductId}
                  disabled={!!selectedExistingProductId}
                />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Required Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "front")}
                    className="hidden"
                    id="front-upload"
                  />
                  <label
                    htmlFor="front-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Upload Front Image
                  </label>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Back Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "back")}
                    className="hidden"
                    id="back-upload"
                  />
                  <label
                    htmlFor="back-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Upload Back Image
                  </label>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900">
                Additional Views
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["left", "right", "top", "bottom"].map((view) => (
                  <div
                    key={view}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {view.charAt(0).toUpperCase() + view.slice(1)} Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e, view as keyof ImageFiles)
                      }
                      className="hidden"
                      id={`${view}-upload`}
                    />
                    <label
                      htmlFor={`${view}-upload`}
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Upload {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                      Image
                    </label>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "details")}
                  className="hidden"
                  id="details-upload"
                  multiple
                />
                <label
                  htmlFor="details-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload Detail Images
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "others")}
                  className="hidden"
                  id="others-upload"
                  multiple
                />
                <label
                  htmlFor="others-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload Other Images
                </label>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Preview ({previews.length} images)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((preview) => (
                    <div
                      key={preview.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="aspect-square w-full relative">
                        <img
                          src={preview.url}
                          alt={`${preview.type} preview`}
                          className="w-full h-full object-contain bg-gray-50"
                        />
                        <button
                          onClick={() => removeImage(preview.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2 text-center text-sm text-gray-600">
                        {preview.type.charAt(0).toUpperCase() +
                          preview.type.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <button
              onClick={handleUpload}
              disabled={
                !selectedFiles.front || !selectedFiles.back || uploading
              }
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !selectedFiles.front || !selectedFiles.back || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

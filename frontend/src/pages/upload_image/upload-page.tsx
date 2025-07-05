import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { SidePanel } from "../../pages/side_panel/side-panel";
import {
  ExistingProduct,
  ImageFiles,
  ImagePreview,
  FormData,
  ProductType,
  Size,
  SizeQuantity,
} from "./types";

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to compress image
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        0.7
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

const UploadPage = () => {
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
    productType: "",
    color: "",
    mrp: "",
    productName: "",
    description: "",
    existingProductId: undefined,
    sizes: [],
  });

  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>(
    []
  );
  const [productsType, setProductsType] = useState<ProductType[]>([]);
  const [selectedExistingProductId, setSelectedExistingProductId] =
    useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeQuantity, setSizeQuantity] = useState<number>(1);
  const [compressingImage, setCompressingImage] = useState(false);

  useEffect(() => {
    const fetchExistingProducts = async () => {
      try {
        const response = await api.get<{
          existingProductName: ExistingProduct[];
          productsType: ProductType[];
          size: Size[];
        }>("/products/existing");
        setExistingProducts(response.data.existingProductName);
        setProductsType(response.data.productsType);
        setAvailableSizes(response.data.size);
        console.log("Size:", response.data.size);
      } catch (err: any) {
        console.error("Error fetching existing products:", err);
      }
    };
    fetchExistingProducts();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: keyof ImageFiles
  ) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    setCompressingImage(true);
    setError("");

    try {
      // Compress the image before storing
      const compressedFile = await compressImage(file);

      // Update selected files
      setSelectedFiles((prev) => ({
        ...prev,
        [type]:
          type === "details" || type === "others"
            ? [...prev[type], compressedFile]
            : compressedFile,
      }));

      // Remove existing preview of the same type (for single images)
      if (type !== "details" && type !== "others") {
        setPreviews((prev) => prev.filter((p) => p.type !== type));
      }

      // Create preview
      const preview: ImagePreview = {
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(compressedFile),
        type,
        file: compressedFile,
      };

      setPreviews((prev) => [...prev, preview]);
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to process image. Please try again.");
    } finally {
      setCompressingImage(false);
    }
  };

  const removeImage = (id: string) => {
    setPreviews((prev) => {
      const preview = prev.find((p) => p.id === id);
      if (!preview) return prev;

      // Remove from selected files
      setSelectedFiles((current) => {
        if (preview.type === "details" || preview.type === "others") {
          // For arrays, we need to find the file by comparing the preview file
          const updatedArray = current[preview.type].filter(
            (f) => f !== preview.file
          );
          return {
            ...current,
            [preview.type]: updatedArray,
          };
        }
        // For single files, set to null
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
          mrp: "",
        }));
      } else {
        // Populate product name and type if an existing product is selected
        const selectedProduct = existingProducts.find((p) => p.id === value);
        if (selectedProduct) {
          setFormData((prev) => ({
            ...prev,
            productName: selectedProduct.name,
            productType:
              productsType.find((pt) => pt.name === selectedProduct.type.name)
                ?.id || "",
            description: "", // Description should be manually entered for new variations
          }));
        }
      }
    }
  };

  const addSizeQuantity = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    if (sizeQuantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    const size = availableSizes.find((s) => s.id.toString() === selectedSize);
    console.log("Selected Size:", size);
    if (size) {
      const newSizeQuantity = {
        sizeId: selectedSize,
        sizeName: size.name,
        quantity: sizeQuantity,
      };
      const existingIndex = formData.sizes.findIndex(
        (s) => s.sizeId === selectedSize
      );
      if (existingIndex >= 0) {
        setFormData((prev) => ({
          ...prev,
          sizes: prev.sizes.map((s, idx) =>
            idx === existingIndex ? newSizeQuantity : s
          ),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          sizes: [...prev.sizes, newSizeQuantity],
        }));
      }
      setError("");
      setSelectedSize("");
      setSizeQuantity(1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSizeQuantity();
    }
  };

  const clearAllSizes = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [],
    }));
    setError(""); // Clear any previous errors
  };

  const removeSizeQuantity = (sizeId: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.sizeId !== sizeId),
    }));
  };

  const handleUpload = async () => {
    if (!selectedFiles.front || !selectedFiles.back) {
      setError("Front and back images are required");
      return;
    }

    if (formData.sizes.length === 0) {
      setError("At least one size with quantity is required");
      return;
    }

    if (!formData.color) {
      setError("Color is required");
      return;
    }

    if (!formData.description) {
      setError("Description is required");
      return;
    }

    if (
      formData.mrp &&
      (isNaN(Number(formData.mrp)) || Number(formData.mrp) <= 0)
    ) {
      setError("MRP must be a valid positive number");
      return;
    }

    if (!selectedExistingProductId) {
      if (!formData.productName) {
        setError("Product name is required when creating a new product");
        return;
      }
      if (!formData.productType) {
        setError("Product type is required when creating a new product");
        return;
      }
    }

    setUploading(true);
    setError("");

    try {
      // Lazy load the image conversion functions
      const convertToBase64 = async (file: File | null) => {
        if (!file) return null;
        return await fileToBase64(file);
      };

      const convertArrayToBase64 = async (files: File[]) => {
        return Promise.all(files.map(fileToBase64));
      };

      // Lazy load the request data construction
      const requestData = await (async () => {
        const [
          frontImage,
          backImage,
          leftImage,
          rightImage,
          topImage,
          bottomImage,
          detailImages,
          otherImages,
        ] = await Promise.all([
          convertToBase64(selectedFiles.front),
          convertToBase64(selectedFiles.back),
          convertToBase64(selectedFiles.left),
          convertToBase64(selectedFiles.right),
          convertToBase64(selectedFiles.top),
          convertToBase64(selectedFiles.bottom),
          convertArrayToBase64(selectedFiles.details),
          convertArrayToBase64(selectedFiles.others),
        ]);

        return {
          // Product details
          productName: formData.productName,
          productType: formData.productType,
          description: formData.description,
          color: formData.color,
          mrp: formData.mrp,
          sizes: formData.sizes,
          existingProductId: selectedExistingProductId || undefined,

          // Converted images
          frontImage,
          backImage,
          leftImage,
          rightImage,
          topImage,
          bottomImage,
          detailImages,
          otherImages,
        };
      })();

      // Lazy load the API call
      const response = await api.post("/products/upload", requestData);

      if (response.data.success) {
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
          productType: "",
          color: "",
          mrp: "",
          productName: "",
          description: "",
          existingProductId: undefined,
          sizes: [],
        });
        setSelectedExistingProductId("");
        setSelectedSize("");
        setSizeQuantity(1);

        // Clear file input
        const fileInput = document.getElementById(
          "image-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }

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
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.type.name})
                    </option>
                  ))}
                </select>
              </label>

              <div className="col-span-3">
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] mb-2">
                  Product Sizes & Quantities
                </div>
                <div className="space-y-4">
                  {/* Size selection form */}
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Size
                      </label>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                      >
                        <option value="">Select size</option>
                        {availableSizes.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={sizeQuantity}
                        onChange={(e) =>
                          setSizeQuantity(parseInt(e.target.value) || 1)
                        }
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                        placeholder="Quantity (press Enter to add)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addSizeQuantity}
                      disabled={!selectedSize || sizeQuantity <= 0}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        !selectedSize || sizeQuantity <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Add
                    </button>
                  </div>

                  {/* Display selected sizes */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Selected Sizes ({formData.sizes.length}):
                      </h4>
                      {formData.sizes.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAllSizes}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.sizes.map((sizeQty) => (
                        <div
                          key={sizeQty.sizeId}
                          className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center p-3"
                        >
                          <div className="font-bold text-gray-800">
                            {sizeQty.sizeName}
                          </div>
                          <div className="text-gray-700">
                            Qty: {sizeQty.quantity}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSizeQuantity(sizeQty.sizeId)}
                            className="mt-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 rounded"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Type field: show as text if existing product is selected, else dropdown */}
              <label>
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Product Type
                </div>
                {selectedExistingProductId ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
                    {(() => {
                      const selectedProduct = existingProducts.find(
                        (p) => p.id === selectedExistingProductId
                      );
                      return selectedProduct ? selectedProduct.type.name : "";
                    })()}
                  </div>
                ) : (
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                    required={!selectedExistingProductId}
                  >
                    <option value="">Select Product Type</option>
                    {productsType.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                )}
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
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </label>

              <label className="col-span-2">
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Article Number/Name
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
                  Description
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload Images
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Image Type
                    </label>
                    <select
                      id="image-type-select"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                    >
                      <option value="">Select image type</option>
                      <option value="front">Front Image</option>
                      <option value="back">Back Image</option>
                      <option value="left">Left Image</option>
                      <option value="right">Right Image</option>
                      <option value="top">Top Image</option>
                      <option value="bottom">Bottom Image</option>
                      <option value="details">Detail Images</option>
                      <option value="others">Other Images</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      className="hidden"
                      onChange={(e) => {
                        const select = document.getElementById(
                          "image-type-select"
                        ) as HTMLSelectElement;
                        const type = select.value as keyof ImageFiles;
                        if (type) {
                          handleFileChange(e, type);
                          select.value = ""; // Reset selection after upload
                        } else {
                          setError("Please select an image type first");
                        }
                      }}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      3D Preview ({previews.length} images)
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
              </div>
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <button
              onClick={handleUpload}
              disabled={
                !selectedFiles.front ||
                !selectedFiles.back ||
                formData.sizes.length === 0 ||
                !formData.color ||
                !formData.description ||
                (!selectedExistingProductId && !formData.productName) ||
                (!selectedExistingProductId && !formData.productType) ||
                uploading ||
                compressingImage
              }
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !selectedFiles.front ||
                !selectedFiles.back ||
                formData.sizes.length === 0 ||
                !formData.color ||
                !formData.description ||
                (!selectedExistingProductId && !formData.productName) ||
                (!selectedExistingProductId && !formData.productType) ||
                uploading ||
                compressingImage
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading
                ? "Uploading..."
                : compressingImage
                ? "Processing Image..."
                : "Upload Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

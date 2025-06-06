import { useState } from "react";
import api from "../../utils/axios";
import { SidePanel } from "../../pages/side_panel/side-panel";

export const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      await api.post("/upload/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Handle successful upload
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (err) {
      setError("Failed to upload photo. Please try again.");
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
              Upload Photo
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label>
                <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
                  Email
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  placeholder="you@example.com"
                />
              </label>
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                  required
                />
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Select Photo
              </label>
              <p className="mt-2 text-sm text-gray-500">
                or drag and drop your photo here
              </p>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Preview
                </h3>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-md rounded-lg shadow-md"
                />
              </div>
            )}

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !selectedFile || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

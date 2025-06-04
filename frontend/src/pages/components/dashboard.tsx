import { SidePanel } from "../../pages/side_panel/side-panel";
import { useAuth } from "../../contexts/auth-context";
import { Contact, UserRole } from "../../types/auth";
import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import {
  CorporateDashboard,
  RetailerDashboard,
  SellerDashboard,
} from "./all_dashboard";

// Helper components for different views within the dashboard main area
const ContactsView = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get("/contact/all");
        setContacts(data);
      } catch (err) {
        setError("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacts</h2>
      {loading ? (
        <p>Loading contacts...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.phonenumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const UploadView = () => {
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
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Photo</h2>

      <div className="space-y-6">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview</h3>
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
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<
    "dashboard" | "contacts" | "upload"
  >("dashboard");
  const [isSidePanelCollapsed, setIsSidePanelCollapsed] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement>(null);

  const toggleSidePanel = () => {
    setIsSidePanelCollapsed(!isSidePanelCollapsed);
  };

  // Close side panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidePanelRef.current &&
        !sidePanelRef.current.contains(event.target as Node)
      ) {
        setIsSidePanelCollapsed(true);
      }
    };

    // Add event listener only when side panel is not collapsed (i.e., open or expanding)
    if (!isSidePanelCollapsed) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidePanelCollapsed]); // Re-run effect when side panel state changes

  const renderMainContent = () => {
    if (user?.role !== UserRole.SELLER) {
      // Render original role-specific dashboard content for non-sellers
      switch (user?.role) {
        case UserRole.RETAILER:
          return <RetailerDashboard user={user} />;
        case UserRole.CORPORATE:
          return <CorporateDashboard user={user} />;
        default:
          return (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard
              </h2>
              <p className="text-gray-600">
                Welcome to your dashboard. Please select a role to access
                specific features.
              </p>
            </div>
          );
      }
    } else {
      // Render seller-specific views based on activeView state
      switch (activeView) {
        case "contacts":
          return <ContactsView />;
        case "upload":
          return <UploadView />;
        case "dashboard":
        default:
          return <SellerDashboard user={user} />;
      }
    }
  };

  // Dynamically adjust main content margin and padding based on side panel state, role, and footer height
  const mainContentClasses = `flex-1 p-8 transition-all duration-300 pt-16 pb-24 ${
    user?.role === UserRole.SELLER
      ? isSidePanelCollapsed
        ? "lg:ml-16"
        : "lg:ml-64"
      : "mx-auto sm:px-6 lg:px-8"
  }`;

  return (
    <div className="flex">
      {user?.role === UserRole.SELLER && (
        <div ref={sidePanelRef}>
          <SidePanel
            isCollapsed={isSidePanelCollapsed}
            toggleCollapse={toggleSidePanel}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </div>
      )}
      <div className={mainContentClasses}>{renderMainContent()}</div>
    </div>
  );
};

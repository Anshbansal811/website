import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth";
import api from "../../utils/axios";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("User role:", user?.role);

  useEffect(() => {
    const fetchContacts = async () => {
      if (user?.role === UserRole.SELLER) {
        try {
          const { data } = await api.get("/contact/all");
          console.log("Fetched contacts:", data);
          setContacts(data);
        } catch (err) {
          setError("Failed to load contacts");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  const renderRoleSpecificContent = () => {
    switch (user?.role) {
      case UserRole.RETAILER:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Retailer Dashboard
            </h2>
            <p className="text-gray-600">
              Welcome to your retailer dashboard. Here you can manage your
              products and connect with sellers.
            </p>
            {/* Add retailer-specific features here */}
          </div>
        );

      case UserRole.CORPORATE:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Corporate Dashboard
            </h2>
            <p className="text-gray-600">
              Welcome to your corporate dashboard. Here you can manage your
              business relationships and operations.
            </p>
            {/* Add corporate-specific features here */}
          </div>
        );

      case UserRole.SELLER:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Seller Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to your seller dashboard. Here you can manage your
              products and view customer inquiries.
            </p>

            {loading ? (
              <p>Loading contacts...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Contact Inquiries
                </h3>
                {contacts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
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
                              {contact.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {contact.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                contact.created_at
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No contact inquiries yet.</p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
            <p className="text-gray-600">
              Welcome to your dashboard. Please select a role to access specific
              features.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {renderRoleSpecificContent()}
    </div>
  );
};


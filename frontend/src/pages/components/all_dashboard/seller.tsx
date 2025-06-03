import { Contact, User } from "types/auth";
import { useState, useEffect } from "react";
import api from "../../../utils/axios";

type SellerDashboardProps = {
  user: User;
};

export const SellerDashboard = ({ user }: SellerDashboardProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get("/contact/all");
        console.log("Fetched contacts:", data);
        setContacts(data);
      } catch (err) {
        setError("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        <span className="text-gray-700">Welcome, {user?.name}</span>
      </h2>
      <p className="text-gray-600 mb-6">
        Welcome to your seller dashboard. Here you can manage your products and
        view customer inquiries.
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
                  {contacts.map((contact: Contact) => (
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
          ) : (
            <p className="text-gray-500">No contact inquiries yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";
import { Contact } from "../../types/types";
import api from "../../utils/axios";
import { SidePanel } from "../../pages/side_panel/side-panel";
import dayjs from "dayjs";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchContacts = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/contact/all?page=${page}`);
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-row">
      <SidePanel />
      <div className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacts</h2>

          {loading ? (
            <p>Loading contacts...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
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
                        company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        gstPan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        message
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dayjs(contact.createdAt)
                            .locale("en-ind")
                            .format("DD/MM/YYYY")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {contact.city}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {contact.state}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {contact.gstPan}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {contact.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.currentPage} of{" "}
                    {pagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`px-4 py-2 border rounded-md ${
                        pagination.hasPreviousPage
                          ? "bg-white text-gray-700 hover:bg-gray-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`px-4 py-2 border rounded-md ${
                        pagination.hasNextPage
                          ? "bg-white text-gray-700 hover:bg-gray-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage

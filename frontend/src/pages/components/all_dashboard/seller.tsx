import { Link } from "react-router";
import { User } from "types/auth";

type SellerDashboardProps = {
  user: User;
};

export const SellerDashboard = ({ user }: SellerDashboardProps) => {
  return (
    <div className="flex-1 p-1">
      <div className="bg-orange-100 shadow-lg rounded-lg p-6 mb-6 relative">
        <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md text-sm text-gray-700">
          <Link
            to="/dashboard/contacts"
            className={`flex items-center text-gray-700 rounded-lg hover:bg-gray-100 transition-colors `}
          >
            Contacts
          </Link>
        </div>

        <div className="flex">
          <div className="text-2xl font-bold text-gray-900">{user?.name}</div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-6">
          Welcome to your seller dashboard. Here you can manage your products
          and view customer inquiries.
        </p>
      </div>
    </div>
  );
};

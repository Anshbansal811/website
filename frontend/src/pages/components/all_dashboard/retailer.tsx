import { User } from "types/auth";

type RetailerDashboardProps = {
  user: User;
};

export const RetailerDashboard = ({ user }: RetailerDashboardProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        <span className="text-gray-700">Welcome, {user?.name}</span>
      </h2>
      <p className="text-gray-600">
        Welcome to your retailer dashboard. Here you can manage your products and
        connect with sellers.
      </p>
      {/* Add retailer-specific features here */}
    </div>
  );
};

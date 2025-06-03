import { User } from "types/auth";

type CorporateDashboardProps = {
  user: User;
};

export const CorporateDashboard = ({ user }: CorporateDashboardProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        <span className="text-gray-700">Welcome, {user?.name}</span>
      </h2>
      <p className="text-gray-600">
        Welcome to your corporate dashboard. Here you can manage your business
        relationships and operations.
      </p>
      {/* Add corporate-specific features here */}
    </div>
  );
};

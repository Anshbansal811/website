import { useAuth } from "../../contexts/auth-context";
import { UserRole, Contact } from "../../types/auth";
import {
  CorporateDashboard,
  RetailerDashboard,
  SellerDashboard,
} from "./all_dashboard";

export const Dashboard = () => {
  const { user } = useAuth();
  console.log("User role:", user?.role);

  const renderRoleSpecificContent = () => {
    switch (user?.role) {
      case UserRole.RETAILER:
        return <RetailerDashboard user={user} />;

      case UserRole.CORPORATE:
        return <CorporateDashboard user={user} />;

      case UserRole.SELLER:
        return <SellerDashboard user={user} />;

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

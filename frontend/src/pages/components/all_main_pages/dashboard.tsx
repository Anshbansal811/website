import { SidePanel } from "../../../pages/side_panel/side-panel";
import { useAuth } from "../../../contexts/auth-context";
import { UserRole } from "../../../types/types";
import {
  CorporateDashboard,
  RetailerDashboard,
  SellerDashboard,
} from "../all_dashboard";

export const Dashboard = () => {
  const { user } = useAuth();

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
      return <SellerDashboard user={user} />;
    }
  };
  return (
    <div className="flex flex-row">
      {user?.role === UserRole.SELLER && <SidePanel />}
      <div className="py-2 w-64 flex-1">{renderMainContent()}</div>
    </div>
  );
};

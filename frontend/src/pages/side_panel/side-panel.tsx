import { Link, useLocation } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

interface SidePanelProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeView: "dashboard" | "contacts" | "upload";
  setActiveView: Dispatch<SetStateAction<"dashboard" | "contacts" | "upload">>;
}

export const SidePanel = ({
  isCollapsed,
  toggleCollapse,
  activeView,
  setActiveView,
}: SidePanelProps) => {
  const location = useLocation(); // Although we navigate via state now, keep useLocation for potential future use or initial active state.

  const isActive = (view: "dashboard" | "contacts" | "upload") => {
    return activeView === view;
  };

  return (
    <div
      className={`bg-white shadow-lg h-full transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } hidden lg:flex z-40`}
    >
      <div className="flex flex-col h-full w-full">
        <div className="px-2 py-4 flex flex-col justify-between h-full">
          <div>
            {!isCollapsed && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Dashboard Menu
              </h2>
            )}

            <nav className="space-y-2">
              <Link
                to="#"
                onClick={() => setActiveView("dashboard")}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  isActive("dashboard") ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-3"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {!isCollapsed && "Dashboard"}
              </Link>

              <Link
                to="#"
                onClick={() => setActiveView("contacts")}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  isActive("contacts") ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-3"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {!isCollapsed && "Contacts"}
              </Link>

              <Link
                to="#"
                onClick={() => setActiveView("upload")}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  isActive("upload") ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-3"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {!isCollapsed && "Upload Photo"}
              </Link>
            </nav>
          </div>

          {/* Collapse Button */}
          <div className="flex justify-end mb-2 w-full pr-2">
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none lg:block hidden"
              aria-label={
                isCollapsed ? "Expand side panel" : "Collapse side panel"
              }
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

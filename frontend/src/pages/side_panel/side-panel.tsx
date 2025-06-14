import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export const SidePanel = () => {
  const [isSidePanelCollapsed, setIsSidePanelCollapsed] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  return (
    <div className="bg-white shadow-lg h-screen transition-all duration-300 hidden lg:flex z-40 sticky top-0">
      <div className="flex flex-col h-full w-full">
        <div className="px-2 py-4 flex flex-col h-full">
          <div className="flex-1">
            {!isSidePanelCollapsed && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Dashboard Menu
              </h2>
            )}
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${
                    isSidePanelCollapsed ? "mr-0" : "mr-3"
                  }`}
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
                {!isSidePanelCollapsed && "Dashboard"}
              </Link>

              <Link
                to="/dashboard/contacts"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors "
              >
                <svg
                  className={`w-5 h-5 ${
                    isSidePanelCollapsed ? "mr-0" : "mr-3"
                  }`}
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
                {!isSidePanelCollapsed && "contacts"}
              </Link>

              <Link
                to="/dashboard/upload"
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  location.pathname === "/dashboard/upload"
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    isSidePanelCollapsed ? "mr-0" : "mr-3"
                  }`}
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
                {!isSidePanelCollapsed && "upload photo"}
              </Link>

              <Link
                to="/dashboard/products"
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  location.pathname === "/dashboard/products"
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    isSidePanelCollapsed ? "mr-0" : "mr-3"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                {!isSidePanelCollapsed && "Products"}
              </Link>
            </nav>
          </div>

          {/* Collapse Button */}
          <div className="flex justify-end w-full pr-2 mt-auto">
            <button
              onClick={toggleSidePanel}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none lg:block hidden"
              aria-label={
                isSidePanelCollapsed
                  ? "Expand side panel"
                  : "Collapse side panel"
              }
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isSidePanelCollapsed ? "rotate-180" : "rotate-0"
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

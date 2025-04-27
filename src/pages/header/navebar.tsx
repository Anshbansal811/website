import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="bg-gray shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-dark">
            <span className="text-modus-orange">W</span>e{" "}
            <span className="text-modus-orange">I</span>nvent{" "}
            <span className="text-modus-orange">C</span>o.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <nav className="space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link to="/Shop" className="text-gray-700 hover:text-gray-900">
                Shop
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            <div className="ml-6 flex items-center space-x-4">
              <button
                aria-label="Cart"
                className="text-gray-600 hover:text-modus-orange"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-gray-600 hover:text-modus-orange"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="space-y-4">
              <Link to="/" className="block text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link
                to="/Shop"
                className="block text-gray-700 hover:text-gray-900"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-gray-900"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-gray-900"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

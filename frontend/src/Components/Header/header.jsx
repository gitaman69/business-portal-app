import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Get current route

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if the current page is Billing Page
  const isBillingPage = location.pathname === "/dashboard";

  return (
    <header className="sticky top-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/*Mobile menu icon */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden block text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        {/*Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-4">
        <Link
            to="/inventory"
          >
            <button className="btn btn-neutral">Inventory</button>
          </Link>
          <Link
            to="/addProduct"
          >
            <button className="btn btn-neutral">Add Product</button>
          </Link>
          <Link
            to="/expenseTracker"
          >
            <button className="btn btn-neutral">Expense Tracker</button>
          </Link>
          <Link
            to="/dataEntry"
          >
             <button className="btn btn-neutral">Data Entry</button>
          </Link>
          {/* Conditionally show Billing Page button if not on Billing Page */}
          {!isBillingPage && (
            <Link
              to="/dashboard"
            >
               <button className="btn btn-soft">Go to Billing Page</button>
            </Link>
          )}
        </div>
        <div className="relative">
          {user ? (
            <>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span className="font-medium">{user.fullName || "User"}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isUserMenuOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <div className="font-semibold">{user.fullName}</div>
                    <div className="text-green-500 font-bold">
                      License ID: {user.licenseId || "N/A"}
                    </div>
                  </div>
                  {/* Add Bill Data and See Bill Data buttons */}
                  <Link
                    to="/add-bill-data"
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition duration-200"
                  >
                    Add Bill Data
                  </Link>
                  <Link
                    to="/see-bill-data"
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition duration-200"
                  >
                    See Bill Data
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white w-64 h-full shadow-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4 p-4">
              <Link
                to="/inventory"
                className="text-blue-600 hover:text-blue-800"
              >
                Inventory
              </Link>
              <Link
                to="/addProduct"
                className="text-blue-600 hover:text-blue-800"
              >
                Add Product
              </Link>
              <Link
                to="/expenseTracker"
                className="text-blue-600 hover:text-blue-800"
              >
                Expense Tracker
              </Link>
              <Link
                to="/dataEntry"
                className="text-blue-600 hover:text-blue-800"
              >
                Data Entry
              </Link>
              {!isBillingPage && (
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Go to Billing Page
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    /* REMOVED overflow-hidden so the dropdown can be seen */
    <header className="relative bg-white shadow-xl rounded-md z-50">
      <div className="flex justify-between items-center px-8 py-4">
        
        {/* Logo */}
        <h1 className="font-extrabold uppercase tracking-widest text-xl z-10">
          SKYLegends ✈️
        </h1>

        {/* Navigation */}
        <nav className="relative w-full max-w-[700px]">
          <ul className="flex justify-end space-x-6 items-center z-10 relative">

            {/* Main Links */}
            <li className="font-bold cursor-pointer group">
              <Link to="/">Home</Link>
              <div className="group-hover:bg-black w-full h-1 transition-all duration-200"></div>
            </li>

            <li className="font-bold cursor-pointer group">
              <Link to="/flights">Search Flights</Link>
              <div className="group-hover:bg-black w-full h-1 transition-all duration-200"></div>
            </li>

            <li className="font-bold cursor-pointer group">
              <Link to="/my-bookings">My Bookings</Link>
              <div className="group-hover:bg-black w-full h-1 transition-all duration-200"></div>
            </li>

            {/* User Dropdown */}
            {user ? (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="font-bold px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition flex items-center"
                >
                  {/* Using user.email or user.username based on your serializer */}
                  {user.username || user.email} 
                  <span className={`ml-2 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-2xl rounded-md overflow-hidden z-[100] animate-in fade-in zoom-in duration-150">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-bookings"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Bookings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-white rounded-md px-6 py-2 font-bold bg-blue-900 hover:bg-blue-800 transition shadow-md"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>

          {/* Flying Plane - Lowered z-index to stay behind dropdown */}
          <img
            src="/images/airoplane.png"
            alt="plane"
            className="plane-fly absolute top-1 left-[-120px] w-[100px] pointer-events-none z-0 opacity-80"
          />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;  
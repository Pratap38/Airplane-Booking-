import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Loginplease = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Icon */}
      <div className="absolute opacity-5 text-9xl transform -rotate-12 pointer-events-none">
        ✈️
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl text-center relative z-10 border border-gray-100">
        <div className="w-20 h-20 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👤</span>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Login Required
        </h2>
        
        <p className="text-gray-500 mb-8">
          To view seat availability and book your flight, you need to be signed into your Sky Legends account.
        </p>

        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg active:scale-95"
          >
            Sign In Now
          </Link>
          
          <Link
            to="/register"
            className="block w-full bg-white text-blue-900 border-2 border-blue-900 py-3 rounded-lg font-bold hover:bg-blue-50 transition active:scale-95"
          >
            Create an Account
          </Link>

          <button
            onClick={() => navigate("/flights")}
            className="text-gray-400 text-sm hover:text-gray-600 underline transition mt-4"
          >
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loginplease;
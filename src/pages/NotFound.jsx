import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-md">
            The page you're looking for doesn't exist or has been moved. 
            Please check the URL or go back to the home page.
          </p>
          <div className="mt-8 space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Home
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center">
          <img
            src="images/airoplane.png"
            alt="Not Found"
            className="w-full max-w-sm h-auto rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
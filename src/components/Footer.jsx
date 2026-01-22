import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200 mt-4 py-10">
      <div className="container mx-auto px-6 md:px-12 grid grid-row-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">My Airline</h3>
          <p className="text-gray-700">
            Fly smarter, travel faster. We offer the easiest way to book flights with amazing deals and 24/7 support.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2 hover:text-gray-500 cursor-pointer">Home</li>
            <li className="mb-2 hover:text-gray-500 cursor-pointer">Booking</li>
            <li className="mb-2 hover:text-gray-500 cursor-pointer">Deals</li>
            {/* <li className="mb-2 hover:text-gray-500 cursor-pointer">Support</li> */}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-700 mb-2">Email: support@myairline.com</p>
          <p className="text-gray-700 mb-2">Phone: +1 234 567 890</p>
          <div className="flex space-x-4 mt-4">
            {/* Example social icons (replace with actual icons) */}
            <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400">F</span>
            <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400">T</span>
            <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400">I</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-gray-600">
        © 2026 My Airline. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import Cardd from './Card'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-white text-black h-screen flex items-center">
      {/* Background airplane */}
      <img
        src="/images/airoplane.png"
        alt="Flying airplane"
        className="absolute top-10 left-[-100px] w animate-fly-in opacity-30"
      />

      {/* Hero Content */}
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Fly Smarter, Travel Faster
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            Discover the easiest way to book flights with the best deals, rewards, and world-class service.
          </p>
          <Link to="/flights">
  <button className="bg-black text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors">
    Book a Flight
  </button>
</Link>
        </div>

        {/* Optional illustration */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/images/airoplane2.png"
            alt="Airplane Illustration"
            className="w-80 md:w-full animate-bounce-slow opacity-40"
          />
        </div>
      </div>

      {/* Overlay to make plane subtle */}
      <div className="absolute inset-0 bg-white opacity-0"></div>
     
    </section>
  );
};

export default Hero;

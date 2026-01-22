import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // We expect flight and booking data to be passed via navigation state
  const { booking, flight } = location.state || {};

  // If no booking data exists (e.g. user refreshed the page), redirect back
  if (!booking || !flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800">No Booking Found</h2>
          <p className="text-gray-500 mb-6">It looks like you don't have an active booking session or the page was refreshed.</p>
          <Link to="/flights" className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg inline-block">
            Back to Flight Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-4 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tight">Booking Confirmed!</h1>
          <p className="text-gray-500 mt-2">Your journey with Sky Legends is ready. Bon voyage!</p>
        </div>

        {/* Digital Ticket Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none">
          {/* Header section of Ticket */}
          <div className="bg-blue-900 p-6 flex justify-between items-center text-white">
            <div>
              <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Boarding Pass</p>
              <h2 className="text-xl font-bold uppercase">{flight.airline.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Confirmation #</p>
              <h2 className="text-xl font-mono font-bold">SL-{booking.id}</h2>
            </div>
          </div>

          <div className="p-8">
            {/* Origin & Destination Section */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-center md:text-left">
                <h3 className="text-5xl font-black text-gray-900 leading-none">{flight.origin.code}</h3>
                <p className="text-gray-500 text-sm mt-1">{flight.origin.city || flight.origin.name}</p>
              </div>
              
              <div className="flex flex-col items-center px-4 flex-1">
                <div className="w-full border-t-2 border-dashed border-gray-200 relative">
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-2 text-2xl">✈️</span>
                </div>
                <p className="text-[10px] font-black text-blue-900 mt-4 uppercase tracking-[0.2em]">Non-Stop Flight</p>
              </div>

              <div className="text-center md:text-right">
                <h3 className="text-5xl font-black text-gray-900 leading-none">{flight.destination.code}</h3>
                <p className="text-gray-500 text-sm mt-1">{flight.destination.city || flight.destination.name}</p>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Grid details section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Passenger</p>
                <p className="font-bold text-gray-800">{booking.passenger_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seat Number</p>
                <p className="font-bold text-blue-900 text-xl uppercase">{booking.seat.seat_number}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Class</p>
                <p className="font-bold text-gray-800 uppercase">{booking.seat.seat_class}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Departure</p>
                <p className="font-bold text-gray-800">
                  {/* Fixed Date Formatting */}
                  {new Date(flight.departure).toLocaleDateString()}
                  <br />
                  <span className="text-sm font-medium">at {new Date(flight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Barcode Mockup for visual style */}
          <div className="bg-gray-50 p-6 flex flex-col items-center border-t border-dashed border-gray-200">
             <div className="w-full h-16 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_10px)] opacity-20"></div>
             <p className="mt-2 text-[10px] font-mono text-gray-400 uppercase tracking-[0.5em]">Sky Legends Digital Authentication</p>
          </div>
        </div>

        {/* Action Buttons - Hidden during print */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center print:hidden">
          <button 
            onClick={() => window.print()}
            className="bg-white text-gray-800 border-2 border-gray-200 px-10 py-3 rounded-xl font-bold hover:bg-gray-50 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Print Ticket</span> 🖨️
          </button>
          <button 
            onClick={() => navigate('/my-bookings')}
            className="bg-blue-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-black transition shadow-xl shadow-blue-900/20 active:scale-95"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
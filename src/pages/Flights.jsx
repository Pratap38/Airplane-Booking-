import React, { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

/**
 * Flights Component
 * Handles searching and displaying flights with a login-gate for booking.
 */
const Flights = ({ user }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // Fetch flights from Django API
  const fetchFlights = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/flights/", { params });
      // Logic to handle both paginated (results) and non-paginated data
      const flightData = response.data.results || response.data;
      setFlights(Array.isArray(flightData) ? flightData : []);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (origin.trim()) params.origin = origin.trim();
    if (destination.trim()) params.destination = destination.trim();
    if (date) params.date = date;
    fetchFlights(params);
  };

  /**
   * ✅ FIXED NAVIGATION LOGIC
   * If user is logged in: Go to FlightDetail (e.g., /flights/5)
   * If not logged in: Go to LoginPlease page
   */
  const handleSeatSelection = (flightId) => {
    if (user) {
      // SUCCESS: Navigate to the specific flight ID
      navigate(`/flights/${flightId}`); 
    } else {
      // REDIRECT: Go to the "Please Login" explanation page
      navigate("/loginplease"); 
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-50/30">
      
      {/* Background Plane Decoration */}
      <img
        src="/images/airoplane2.png"
        alt="airplane"
        className="fixed top-1/2 -left-64 -translate-y-1/2 opacity-20 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-900 tracking-tight">
          Available Flights ✈️
        </h1>

        {/* Search Bar Section */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-lg mb-8 border border-blue-100"
        >
          <input
            type="text"
            placeholder="From (Origin)"
            className="border-2 border-gray-100 p-2 rounded-xl focus:border-blue-900 outline-none transition"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <input
            type="text"
            placeholder="To (Destination)"
            className="border-2 border-gray-100 p-2 rounded-xl focus:border-blue-900 outline-none transition"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            className="border-2 border-gray-100 p-2 rounded-xl focus:border-blue-900 outline-none transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-800 transition shadow-md active:scale-95">
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setOrigin("");
                setDestination("");
                setDate("");
                fetchFlights();
              }}
              className="bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
            >
              ↺
            </button>
          </div>
        </form>

        {/* Flight Results List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-bounce text-4xl mb-2">☁️</div>
            <p className="text-blue-900 font-semibold">Searching the skies...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow">
            <p className="text-gray-500">No flights found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white p-6 rounded-2xl shadow-md border border-white flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full text-2xl">✈️</div>
                  <div>
                    <p className="font-black text-xl text-gray-800">{flight.airline.name}</p>
                    <p className="text-gray-500 font-medium">
                      <span className="text-blue-900">{flight.origin.code}</span> 
                      <span className="mx-2 text-blue-300">→</span> 
                      <span className="text-blue-900">{flight.destination.code}</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-center md:text-right mt-4 md:mt-0">
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Price</p>
                  <p className="text-3xl font-black text-green-600">
                    ₹{flight.price}
                  </p>
                  
                  {/* AUTHENTICATION GUARD BUTTON */}
                  <button 
                    onClick={() => handleSeatSelection(flight.id)}
                    className="bg-blue-900 text-white px-8 py-2 rounded-xl mt-3 font-bold hover:bg-black transition-all transform active:scale-95 shadow-lg shadow-blue-900/20"
                  >
                    Select Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
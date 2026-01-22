import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const FlightDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await api.get(`/flights/${id}/`);
        setFlight(response.data);
      } catch (error) {
        console.error("Error fetching flight details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlightDetails();
  }, [id]);

  /**
   * ✅ FIXED HANDLE BOOKING PROCESS
   * This sends the POST request to Django and passes state to Booking.jsx
   */
  const handleBooking = async () => {
    // 1. Validation
    if (!selectedSeat) {
      alert("Please select a seat first!");
      return;
    }

    if (!user) {
      alert("You must be logged in to book a flight.");
      navigate("/loginplease");
      return;
    }

    setIsBooking(true);

    try {
      // 2. Prepare payload (Matches your Django Serializer)
      const payload = {
        flight: flight.id,
        seat: selectedSeat.id,
        passenger_name: user?.username || user?.email, 
        passenger_email: user?.email
      };

      // 3. API Call to Backend
      const response = await api.post("/bookings/", payload);

      // 4. CRITICAL FIX: Navigate to confirmation page
      // We pass 'booking' and 'flight' inside the state object
      // This is exactly what your Booking.jsx looks for!
      navigate("/booking-confirmation", {
        state: {
          booking: response.data, // Data returned from Django
          flight: flight          // The current flight details
        }
      });
      
    } catch (error) {
      console.error("Booking failed:", error.response?.data);
      // Show specific backend error if available
      const errorMsg = error.response?.data?.[0] || "Seat might have been taken. Please refresh.";
      alert(errorMsg);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading plane layout...</div>;
  if (!flight) return <div className="p-10 text-center">Flight not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Flight Header */}
      <div className="bg-blue-900 text-white p-6 rounded-t-xl shadow-lg">
        <h1 className="text-2xl font-black tracking-tight">{flight.airline.name}</h1>
        <div className="flex justify-between items-end mt-2">
          <p className="text-blue-100">{flight.origin.code} → {flight.destination.code}</p>
          <p className="font-mono text-sm opacity-70">FLIGHT: {flight.flight_number}</p>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-b-xl p-8 border-x border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-6 font-sans">Choose Your Seat</h2>
        
        {/* Legend */}
        <div className="flex gap-6 mb-8 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div> Available
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <div className="w-4 h-4 bg-blue-600 rounded"></div> Selected
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <div className="w-4 h-4 bg-red-400 rounded"></div> Occupied
          </div>
        </div>

        {/* Seat Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 p-6 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
          {flight.seats.map((seat) => (
            <button
              key={seat.id}
              disabled={seat.is_reserved}
              onClick={() => setSelectedSeat(seat)}
              className={`
                relative h-14 rounded-t-lg rounded-b-md text-sm font-bold shadow-sm transition-all
                ${seat.is_reserved 
                  ? "bg-red-100 text-red-400 cursor-not-allowed border-red-200" 
                  : selectedSeat?.id === seat.id 
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-105 z-10" 
                    : "bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:bg-blue-50"}
              `}
            >
              {seat.seat_number}
              <div className={`text-[9px] font-normal uppercase mt-1 ${selectedSeat?.id === seat.id ? "text-blue-200" : "text-gray-400"}`}>
                {seat.seat_class}
              </div>
            </button>
          ))}
        </div>

        {/* Booking Footer */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Your Selection</p>
            <p className="text-2xl font-black text-blue-900 font-mono">
              {selectedSeat ? `${selectedSeat.seat_number}` : "---"}
            </p>
            <p className="text-sm text-blue-700 font-bold">Price: ₹{flight.price}</p>
          </div>
          
          <button
            onClick={handleBooking}
            disabled={!selectedSeat || isBooking}
            className={`
              px-10 py-4 rounded-xl font-black uppercase tracking-wider shadow-lg transition-all
              ${!selectedSeat || isBooking 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-green-500 hover:bg-green-600 text-white hover:shadow-green-200 active:scale-95"}
            `}
          >
            {isBooking ? "Booking..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
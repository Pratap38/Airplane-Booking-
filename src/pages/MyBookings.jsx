import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get("/bookings/");
        setBookings(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  // ✅ Navigate to the confirmation/ticket page with the data
  const handleViewTicket = (booking) => {
    navigate("/booking-confirmation", {
      state: {
        booking: booking,
        flight: booking.flight // Passing the nested flight object
      }
    });
  };

  if (loading) return <p className="p-10 text-center">Loading your journey history...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black text-blue-900 mb-6 uppercase tracking-tight">
        My Journeys ✈️
      </h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center border-2 border-dashed">
          <p className="text-gray-500">You haven't booked any flights yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              onClick={() => handleViewTicket(b)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-md hover:border-blue-300 transition-all active:scale-[0.98]"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-blue-50 p-3 rounded-full text-xl">🎫</div>
                <div>
                  <p className="font-black text-gray-800 uppercase leading-none">
                    {b.flight.airline.name}
                  </p>
                  <p className="text-sm font-bold text-blue-600 mt-1">
                    {b.flight.origin.code} <span className="text-gray-300 mx-1">→</span> {b.flight.destination.code}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                    Seat: {b.seat.seat_number} • {b.seat.seat_class}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {b.status}
                </span>
                <p className="text-[11px] mt-2 text-gray-400 font-medium">
                  Booked: {new Date(b.created_at).toLocaleDateString()}
                </p>
                <p className="text-blue-900 text-xs font-bold mt-1 underline">View Ticket</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
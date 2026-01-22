import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Flights from "./pages/Flights";
import FlightDetail from "./pages/FlightDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./components/Profile";
import NotFound from "./pages/NotFound";
import api from "./api/api";
import './App.css';
import Loginplease from "./components/Loginplease";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings"; // 1. Import your new page

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const profileRes = await api.get("/auth/profile/");
          setUser(profileRes.data);
        } catch (err) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    delete api.defaults.headers.common["Authorization"];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} handleLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Pass user to Flights to handle the LoginPlease logic */}
        <Route path="/flights" element={<Flights user={user} />} />
        <Route path="/flights/:id" element={<FlightDetail user={user} />} />

        {/* 2. CONFIRMATION PAGE: Only accessible after booking */}
        <Route 
          path="/booking-confirmation" 
          element={user ? <Booking /> : <Navigate to="/login" />} 
        />

        {/* 3. MY BOOKINGS PAGE: This is what the Navbar link needs! */}
        <Route
          path="/my-bookings"
          element={user ? <MyBookings /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/loginplease" element={<Loginplease />} />
        <Route path="/register" element={<Register />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
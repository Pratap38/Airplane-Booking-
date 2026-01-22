import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CHANGE: Send 'email' instead of 'username'
      const res = await api.post("/auth/login/", {
        email: credentials.email,      // Corrected key
        password: credentials.password,
      });

      if (res.data.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
      }

      // If your backend returns the user object directly in the login response 
      // (which your serializer does!), you can save a network request:
      if (res.data.user) {
        setUser(res.data.user);
      } else {
        // Fallback if you prefer the separate profile endpoint
        const profileRes = await api.get("/auth/profile/");
        setUser(profileRes.data);
      }

      navigate("/flights");
    } catch (err) {
      console.error("Login Error Details:", err.response?.data);
      // It's helpful to alert the specific error message from the backend
      const errorMsg = err.response?.data?.non_field_errors?.[0] || "Invalid email or password";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      <img
        src="/images/airoplane2.png"
        alt="airplane"
        className="fixed top-1/2 -left-72 -translate-y-1/2 opacity-20 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-black text-center tracking-wide">
          SKY LEGENDS ✈️
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-6">
          Sign in to book your next journey
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          New to Sky Legends?{" "}
          <Link to="/register" className="text-blue-700 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
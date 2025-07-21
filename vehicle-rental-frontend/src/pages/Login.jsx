import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Configure axios to include credentials (cookies) in requests
axios.defaults.withCredentials = true;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8080/api/users/login", formData);
      
      login(response.data.user);
      
      setMessage("Login successful!");
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
      
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("invalid")) {
        setMessage("User not found. Redirecting to register...");
        setTimeout(() => {
          navigate("/register");
        }, 2000);
      } else {
        setMessage("Login failed. " + message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes("successful") ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
        }`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
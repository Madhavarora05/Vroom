// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
      <Link to="/" style={{ margin: "0 1rem" }}>Home</Link>
      <Link to="/vehicles" style={{ margin: "0 1rem" }}>Vehicles</Link>
      <Link to="/bookings" style={{ margin: "0 1rem" }}>My Bookings</Link>
      <Link to="/login" style={{ margin: "0 1rem" }}>Login</Link>
      <Link to="/register" style={{ margin: "0 1rem" }}>Register</Link>
    </nav>
  );
};

export default Header;

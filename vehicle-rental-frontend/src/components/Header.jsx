import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

const Header = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/vehicles">Vehicles</Link>
        <Link to="/bookings">My Bookings</Link>
      </div>

      <div className="relative">
        <button onClick={toggleMenu} className="flex items-center gap-2">
          <User />
          {user ? <span>Hello, {user.name.split(" ")[0]}</span> : <span>Account</span>}
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 bg-white shadow rounded py-2 px-4">
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setShowMenu(false)}>Login</Link>
                <br />
                <Link to="/register" onClick={() => setShowMenu(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;

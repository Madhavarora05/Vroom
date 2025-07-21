import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    
    if (savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to invalidate session
      const response = await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include", // Important: Include cookies for session
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        console.log("Server logout successful");
      } else {
        console.log("Server logout failed, but continuing with client logout");
      }
    } catch (error) {
      console.log("Server logout request failed:", error);
      // Continue with client-side logout even if server call fails
    }
    
    // Always clear client-side state
    setUser(null);
    localStorage.removeItem("user");
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      } else {
        // Session expired or invalid
        setUser(null);
        localStorage.removeItem("user");
        return false;
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
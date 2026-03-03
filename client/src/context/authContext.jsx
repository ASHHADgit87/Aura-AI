import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../configs/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // This flag determines if we show "Get Started" or "Login"
  const hasAccount = localStorage.getItem("aura_user_exists") === "true";

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("aura_user_exists", "true");
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const checkUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Your backend should return { success: true, user: {...} }
      const { data } = await api.get("/api/user/me");
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      logout(); // Token likely expired (1-day limit hit)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, hasAccount }}>
      {/* Do not render app until we know if user is logged in or not */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAppContext = () => useContext(AuthContext);
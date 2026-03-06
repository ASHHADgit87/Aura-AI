import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../configs/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const [hasAccount, setHasAccount] = useState(
    localStorage.getItem("aura_user_exists") === "true",
  );

  const getExpiryTime = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000;
    } catch (e) {
      return 0;
    }
  };

  const setupAutoLogout = (tokenValue) => {
    if (!tokenValue) return;

    const expirationTime = getExpiryTime(tokenValue);
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    if (timeLeft <= 0) {
      logout();
    } else {
      const timer = setTimeout(() => {
        logout();
      }, timeLeft);

      return () => clearTimeout(timer);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("aura_user_exists", "true");
    setToken(newToken);
    setUser(userData);
    setHasAccount(true);
  };

  const deleteAccountCleanup = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("aura_user_exists");
    setToken(null);
    setUser(null);
    setHasAccount(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const checkUser = async () => {
    if (!token) {
      setHasAccount(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/api/user/me");

      if (data.success) {
        setUser(data.user);
        setHasAccount(true);
        localStorage.setItem("aura_user_exists", "true");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setHasAccount(false);
      } else if (err.response && err.response.status === 404) {
        localStorage.removeItem("aura_user_exists");
        localStorage.removeItem("token");
        setHasAccount(false);
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const cleanupTimer = setupAutoLogout(token);
      return cleanupTimer;
    }
  }, [token]);

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        hasAccount,
        deleteAccountCleanup,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAppContext = () => useContext(AuthContext);

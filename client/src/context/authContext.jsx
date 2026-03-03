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
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 404)
      ) {
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
    checkUser();
  }, [token]);

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

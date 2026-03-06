import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, hasAccount } = useAppContext();
  const location = useLocation();

  if (loading) {
    return null;
  }
  if (!user) {
    if (location.pathname === "/settings" && hasAccount) {
      return children;
    }

    return <Navigate to={hasAccount ? "/login" : "/register"} replace />;
  }

  return children;
};

export default ProtectedRoute;

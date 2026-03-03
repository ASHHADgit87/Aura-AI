import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, hasAccount } = useAppContext();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to={hasAccount ? "/login" : "/register"} replace />;
  }

  return children;
};

export default ProtectedRoute;

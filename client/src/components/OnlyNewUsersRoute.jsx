import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/authContext";

const OnlyNewUsersRoute = ({ children }) => {
  const { user, hasAccount, loading } = useAppContext();

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (hasAccount) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default OnlyNewUsersRoute;

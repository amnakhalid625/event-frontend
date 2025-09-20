import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // JWT token ko localStorage se nikaalo
  const token = localStorage.getItem("token");

  if (!token) {
    // Agar login nahi hai, to login page pe bhej do
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

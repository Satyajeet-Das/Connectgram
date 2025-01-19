import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div className="loader w-32 h-32 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
    ;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean | null; // `null` represents the loading state
  user: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get("/api/v1/users/verify", {
            withCredentials: true,
          });

          if (response.data && response.data.isAuthenticated !== undefined) {
            setIsAuthenticated(response.data.isAuthenticated);
            setUser(response.data.user);
          } else {
            console.error("Unexpected response structure:", response.data);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthenticated === null) {
    // Loading state
    return <div className="loader w-32 h-32 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>

  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

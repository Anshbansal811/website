import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "../types/auth";
import api from "../utils/axios";
import axios from "axios";
import { User, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if current user can access another user's data
  const canAccessUserData = (targetUserId: string): boolean => {
    if (!user) return false;

    // If user is trying to access their own data, allow it
    if (user.id === targetUserId) return true;

    // RETAILER and CORPORATE users can only access their own data
    if (user.role === UserRole.RETAILER || user.role === UserRole.CORPORATE) {
      return user.id === targetUserId;
    }

    // SELLER can access all data (assuming they have admin privileges)
    return user.role === UserRole.SELLER;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then(({ data }) => {
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Sending signup request with data:");
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Invalid credentials");
      }
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company?: string;
    phonenumber: String;
  }) => {
    try {
      // Validate required fields
      if (
        !userData.email ||
        !userData.password ||
        !userData.name ||
        !userData.phonenumber ||
        !userData.role
      ) {
        throw new Error("All fields are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Invalid email format");
      }

      // Validate password length
      if (userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Validate role
      if (!Object.values(UserRole).includes(userData.role)) {
        throw new Error("Invalid role selected");
      }

      // If role is CORPORATE or SELLER, company is required
      if (
        (userData.role === UserRole.CORPORATE ||
          userData.role === UserRole.SELLER) &&
        !userData.company
      ) {
        throw new Error(
          "Company name is required for Corporate and Seller roles"
        );
      }

      console.log("Sending signup request with data:", userData);
      const { data } = await api.post("/auth/signup", userData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Signup error response:", error.response.data);
          throw new Error(error.response.data.message || "Failed to sign up");
        } else if (error.request) {
          console.error("Signup error request:", error.request);
          throw new Error("No response from server");
        } else {
          console.error("Signup error:", error.message);
          throw new Error(error.message);
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to sign up");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        canAccessUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

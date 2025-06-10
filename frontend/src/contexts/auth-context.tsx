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
  const [error, setError] = useState<string | null>(null);

  // Function to clear error
  const clearError = () => {
    setError(null);
  };

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

  // Function to set auth token in axios headers
  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  const login = async (email: string, password: string) => {
    
    try {
      setLoading(true);
      
      const { data } = await api.post("/auth/login", { email, password });
      setAuthToken(data.token);
      setUser(data.user);
      return data;
    } catch (loginError) {
      console.log("cdzcdcds")
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(loginError)) {
        if (loginError.response) {
          errorMessage = loginError.response.data.message || "Invalid credentials";
        } else if (loginError.request) {
          errorMessage = "No response from server. Please check your connection.";
        }
      }
      
      // Keep the error visible - don't clear it between attempts
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company?: string;
    phonenumber: string;
  }) => {
    try {
      // Don't clear error immediately - let it show until success or manual clear
      setLoading(true);

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

      // Validate password requirements
      if (userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Validate phone number
      if (!/^\d{10}$/.test(userData.phonenumber)) {
        throw new Error("Phone number must be exactly 10 digits");
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

      const { data } = await api.post("/auth/signup", userData);
      setError(null); // Only clear error on successful signup
      // Don't set auth token or user state on signup
      // Let the user login explicitly
      return data;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data.message || "Failed to sign up";
        } else if (error.request) {
          errorMessage = "No response from server. Please check your connection.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        signup,
        logout,
        canAccessUserData,
        clearError,
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
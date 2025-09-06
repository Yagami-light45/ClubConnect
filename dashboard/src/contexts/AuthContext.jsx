// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API base URL (from Vite env or fallback)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        verifyToken(token, user);
      } catch (error) {
        console.error("Invalid stored user data:", error);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token, userData) => {
    if (USE_MOCK) {
      // In mock mode, just use stored data
      setCurrentUser(userData);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        logout(); // Token invalid
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      // Fallback: use stored data temporarily if server is down
      setCurrentUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);

    try {
      if (USE_MOCK) {
        // Import mock service dynamically to avoid errors if not available
        const { mockAuthService } = await import('../data/mockData');
        const result = await mockAuthService.login(email, password);
        
        if (result.success) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("userData", JSON.stringify(result.user));
          setCurrentUser(result.user);
          return { success: true };
        } else {
          return { success: false, error: result.error || "Login failed" };
        }
      }

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please check if the server is running.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    
    try {
      let result;
      
      if (USE_MOCK) {
        const { mockAuthService } = await import('../data/mockData');
        result = await mockAuthService.register(userData);
      } else {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
          result = { success: true, token: data.token };
          // Fetch user data after registration
          const userResponse = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${data.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (userResponse.ok) {
            const user = await userResponse.json();
            result.user = user;
          }
        } else {
          result = { success: false, error: data.message };
        }
      }

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userData', JSON.stringify(result.user));
        setCurrentUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setCurrentUser(null);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" };
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api.jsx';
import { isValidToken, clearTokens, storeTokens, cleanupInvalidTokens } from '../utils/tokenUtils.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const clearInvalidTokens = useCallback(() => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Double-check token validity before making the API call
      const token = localStorage.getItem('access_token');
      
      if (!token || !isValidToken(token)) {
        clearInvalidTokens();
        setLoading(false);
        return;
      }

      const userData = await authAPI.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Only clear tokens on actual auth errors, not network errors
      if (error.message.includes('Authentication required') || 
          error.message.includes('Invalid token') ||
          error.message.includes('token not valid')) {
        clearInvalidTokens();
      }
    } finally {
      setLoading(false);
    }
  }, [clearInvalidTokens]);

  useEffect(() => {
    // Only run this once on mount
    if (initialized) return;
    
    const initializeAuth = async () => {
      // Clean up any invalid tokens on startup
      cleanupInvalidTokens();
      
      // Check if user is already logged in
      const token = localStorage.getItem('access_token');
      
      if (token) {
        // Validate token format before making API call
        if (isValidToken(token)) {
          await checkAuthStatus();
        } else {
          // Invalid token format, clear it immediately
          clearInvalidTokens();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      
      setInitialized(true);
    };

    initializeAuth();
  }, [initialized, checkAuthStatus, clearInvalidTokens]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, refresh_token, user: userData } = response;
      
      // Validate tokens before storing
      if (storeTokens(access_token, refresh_token)) {
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && isValidToken(refreshToken)) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearInvalidTokens();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

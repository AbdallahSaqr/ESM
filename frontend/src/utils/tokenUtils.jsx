// Token utility functions

/**
 * Check if a JWT token is valid
 * @param {string} token - The JWT token to validate
 * @returns {boolean} - True if token is valid, false otherwise
 */
export const isValidToken = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Check if token has the correct format (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  try {
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token has expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    // Check if token has required fields (either user_id or user_id)
    if (!payload.user_id) {
      return false;
    }
    
    return true;
  } catch (error) {
    // If we can't parse the token, it's invalid
    return false;
  }
};

/**
 * Clear all authentication tokens from localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Force clear all tokens regardless of validity
 * Use this when you want to ensure a clean slate
 */
export const forceClearAllTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  // Clear any other auth-related items
  Object.keys(localStorage).forEach(key => {
    if (key.includes('token') || key.includes('auth') || key.includes('user')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Get the current access token if it's valid
 * @returns {string|null} - Valid access token or null
 */
export const getValidAccessToken = () => {
  const token = localStorage.getItem('access_token');
  return isValidToken(token) ? token : null;
};

/**
 * Get the current refresh token if it's valid
 * @returns {string|null} - Valid refresh token or null
 */
export const getValidRefreshToken = () => {
  const token = localStorage.getItem('refresh_token');
  return isValidToken(token) ? token : null;
};

/**
 * Store tokens in localStorage after validation
 * @param {string} accessToken - The access token to store
 * @param {string} refreshToken - The refresh token to store
 * @returns {boolean} - True if tokens were stored successfully
 */
export const storeTokens = (accessToken, refreshToken) => {
  if (isValidToken(accessToken) && isValidToken(refreshToken)) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    return true;
  } else {
    return false;
  }
};

/**
 * Clean up invalid tokens on app startup
 */
export const cleanupInvalidTokens = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (accessToken && !isValidToken(accessToken)) {
    localStorage.removeItem('access_token');
  }
  
  if (refreshToken && !isValidToken(refreshToken)) {
    localStorage.removeItem('refresh_token');
  }
};

/**
 * Check if user is currently authenticated
 * @returns {boolean} - True if user has valid tokens
 */
export const isAuthenticated = () => {
  return getValidAccessToken() !== null;
};

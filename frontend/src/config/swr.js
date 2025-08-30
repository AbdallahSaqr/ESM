import { SWRConfig } from 'swr';
import useSWR from 'swr';

// SWR configuration
export const swrConfig = {
  // Global fetcher
  fetcher: async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        // Handle different HTTP status codes
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view this resource.');
        } else if (response.status === 404) {
          throw new Error('Resource not found.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format. Expected JSON data.');
      }
      
      return response.json();
    } catch (error) {
      // If it's already a formatted error, re-throw it
      if (error.message && !error.message.includes('JSON.parse')) {
        throw error;
      }
      
      // Handle JSON parsing errors
      if (error.message.includes('JSON.parse')) {
        throw new Error('Invalid response format. The server returned non-JSON data.');
      }
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      
      // Generic error fallback
      throw new Error('An unexpected error occurred while fetching data.');
    }
  },
  
  // Global options
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  focusThrottleInterval: 5000,
  
  // Error handling
  onError: (error) => {
    console.error('SWR Error:', error);
    
    // Handle authentication errors
    if (error.message.includes('Authentication required')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Don't redirect automatically, let components handle it
    }
  },
  
  // Success handling
  onSuccess: (data, key) => {
    console.log('SWR Success:', key, data);
  }
};

// SWR Provider component
export const SWRProvider = ({ children }) => {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
};

// Custom hooks for common SWR patterns
export const useSWRWithAuth = (key, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  // Always call useSWR, but with conditional key
  const result = useSWR(token ? key : null, options);
  
  // Return modified result if no token
  if (!token) {
    return {
      data: undefined,
      error: new Error('No authentication token'),
      isLoading: false,
      isValidating: false,
      mutate: () => {}
    };
  }
  
  return result;
};

// Hook for conditional fetching
export const useSWRWhen = (condition, key, options = {}) => {
  // Always call useSWR, but with conditional key
  return useSWR(condition ? key : null, options);
};

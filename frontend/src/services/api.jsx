// API configuration and utilities
import { isValidToken, clearTokens } from '../utils/tokenUtils.jsx';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  // Check if token is valid before making request
  if (token && !isValidToken(token)) {
    // Clear invalid token immediately
    clearTokens();
    throw new Error('Invalid or expired token. Please log in again.');
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid tokens on 401
        clearTokens();
        throw new Error('Authentication required. Please log in again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. You do not have permission for this action.');
      } else if (response.status === 404) {
        throw new Error('Resource not found.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format. Expected JSON data.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// SWR fetcher function
export const fetcher = async (url) => {
  // If the URL already starts with http, it's a full URL, use it as is
  if (url.startsWith('http')) {
    return apiRequest(url.replace(API_BASE_URL, ''));
  }
  
  // If it's a relative path, use it directly
  return apiRequest(url);
};

// SWR keys for different endpoints
export const swrKeys = {
  companies: '/companies/',
  departments: '/departments/',
  employees: '/employees/',
  users: '/users/',
  companyStats: '/companies/statistics/',
  departmentStats: '/departments/statistics/',
  employeeStats: '/employees/statistics/',
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async (refreshToken) => {
    return apiRequest('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile/');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile/update/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Companies API
export const companiesAPI = {
  getAll: async () => {
    return apiRequest('/companies/');
  },

  getById: async (id) => {
    return apiRequest(`/companies/${id}/`);
  },

  create: async (companyData) => {
    return apiRequest('/companies/', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  update: async (id, companyData) => {
    return apiRequest(`/companies/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/companies/${id}/`, {
      method: 'DELETE',
    });
  },

  getStatistics: async () => {
    return apiRequest('/companies/statistics/');
  },

  search: async (query) => {
    return apiRequest(`/companies/search/?q=${encodeURIComponent(query)}`);
  },
};

// Departments API
export const departmentsAPI = {
  getAll: async () => {
    return apiRequest('/departments/');
  },

  getById: async (id) => {
    return apiRequest(`/departments/${id}/`);
  },

  create: async (departmentData) => {
    return apiRequest('/departments/', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  },

  update: async (id, departmentData) => {
    return apiRequest(`/departments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(departmentData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/departments/${id}/`, {
      method: 'DELETE',
    });
  },

  getStatistics: async () => {
    return apiRequest('/departments/statistics/');
  },

  getByCompany: async (companyId) => {
    return apiRequest(`/companies/${companyId}/departments/`);
  },
};

// Employees API
export const employeesAPI = {
  getAll: async () => {
    return apiRequest('/employees/');
  },

  getById: async (id) => {
    return apiRequest(`/employees/${id}/`);
  },

  create: async (employeeData) => {
    return apiRequest('/employees/', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  },

  update: async (id, employeeData) => {
    return apiRequest(`/employees/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/employees/${id}/`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/employees/${id}/status/`, {
      method: 'PUT',
      body: JSON.stringify({ employee_status: status }),
    });
  },

  getStatistics: async () => {
    return apiRequest('/employees/statistics/');
  },

  getByCompany: async (companyId) => {
    return apiRequest(`/companies/${companyId}/employees/`);
  },

  getByDepartment: async (departmentId) => {
    return apiRequest(`/departments/${departmentId}/employees/`);
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users/');
  },

  getById: async (id) => {
    return apiRequest(`/users/${id}/`);
  },

  update: async (id, userData) => {
    return apiRequest(`/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/users/${id}/`, {
      method: 'DELETE',
    });
  },
};

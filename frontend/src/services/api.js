import axios from 'axios';

// Base API URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Quiz endpoints
  getQuiz: async (params = {}) => {
    const { category, region, type, size = 20 } = params;
    const response = await api.get('/quiz', {
      params: { category, region, type, size },
    });
    return response.data;
  },

  submitQuiz: async (answers) => {
    const response = await api.post('/quiz-submissions', { answers });
    return response.data;
  },

  getQuizSubmissions: async () => {
    const response = await api.get('/quiz-submissions');
    return response.data;
  },

  // Info/Learning endpoints
  getInfo: async (params = {}) => {
    const { language = 'Arabic', category, region, search, page = 0, size = 21 } = params;
    const response = await api.get('/info', {
      params: { language, category, region, search, page, size },
    });
    return response.data;
  },

  // User endpoints
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Auth test endpoint
  testAuth: async () => {
    const response = await api.get('/auth/test');
    return response.data;
  },
};

export default api;

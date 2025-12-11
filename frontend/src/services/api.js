import axios from 'axios';
import toast from 'react-hot-toast';
import { getApiBaseUrl, getMongoDBFLEApiUrl, MONGODB_FLE_API_URL } from '../config/environment';

// Environment Configuration
const API_BASE_URL = getApiBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Check if backend server is running
export const checkBackendConnection = async () => {
  try {
    const baseURL = API_BASE_URL.replace('/api', '');
    const response = await axios.get(`${baseURL}/health`, { timeout: 3000 });
    return response.data.status === 'OK';
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
};

// Request interceptor - Add JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken }
        );
        
        const { token, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(error.response.data?.message || 'Bad request');
          break;
        case 403:
          toast.error('You are not authorized to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error - backend server might not be running
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        toast.error(
          'Backend server nahi chal raha hai! Backend start karein:\n1. Terminal mein "cd backend" karein\n2. "npm start" ya "npm run dev" run karein\n3. Port 5000 par server chalna chahiye',
          {
            duration: 8000,
            style: {
              maxWidth: '500px',
              whiteSpace: 'pre-line',
            },
          }
        );
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Internet connection check karein.', {
          duration: 5000,
        });
      } else {
        toast.error(
          'Network error! Backend server check karein:\n1. Backend folder mein "npm start" run karein\n2. Port 5000 available hona chahiye\n3. Database connection verify karein',
          {
            duration: 8000,
            style: {
              maxWidth: '500px',
              whiteSpace: 'pre-line',
            },
          }
        );
      }
      console.error('Network Error Details:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: API_BASE_URL,
      });
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default API;
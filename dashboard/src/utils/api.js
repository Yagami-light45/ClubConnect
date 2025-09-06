import axios from 'axios';

// FIXED: Remove /api from the fallback URL since your backend routes already include it
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_BASE}/api`, // Add /api here instead
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        me: '/auth/me'
    },
    drives: {
        list: '/recruitment-drives',
        create: '/recruitment-drives',
        getByClub: (clubId) => `/recruitment-drives/club/${clubId}`
    }
};

export default api;
/**
 * Central API Configuration
 * Supports both local backend and production deployments
 */

// Determine API base URL
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE = isDevelopment
    ? 'http://localhost:3000/api'
    : import.meta.env.VITE_API_URL || '/api';

export const API_CONFIG = {
    BASE_URL: API_BASE,
    AUTH_URL: `${API_BASE}/auth`,
    FILES_URL: `${API_BASE}/files`,
    HEALTH_URL: `${API_BASE}/health`,
    HEADERS: {
        "Content-Type": "application/json",
    },
};

export const API_CONFIG_FILES = {
    FILES_URL: `${API_BASE}/files`,
    HEADERS: {
        "Content-Type": "application/json",
    },
};

/**
 * Helper to get authorization headers
 */
export const getAuthHeaders = () => {
    const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
    const token = auth?.token;

    if (!token) {
        return API_CONFIG.HEADERS;
    }

    return {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`,
    };
};

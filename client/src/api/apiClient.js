import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject JWT token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    try {
      const adminToken = localStorage.getItem('rhydhm_admin_token');
      const userToken = localStorage.getItem('rhydhm_token');

      // Prioritize adminToken for administrative endpoints
      const isAdminRoute =
        config.url &&
        (config.url.includes('/api/admin') ||
          (config.url.includes('/api/announcements') && !config.url.includes('/patient')));

      const token = isAdminRoute
        ? adminToken || userToken
        : userToken || adminToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access failures (e.g. private mode or SSR)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Optional centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If needed in the future, handle 401 Unauthorized globally
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';

// The Render blueprint names the backend service "careerbridge-api".
// Ignore common placeholder URLs accidentally left in the frontend environment.
const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isPlaceholderUrl =
  !configuredApiUrl ||
  configuredApiUrl.includes('your-backend.onrender.com') ||
  configuredApiUrl.includes('your-backend-url');

const API_BASE_URL = isPlaceholderUrl
  ? 'https://careerbridge-api.onrender.com/api'
  : configuredApiUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the saved JWT to authenticated API requests.
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('cb_user') || 'null');
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired or invalid sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cb_user');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

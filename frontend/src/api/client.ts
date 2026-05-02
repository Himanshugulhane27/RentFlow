import axios from 'axios';


// ─── Axios Instance ─────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Token accessor ─────────────────────────────────────────
// We use a getter function to avoid circular imports with the store.
// The store sets this after initialization.
let getToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export const setTokenAccessor = (fn: () => string | null): void => {
  getToken = fn;
};

export const setUnauthorizedHandler = (fn: () => void): void => {
  onUnauthorized = fn;
};

// ─── Request Interceptor: attach JWT ────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle errors ────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }

    const { status, data } = error.response;

    // 401 — Token expired or invalid
    if (status === 401) {
      onUnauthorized();
      return Promise.reject({
        success: false,
        message: 'Session expired. Please log in again.',
        status: 401,
      });
    }

    // 422 — Validation errors
    if (status === 422) {
      const responseData = data as { message?: string; errors?: Record<string, string[]> };
      return Promise.reject({
        success: false,
        message: responseData.message || 'Validation failed',
        errors: responseData.errors || {},
        status: 422,
      });
    }

    // 403 — Forbidden
    if (status === 403) {
      return Promise.reject({
        success: false,
        message: 'You do not have permission to perform this action.',
        status: 403,
      });
    }

    // 429 — Rate limit
    if (status === 429) {
      return Promise.reject({
        success: false,
        message: 'Too many requests. Please try again later.',
        status: 429,
      });
    }

    // All other errors
    const responseData = data as { message?: string };
    return Promise.reject({
      success: false,
      message: responseData.message || 'Something went wrong',
      status,
    });
  }
);

export default apiClient;

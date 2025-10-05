import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";

// Debug the API URL being used
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
console.log('🌐 API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Track if we're currently refreshing to prevent multiple parallel refreshes
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// Notify subscribers about new token
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Add request interceptor
api.interceptors.request.use(async (config) => {
  // Don't intercept refresh token request to prevent infinite loop
  if (config.url?.includes('/api/auth/refresh')) {
    return config;
  }

  const { accessToken } = useAuthStore.getState();

  if (!accessToken) return config;

  // Add token to headers
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const { refresh, logout } = useAuthStore.getState();

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If we're already refreshing, wait for the new token
        if (isRefreshing) {
          return new Promise(resolve => {
            subscribeTokenRefresh(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          isRefreshing = false;
          await logout();
          return Promise.reject(error);
        }

        const newToken = await refresh(refreshToken);

        if (newToken) {
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          return api(originalRequest);
        } else {
          // If refresh failed, logout
          await logout();
          isRefreshing = false;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        await logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - server took too long");
    } else if (!error.response) {
      console.error("Network error - check backend or CORS");
    } else {
      // Don't log 404 errors for image deletion (expected fallback behavior)
      const isImageDeletion = error.config?.url?.includes('/api/images/');
      const is404 = error.response?.status === 404;

      if (isImageDeletion && is404) {
        // Silently suppress expected 404 for image deletion attempts
        // (these are handled by our fallback logic)
      } else {
        console.error("Server error:");
        console.error(error.response?.status, error.response?.data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

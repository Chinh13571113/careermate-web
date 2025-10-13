import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";

// Debug the API URL being used
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
console.log('🌐 API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important: enables cookies for token rotation
});

// Initialize auth from localStorage (to be called in client components)
export const initializeAuth = async () => {
  if (typeof window === 'undefined') return false;
  
  // Attempt to load tokens from localStorage
  const ACCESS_TOKEN_KEY = "access_token";
  const TOKEN_EXPIRES_AT_KEY = "token_expires_at";
  
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  
  console.debug("Initializing auth from localStorage");
  
  if (accessToken && expiresAtStr) {
    const expiresAt = parseInt(expiresAtStr, 10);
    const timeRemaining = expiresAt - Date.now();
    
    console.debug(`Token time remaining at initialization: ${timeRemaining}ms`);
    
    // Always restore the token from localStorage first
    const { getState, setState } = useAuthStore;
    setState({
      ...getState(),
      accessToken,
      tokenExpiresAt: expiresAt,
      isAuthenticated: true
    });
    
    // If token is not expired or close to expiry
    if (expiresAt > Date.now()) {
      // For very short-lived tokens, immediately try to refresh if less than 3 seconds remaining
      if (timeRemaining < 3000) {
        console.debug("Token close to expiry during initialization, refreshing immediately");
        try {
          const { refresh } = useAuthStore.getState();
          await refresh();
          return true;
        } catch (err: any) {
          // Don't immediately invalidate on network errors
          const isNetworkError = !err.response;
          if (isNetworkError) {
            console.debug("Network error during token refresh - using existing token");
            return true; // Still return true to indicate we have a token
          }
          
          console.debug("Failed to refresh token during initialization:", err?.message || "Unknown error");
          return false;
        }
      }
      
      return true;
    } else {
      console.debug("Token expired, attempting immediate refresh");
      // Token already expired, try to refresh immediately
      try {
        const { refresh } = useAuthStore.getState();
        await refresh();
        return true;
      } catch (err: any) {
        // Don't immediately invalidate on network errors
        const isNetworkError = !err.response;
        if (isNetworkError) {
          console.debug("Network error during expired token refresh - server might be starting");
          // Even though refresh failed due to network error, keep the user logged in with expired token
          // This gives the server time to start up and subsequent requests might succeed
          return true;
        }
        
        console.debug("Failed to refresh expired token:", err?.message || "Unknown error");
        return false;
      }
    }
  }
  
  return false;
};

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

// Token refresh threshold in ms (2 seconds before expiry)
// Reduced from 5s to 2s since token lifetime is only 8s
const TOKEN_REFRESH_THRESHOLD = 2000;

// Check if token needs refresh
const shouldRefreshToken = () => {
  const { tokenExpiresAt } = useAuthStore.getState();
  if (!tokenExpiresAt) return false;
  
  // Debug token expiration
  const timeRemaining = tokenExpiresAt - Date.now();
  console.debug(`Token time remaining: ${timeRemaining}ms`);
  
  return timeRemaining <= TOKEN_REFRESH_THRESHOLD;
};

// Add request interceptor
api.interceptors.request.use(async (config) => {
  // Don't intercept auth requests to prevent infinite loops
  if (config.url?.includes('/api/auth/token') || config.url?.includes('/api/auth/refresh')) {
    return config;
  }

  const { accessToken, refresh, tokenExpiresAt } = useAuthStore.getState();

  // Debug token expiration
  if (tokenExpiresAt) {
    const timeRemaining = tokenExpiresAt - Date.now();
    console.debug(`Request interceptor: Token expires in ${timeRemaining}ms`);
  }
  
  // Check if token needs refresh before request
  // For very short-lived tokens, we're more aggressive with refreshing
  if (accessToken && shouldRefreshToken() && !isRefreshing) {
    console.debug("Pre-emptively refreshing token before request");
    isRefreshing = true;
    try {
      const newToken = await refresh();
      if (newToken) {
        console.debug("Pre-emptive token refresh successful");
        onTokenRefreshed(newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        isRefreshing = false;
        return config;
      }
    } catch (error: any) {
      // Don't use console.error to prevent the "Server error:" console message
      console.debug("Pre-emptive token refresh failed:", error?.message || "Unknown error");
    } finally {
      isRefreshing = false;
    }
  }

  // If refreshing in progress, wait for it
  if (isRefreshing && accessToken) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(config);
      });
    });
  }

  // Add access token to headers if available
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const { refresh, logout } = useAuthStore.getState();
    
    // Log all API errors with more detail
    if (error.response) {
      console.debug(`API Error: ${error.config?.url} - Status ${error.response.status}`);
      
      // For 401 errors, log more detailed information
      if (error.response.status === 401) {
        console.debug("Authorization error details:", error.response.data);
      }
    }

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.debug("401 error detected, attempting token refresh");
      originalRequest._retry = true;

      // Skip token refresh for specific paths that shouldn't trigger a refresh
      const skipRefreshPaths = [
        '/api/auth/token', 
        '/api/auth/refresh', 
        '/api/auth/logout'
      ];
      
      // If this is an auth endpoint that returned 401, don't attempt refresh
      const isAuthEndpoint = skipRefreshPaths.some(path => originalRequest.url?.includes(path));
      if (isAuthEndpoint) {
        console.debug("Auth endpoint returned 401, skipping refresh");
        return Promise.reject(error);
      }

      try {
        // If we're already refreshing, wait for the new token
        if (isRefreshing) {
          console.debug("Token refresh already in progress, waiting...");
          return new Promise(resolve => {
            subscribeTokenRefresh(token => {
              console.debug("Received refreshed token, retrying request");
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        console.debug("Starting token refresh after 401");
        
        // Call refresh without passing a token - will use the HTTP-only cookie
        const newToken = await refresh();

        if (newToken) {
          console.debug("Token refresh successful, retrying request");
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          return api(originalRequest);
        } else {
          // If refresh failed, logout
          console.debug("Token refresh failed, logging out");
          await logout();
          isRefreshing = false;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
        isRefreshing = false;
        await logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.code === "ECONNABORTED") {
      console.debug("Request timeout - server took too long");
    } else if (!error.response) {
      // Network errors - handle more gracefully with debug instead of error
      console.debug("Network connectivity issue detected - server may be down or CORS issue");
      
      // Check if this is a token validation or refresh attempt
      const isAuthRequest = error.config?.url?.includes('/api/auth/');
      if (isAuthRequest) {
        console.debug("Auth request failed due to network issue - this might be expected during token validation");
      }
    } else {
      // Don't log expected errors
      const isImageDeletion = error.config?.url?.includes('/api/images/');
      const isLogout = error.config?.url?.includes('/api/auth/logout');
      const isUserRating = error.config?.url?.includes('/ratings/my-rating');
      const isRefreshToken = error.config?.url?.includes('/api/auth/refresh');
      const is404 = error.response?.status === 404;
      const is400 = error.response?.status === 400;
      const is401 = error.response?.status === 401;

      if ((isImageDeletion && is404) || 
          (isLogout && is400) || 
          (isUserRating && is404) || 
          (isRefreshToken && (is400 || is401))) {
        // Silently suppress expected errors:
        // - 404 for image deletion attempts (handled by fallback logic)
        // - 400 for logout attempts (backend might not have logout endpoint)
        // - 404 for user rating requests (user hasn't rated yet - normal behavior)
        // - 400/401 for refresh token attempts (token may be invalid/expired)
        console.debug(`Suppressing expected error for ${error.config?.url}: ${error.response.status}`);
      } else {
        console.debug(`API Error: ${error.config?.url} - ${error.response.status}`, error.response?.data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

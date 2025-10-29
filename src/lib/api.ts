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
// Add throttling to prevent spam calls
let isInitializing = false;
let lastInitResult: boolean | null = null;

export const initializeAuth = async () => {
  if (typeof window === 'undefined') return false;
  
  // Prevent multiple concurrent initializations
  if (isInitializing) {
    console.debug("Auth initialization already in progress, skipping");
    return lastInitResult || false;
  }
  
  isInitializing = true;
  
  // Attempt to load tokens from localStorage
  const ACCESS_TOKEN_KEY = "access_token";
  const TOKEN_EXPIRES_AT_KEY = "token_expires_at";
  
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  
  console.debug("Initializing auth from localStorage");
  
  // ✅ FIX: If no access token, try to refresh from cookie first
  if (!accessToken || !expiresAtStr) {
    console.debug("No access token in localStorage, attempting to refresh from cookie");
    try {
      const newToken = await safeRefreshToken();
      if (newToken) {
        console.debug("Successfully refreshed token from cookie during initialization");
        lastInitResult = true;
        isInitializing = false;
        return true;
      } else {
        console.debug("No refresh token cookie available");
        lastInitResult = false;
        isInitializing = false;
        return false;
      }
    } catch (error: any) {
      console.debug("Failed to refresh from cookie during initialization:", error?.message || "Unknown error");
      lastInitResult = false;
      isInitializing = false;
      return false;
    }
  }
  
  if (accessToken && expiresAtStr) {
    const expiresAt = parseInt(expiresAtStr, 10);
    const timeRemaining = expiresAt - Date.now();
    
    console.debug(`Token time remaining at initialization: ${timeRemaining}ms`);
    
    // Check if token is still valid before setting authenticated state
    const isTokenValid = expiresAt > Date.now();
    
    // Always restore the token from localStorage first, but only set authenticated if valid
    const { getState, setState } = useAuthStore;
    setState({
      ...getState(),
      accessToken: isTokenValid ? accessToken : null,
      tokenExpiresAt: isTokenValid ? expiresAt : null,
      isAuthenticated: isTokenValid
    });
    
    // If token is not expired or close to expiry
    if (isTokenValid && expiresAt > Date.now()) {
      // For very short-lived tokens, only refresh if less than 2 seconds remaining
      // Reduce aggressive refreshing to avoid unnecessary calls
      if (timeRemaining < 2000) {
        console.debug("Token very close to expiry during initialization, refreshing immediately");
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
          lastInitResult = false;
          isInitializing = false;
          return false;
        }
      }
      
      console.debug("Token is still valid, no refresh needed");
      lastInitResult = true;
      isInitializing = false;
      return true;
    } else if (!isTokenValid) {
      console.debug("Token expired, but not attempting refresh during initialization to avoid conflicts");
      // Don't attempt refresh during initialization to avoid multiple refresh calls
      // Let the AuthProvider handle this instead
      lastInitResult = false;
      isInitializing = false;
      return false;
    }
  }
  
  lastInitResult = false;
  isInitializing = false;
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

// Token refresh threshold in ms (3 seconds before expiry)
// For extremely short token lifetime (8s), we need to be more aggressive
const TOKEN_REFRESH_THRESHOLD = 3000;

// Check if token needs refresh
const shouldRefreshToken = () => {
  const { tokenExpiresAt } = useAuthStore.getState();
  if (!tokenExpiresAt) return false;
  
  // Debug token expiration
  const timeRemaining = tokenExpiresAt - Date.now();
  console.debug(`Token time remaining: ${timeRemaining}ms`);
  
  return timeRemaining <= TOKEN_REFRESH_THRESHOLD;
};

// Safely handle token refresh with fallback
const safeRefreshToken = async () => {
  try {
    // Use our specialized Next.js API route for token refresh
    const refreshAxios = axios.create({
      timeout: 5000,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    
    console.debug("Attempting token refresh through specialized Next.js API endpoint");
    // Use our dedicated token refresh endpoint that handles redirects properly
    const response = await refreshAxios.post('/api/auth/token-refresh');
    
    if (response.data?.result?.accessToken) {
      const { accessToken, expiresIn } = response.data.result;
      // For extremely short-lived tokens (8s), add a small buffer
      const bufferTime = expiresIn <= 10 ? 500 : 0;
      const expiresAt = Date.now() + (expiresIn * 1000) - bufferTime;
      
      console.debug(`Token refresh successful via proxy. Expires in ${expiresIn}s`);
      
      // Update auth store manually
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("token_expires_at", expiresAt.toString());
      
      useAuthStore.setState({
        accessToken,
        refreshToken: null, // Not storing refresh token in state
        tokenExpiresAt: expiresAt,
        isAuthenticated: true
      });
      
      return accessToken;
    } else {
      console.debug("Invalid response format from refresh endpoint");
      return null;
    }
  } catch (error: any) {
    console.debug("Token refresh failed:", 
      error.response ? `Status ${error.response.status}` : error.message || "Unknown error");
    return null;
  }
};

// Add request interceptor
api.interceptors.request.use(async (config) => {
  // Block any requests to Google OAuth that might happen due to redirects
  if (config.url?.includes('accounts.google.com') || 
      config.url?.includes('oauth2') || 
      config.url?.includes('google.com')) {
    console.error("Blocking request to OAuth URL:", config.url);
    // Cancel the request
    return Promise.reject(new Error("OAuth requests are not allowed in this context"));
  }
  
  // Don't intercept auth requests to prevent infinite loops
  if (config.url?.includes('/api/auth/token') || config.url?.includes('/api/auth/refresh')) {
    return config;
  }

  const { accessToken, refresh, tokenExpiresAt } = useAuthStore.getState();

  // ✅ FIX: If no access token but we're authenticated (refresh token cookie exists)
  // Try to refresh the token before making the request
  if (!accessToken && typeof window !== 'undefined') {
    console.debug("No access token found, attempting to refresh from cookie");
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await safeRefreshToken();
        if (newToken) {
          console.debug("Successfully refreshed token from cookie");
          config.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          return config;
        } else {
          console.debug("Failed to refresh token from cookie, request will proceed without token");
        }
      } catch (error: any) {
        console.debug("Error refreshing token from cookie:", error?.message || "Unknown error");
      } finally {
        isRefreshing = false;
      }
    }
  }

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
      const newToken = await safeRefreshToken(); // Use our new safe refresh function
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
        
        // Use the safe refresh function that handles CORS issues
        const newToken = await safeRefreshToken();

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

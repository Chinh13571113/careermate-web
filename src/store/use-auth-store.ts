/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api from "@/lib/api";
import { setCookie, removeCookie, getCookie } from "@/lib/cookies";

interface TokenResponse {
  accessToken: string;
  authenticated: boolean;
  expiresIn: number; // in seconds
  tokenType: string;
  // refreshToken is not included in response as it's in HTTP-only cookie
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null; // Keeping for backward compatibility, but won't be used
  isLoading: boolean;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null;
  login: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<string | null>; // No param needed as refresh token is in HTTP-only cookie
  introspect: (token: string) => Promise<{ valid: boolean; exp: number }>;
  logout: () => Promise<void>;
  getTokenExpiration: (token: string) => number;
}

// Storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token"; // Kept for backward compatibility
const TOKEN_EXPIRES_AT_KEY = "token_expires_at";
// Removed COOKIE_TOKEN_KEY as we don't want to store access token in cookies anymore

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
  refreshToken: null, // We don't need to store refresh token anymore as it's in HTTP-only cookie
  isLoading: false,
  isAuthenticated: typeof window !== "undefined" ? !!(localStorage.getItem(ACCESS_TOKEN_KEY)) : false,
  tokenExpiresAt: typeof window !== "undefined" ? Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY)) || null : null,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/auth/token", { email, password });
      const result = res.data.result as TokenResponse;
      const { accessToken, expiresIn, authenticated } = result;
      
      // Calculate token expiration time
      const expiresAt = Date.now() + (expiresIn * 1000);

      // Store both access token and expiration time in localStorage only
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
      // Removed setCookie as we don't want to store access token in cookies anymore

      set({
        accessToken,
        refreshToken: null, // Not storing refresh token anymore as it's in HTTP-only cookie
        tokenExpiresAt: expiresAt,
        isLoading: false,
        isAuthenticated: authenticated
      });
    } catch (err: any) {
      set({ isLoading: false });
      const backendMessage = err.response?.data?.message || err.message;
      throw backendMessage;
    }
  },

  getTokenExpiration: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).exp * 1000; // Convert to milliseconds
    } catch (error) {
      return 0;
    }
  },

  refresh: async () => {
    console.debug("Starting token refresh");
    try {
      // No need to pass the token as it's now in HTTP-only cookie
      const res = await api.post("/api/auth/refresh");
      
      // Check if we have a valid result with an access token
      if (!res.data?.result?.accessToken) {
        console.error("Invalid refresh response format:", res.data);
        throw new Error("Invalid response format");
      }
      
      const result = res.data.result as TokenResponse;
      const { accessToken, expiresIn } = result;
      
      // Calculate token expiration time
      const expiresAt = Date.now() + (expiresIn * 1000);
      
      console.debug(`Token refreshed successfully. Expires in ${expiresIn}s`);
      
      // Store both access token and expiration time in localStorage only
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
      // Removed setCookie as we don't want to store access token in cookies anymore

      set({
        accessToken,
        refreshToken: null, // Not storing refresh token anymore
        tokenExpiresAt: expiresAt,
        isAuthenticated: true
      });
      return accessToken;
    } catch (err: any) {
      // Handle the error more gracefully
      console.debug("Token refresh failed");
      
      // Don't log the full error object to prevent console.error('Server error:') issues
      if (err.response) {
        console.debug(`Refresh error: Status ${err.response.status}`);
      } else if (err.message) {
        console.debug(`Refresh error: ${err.message}`);
      }
      
      // Clear tokens only if it's an authentication error (401) or server error (500)
      if (!err.response || err.response?.status === 401 || err.response?.status >= 500) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
        removeCookie(COOKIE_TOKEN_KEY);
        set({
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
          isAuthenticated: false
        });
      }
      return null;
    }
  },

  introspect: async (token: string) => {
    try {
      const res = await api.post("/api/auth/introspect", { token });
      // Check if we have a valid result
      if (!res.data?.result) {
        console.debug("Invalid introspect response format:", res.data);
        return { valid: false, exp: 0 };
      }
      const { valid, exp } = res.data.result;
      return { valid, exp };
    } catch (err: any) {
      // Handle network errors separately
      if (!err.response) {
        // If it's a network error, don't immediately invalidate the token
        // This helps during server startup or temporary network issues
        console.debug("Network error during token introspection - can't verify token");
        
        // For network errors, try to extract expiration from the token itself
        // as a fallback mechanism
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const exp = tokenData.exp;
          const now = Math.floor(Date.now() / 1000);
          
          // If token is not expired according to its payload, consider it valid
          if (exp && exp > now) {
            console.debug("Using token self-contained expiration as fallback");
            return { valid: true, exp };
          }
        } catch (parseErr) {
          console.debug("Could not parse token for expiration time");
        }
      }
      
      console.debug("Token introspection failed, considering token invalid");
      return { valid: false, exp: 0 };
    }
  },

  logout: async () => {
    try {
      // Simply call the logout endpoint - no tokens needed in request body
      // as refresh token is in HTTP-only cookie
      await api.post("/api/auth/logout");
    } catch (err) {
      // Even if backend logout fails, we proceed with client-side logout
      console.error("Logout error:", err);
    } finally {
      // Always clear all tokens regardless of backend response
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
      // Note: The refresh token cookie is already cleared by the backend
      // Remove any legacy cookie we might have used (we don't use it anymore)
      removeCookie("token");
      set({
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: false
      });
    }
  },
}));

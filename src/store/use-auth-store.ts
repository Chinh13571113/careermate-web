/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api from "@/lib/api";
import { setCookie, removeCookie, getCookie } from "@/lib/cookies";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
  expiresIn: number;
  tokenType: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  refresh: (refreshToken: string) => Promise<string | null>;
  introspect: (token: string) => Promise<{ valid: boolean; exp: number }>;
  logout: () => Promise<void>;
  getTokenExpiration: (token: string) => number;
}

// Storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const COOKIE_TOKEN_KEY = "token";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: typeof window !== "undefined" ? (localStorage.getItem(ACCESS_TOKEN_KEY) || getCookie(COOKIE_TOKEN_KEY)) : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  isLoading: false,
  isAuthenticated: typeof window !== "undefined" ? !!(localStorage.getItem(ACCESS_TOKEN_KEY)) : false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/auth/token", { email, password });
      const result = res.data.result as TokenResponse;
      const { accessToken, refreshToken, authenticated } = result;

      // Store tokens
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setCookie(COOKIE_TOKEN_KEY, accessToken);

      set({
        accessToken,
        refreshToken,
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

  refresh: async (refreshToken: string) => {
    try {
      const res = await api.post("/api/auth/refresh", { token: refreshToken });
      const result = res.data.result as TokenResponse;
      const { accessToken, refreshToken: newRefreshToken } = result;

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      setCookie(COOKIE_TOKEN_KEY, accessToken);

      set({
        accessToken,
        refreshToken: newRefreshToken
      });
      return accessToken;
    } catch (err) {
      console.error("Refresh failed:", err);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      });
      return null;
    }
  },

  introspect: async (token: string) => {
    try {
      const res = await api.post("/api/auth/introspect", { token });
      const { valid, exp } = res.data.result;
      return { valid, exp };
    } catch {
      return { valid: false, exp: 0 };
    }
  },

  logout: async () => {
    try {
      const { accessToken, refreshToken } = get();
      if (accessToken) {
        try {
          // Try to notify backend about logout
          await api.post("/api/auth/logout", {
            accessToken,
            refreshToken
          });
        } catch (backendError) {
          // Backend logout failed, but we still clear local tokens
          console.log("Backend logout failed (this is okay):", backendError);
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear all tokens regardless of backend response
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      removeCookie(COOKIE_TOKEN_KEY);
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      });
    }
  },
}));

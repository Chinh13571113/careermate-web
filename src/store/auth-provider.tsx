"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

// For very short token lifetimes (e.g. 8s), check more frequently
const REFRESH_INTERVAL = 3 * 1000; // 3 seconds
const REFRESH_THRESHOLD = 4 * 1000; // Refresh if less than 4 seconds left

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, introspect, refresh, logout, getTokenExpiration } = useAuthStore();
  const lastCheckRef = useRef<number>(0);
  const isRefreshingRef = useRef(false);
  
  // Add a useEffect to validate the token on initial load
  useEffect(() => {
    const validateToken = async () => {
      const token = useAuthStore.getState().accessToken;
      if (!token) return;
      
      try {
        // Check token validity - if invalid, try to refresh
        const { valid } = await introspect(token);
        if (!valid) {
          console.debug("Stored token is invalid, attempting refresh...");
          await refresh();
        }
      } catch (error: any) {
        // Handle network errors gracefully - don't treat as critical
        const isNetworkError = !error.response;
        if (isNetworkError) {
          console.debug("Network error during token validation - this is not critical if server is still starting up");
          // Don't logout on network errors during initial validation - 
          // the server might still be starting up or temporarily unavailable
        } else {
          console.debug("Error validating token on startup:", error?.message || "Unknown error");
          // For non-network errors, try a refresh anyway
          try {
            await refresh();
          } catch (refreshError) {
            // Silently handle refresh errors on startup
            console.debug("Refresh attempt after validation error also failed");
          }
        }
      }
    };
    
    validateToken();
  }, [introspect, refresh]);

  const checkAndRefreshToken = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) return;

    // Don't check if no token
    if (!accessToken) return;

    // Rate limit checks
    const now = Date.now();
    if (now - lastCheckRef.current < REFRESH_INTERVAL) return;
    lastCheckRef.current = now;

    try {
      isRefreshingRef.current = true;

      // Get token expiration time from state
      const { tokenExpiresAt } = useAuthStore.getState();
      // If we don't have an expiration time, calculate it from the token
      const tokenExp = tokenExpiresAt || getTokenExpiration(accessToken);
      const timeLeft = tokenExp - now;

      if (timeLeft <= REFRESH_THRESHOLD) {
        console.debug("Token expiring soon - refreshing");
        try {
          // Use HTTP-only cookie for refresh
          const newToken = await refresh();
          if (!newToken) {
            console.debug("Token refresh failed - logging out");
            await logout();
          } else {
            console.debug("✅ Token refreshed successfully");
          }
        } catch (refreshError: any) {
          // Handle network errors differently
          const isNetworkError = !refreshError.response;
          if (isNetworkError) {
            console.debug("Network error during scheduled token refresh - will try again later");
            // Don't logout on network errors, just try again next interval
          } else {
            console.debug("Token refresh error:", refreshError?.message || "Unknown error");
            await logout();
          }
        }
      }
    } catch (err: any) {
      console.debug("Token refresh check failed:", err?.message || "Unknown error");
      // Only logout for non-network errors
      if (err.response) {
        await logout();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [accessToken, refresh, logout, getTokenExpiration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const start = async () => {
      if (!accessToken) return;

      // Initial check but wait a bit to prevent immediate refresh
      const initialDelay = setTimeout(() => {
        checkAndRefreshToken();
      }, 1000);

      // Start periodic checks
      interval = setInterval(checkAndRefreshToken, REFRESH_INTERVAL);

      return () => {
        clearTimeout(initialDelay);
        if (interval) {
          clearInterval(interval);
        }
      };
    };

    const cleanup = start();
    return () => {
      cleanup.then(cleanup => cleanup?.());
    };
  }, [accessToken, checkAndRefreshToken]);

  return <>{children}</>;
}



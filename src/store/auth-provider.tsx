"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

// Check every 5 minutes instead of every minute
const REFRESH_INTERVAL = 5 * 60 * 1000;
const REFRESH_THRESHOLD = 15 * 60 * 1000; // Refresh if less than 15 minutes left

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, introspect, refresh, logout, getTokenExpiration } = useAuthStore();
  const lastCheckRef = useRef<number>(0);
  const isRefreshingRef = useRef(false);

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

      // Get token expiration without making a network call
      const tokenExp = getTokenExpiration(accessToken);
      const timeLeft = tokenExp - now;

      if (timeLeft <= REFRESH_THRESHOLD) {
        console.log("Token expiring soon - refreshing");
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          console.warn("No refresh token available - logging out");
          await logout();
          return;
        }
        const newToken = await refresh(refreshToken);
        if (!newToken) {
          console.warn("Token refresh failed - logging out");
          await logout();
        } else {
          console.log("✅ Token refreshed successfully");
        }
      }
    } catch (err) {
      console.error("Token refresh check failed:", err);
      await logout();
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



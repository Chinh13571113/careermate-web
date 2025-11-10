"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";

// Component to handle cleanup on page unload
export function AuthCleanup() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't trigger logout on page refresh/navigation
      console.debug("Page unloading - preserving auth state");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Page became visible again - sync auth state
        console.debug("Page became visible - syncing auth state");

        const token = localStorage.getItem("access_token");
        const expiry = localStorage.getItem("token_expires_at");

        if (token && expiry) {
          const expiresAt = parseInt(expiry, 10);
          const isValid = expiresAt > Date.now();

          if (isValid) {
            const { isAuthenticated } = useAuthStore.getState();
            if (!isAuthenticated) {
              useAuthStore.setState({
                accessToken: token,
                tokenExpiresAt: expiresAt,
                isAuthenticated: true,
              });
            }
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}

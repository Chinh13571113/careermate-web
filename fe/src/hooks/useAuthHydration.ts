"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export function useAuthHydration(): boolean {
  const hasHydrated = useRef(false);

  const setLoading = useAuthStore((s) => s.setLoading);
  const setAuthFromTokens = useAuthStore((s) => s.setAuthFromTokens);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // 1) Đồng bộ ngay từ localStorage trước khi paint (giảm flash)
  useLayoutEffect(() => {
    if (typeof window === "undefined" || hasHydrated.current) return;
    hasHydrated.current = true;

    setLoading(true);

    const storedToken = localStorage.getItem("access_token");
    const storedExpiry = localStorage.getItem("token_expires_at");
    const expiresAt = storedExpiry ? parseInt(storedExpiry, 10) : 0;
    const isValid = !!storedToken && expiresAt > Date.now();

    if (isValid) {
      // Cập nhật store ngay lập tức (đồng bộ UI)
      setAuthFromTokens({
        accessToken: storedToken!,
        tokenExpiresAt: expiresAt,
        isAuthenticated: true,
        // role sẽ được cập nhật chuẩn ở bước async dưới
      });
    } else {
      // Xóa token hỏng/hết hạn
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expires_at");
      localStorage.removeItem("refresh_token");
      clearAuth();
    }
  }, [setLoading, setAuthFromTokens, clearAuth]);

  // 2) Xác thực/refresh async (introspect / lấy role)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    (async () => {
      try {
        const api = await import("@/lib/api").catch(() => null);
        const initializeAuth = api?.initializeAuth as
          | (() => Promise<
              | false
              | {
                  accessToken?: string | null;
                  tokenExpiresAt?: number | null;
                  isAuthenticated: boolean;
                  role?: string | null;
                }
            >)
          | undefined;

        let result:
          | false
          | {
              accessToken?: string | null;
              tokenExpiresAt?: number | null;
              isAuthenticated: boolean;
              role?: string | null;
            } = false;

        if (initializeAuth) {
          // initializeAuth nên tự xử lý refresh + /me để lấy role
          result = await initializeAuth();
        }

        if (!cancelled) {
          if (result && result.isAuthenticated) {
            setAuthFromTokens({
              accessToken: result.accessToken ?? localStorage.getItem("access_token"),
              tokenExpiresAt:
                typeof result.tokenExpiresAt === "number"
                  ? result.tokenExpiresAt
                  : (localStorage.getItem("token_expires_at")
                      ? parseInt(localStorage.getItem("token_expires_at")!, 10)
                      : null),
              isAuthenticated: true,
              role: result.role ?? null,
            });
          } else {
            clearAuth();
          }
        }
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setAuthFromTokens, clearAuth, setLoading]);

  // 3) Đồng bộ đa tab (nếu đăng xuất ở tab khác)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key === "access_token" ||
        e.key === "token_expires_at" ||
        e.key === "refresh_token"
      ) {
        const token = localStorage.getItem("access_token");
        const expStr = localStorage.getItem("token_expires_at");
        const exp = expStr ? parseInt(expStr, 10) : 0;
        const valid = !!token && exp > Date.now();

        if (valid) {
          setAuthFromTokens({
            accessToken: token!,
            tokenExpiresAt: exp,
            isAuthenticated: true,
          });
        } else {
          clearAuth();
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setAuthFromTokens, clearAuth]);

  // Return hydration status
  return hasHydrated.current;
}

"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, User, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthHydration } from "@/hooks/useAuthHydration";
import { safeLog, DEBUG } from "@/lib/debug-config";
import { getRoleFromToken, getRoleDisplayName } from "@/lib/role-utils";

interface CandidateAuthGuardProps {
  children: ReactNode;
  redirectIfGuest?: string; // mặc định: /sign-in
}

/**
 * CandidateAuthGuard
 * Chỉ yêu cầu user đã đăng nhập (bất kỳ role nào)
 * Tất cả user đã đăng nhập đều có thể access candidate features
 */
export default function CandidateAuthGuard({
  children,
  redirectIfGuest = "/sign-in",
}: CandidateAuthGuardProps) {
  // First, check localStorage immediately (synchronous)
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  // Decode role from JWT instead of reading from localStorage
  const tokenRole = storedToken ? getRoleFromToken(storedToken) : null;

  // ⚠️ SECURITY: Don't log token values
  if (DEBUG.ADMIN_GUARD) {
    safeLog.authState("🔍 [CandidateAuthGuard] Initial check", {
      hasToken: !!storedToken,
      role: tokenRole,
    });
  }

  // If we have valid token, render immediately
  if (storedToken && tokenRole) {
    if (DEBUG.ADMIN_GUARD) {
      safeLog.authState(
        "✅ [CandidateAuthGuard] Has stored credentials - rendering children immediately",
        {}
      );
    }
    return <>{children}</>;
  }

  // 1) Đảm bảo store đã rehydrate từ localStorage
  const hasHydrated = useAuthHydration();
  const router = useRouter();

  // 2) Đọc state từ store (reactive)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const role = useAuthStore((s) => s.role);
  const accessToken = useAuthStore((s) => s.accessToken);

  // 3) Điều hướng sau khi đã hydrate + hết loading
  useEffect(() => {
    if (!hasHydrated || isLoading) {
      console.debug("🔍 Candidate Guard: Still loading or not hydrated yet");
      return;
    }

    // Debug gọn
    console.debug("🔍 Candidate Guard Check", {
      isAuthenticated,
      role,
      hasToken: !!accessToken,
    });

    // If NOT authenticated => redirect to sign-in
    if (!isAuthenticated || !accessToken) {
      console.debug(
        "🔍 Candidate Guard: Not authenticated, redirecting to",
        redirectIfGuest
      );
      setTimeout(() => {
        router.replace(redirectIfGuest);
      }, 100);
      return;
    }

    console.debug("✅ Candidate Guard: Access granted - user is authenticated");
  }, [
    hasHydrated,
    isLoading,
    isAuthenticated,
    accessToken,
    role,
    router,
    redirectIfGuest,
  ]);

  // 4) UI trạng thái
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <LoaderCircle className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập…</p>
        </div>
      </div>
    );
  }

  // Re-check after hydration
  if (DEBUG.ADMIN_GUARD) {
    safeLog.authState("🔍 [CandidateAuthGuard] Render check", {
      hasHydrated,
      isLoading,
      isAuthenticated,
      role,
      hasToken: !!accessToken,
    });
  }

  // If authenticated, render children
  if (isAuthenticated && (role || accessToken)) {
    if (DEBUG.ADMIN_GUARD) {
      safeLog.authState("✅ [CandidateAuthGuard] Rendering children - access granted", {});
    }
    return <>{children}</>;
  }

  // ===== LOADING UI =====
  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <LoaderCircle className="h-8 w-8 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // ===== NOT AUTHENTICATED UI =====
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Yêu cầu đăng nhập
        </h2>
        <p className="text-gray-600 mb-6">
          Vui lòng đăng nhập để truy cập trang này.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push(redirectIfGuest)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

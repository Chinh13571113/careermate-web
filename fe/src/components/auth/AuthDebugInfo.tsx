"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useAdminCheck } from "@/lib/auth-admin-new";
import { useEffect, useState } from "react";

export function AuthDebugInfo() {
  const [mounted, setMounted] = useState(false);
  const { accessToken, isAuthenticated, role, user, tokenExpiresAt } =
    useAuthStore();
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading debug info...</div>;
  }

  // Get localStorage values directly
  const localStorageData =
    typeof window !== "undefined"
      ? {
          accessToken: localStorage.getItem("access_token"),
          tokenExpiry: localStorage.getItem("token_expires_at"),
          // user_role và user_info đã bị xóa khỏi localStorage (security)
        }
      : null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-lg max-w-md text-sm z-50">
      <h4 className="font-bold mb-2">🔍 Auth Debug Info</h4>

      <div className="space-y-1">
        <p>
          <strong>Store Authenticated:</strong>{" "}
          {isAuthenticated ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Store Admin:</strong> {isAdmin ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Store Role:</strong> {role || "null"}
        </p>
        <p>
          <strong>Store User:</strong> {user?.email || "null"}
        </p>
        <p>
          <strong>Token Expiry:</strong>{" "}
          {tokenExpiresAt ? new Date(tokenExpiresAt).toLocaleString() : "null"}
        </p>
      </div>

      {localStorageData && (
        <div className="mt-3 pt-3 border-t">
          <h5 className="font-semibold">localStorage:</h5>
          <div className="space-y-1">
            <p>
              <strong>Token:</strong>{" "}
              {localStorageData.accessToken
                ? `${localStorageData.accessToken.substring(0, 20)}...`
                : "null"}
            </p>
            <p className="text-gray-500 text-xs">
              • user_role: Removed (decode from JWT)
            </p>
            <p className="text-gray-500 text-xs">
              • user_info: Removed (security)
            </p>
            <p>
              <strong>Expiry:</strong>{" "}
              {localStorageData.tokenExpiry
                ? new Date(
                    parseInt(localStorageData.tokenExpiry)
                  ).toLocaleString()
                : "null"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

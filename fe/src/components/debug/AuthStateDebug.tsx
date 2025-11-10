"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useState, useEffect } from "react";

export function AuthStateDebug() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { accessToken, isAuthenticated, role, user, isLoading } =
    useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  // user_role đã bị xóa khỏi localStorage để bảo mật - decode từ JWT khi cần
  // user_info đã bị xóa khỏi localStorage để bảo mật - chỉ lấy từ store
  
  // Decode role từ token để hiển thị
  let tokenRole = null;
  if (storedToken) {
    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      if (payload.scope) {
        tokenRole = typeof payload.scope === 'string' ? payload.scope.split(' ')[0] : payload.scope;
      } else if (Array.isArray(payload.roles)) {
        tokenRole = payload.roles[0];
      }
    } catch (e) {
      // Không log lỗi để tránh spam console
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          🔍 Debug Auth
        </button>
      ) : (
        <div className="bg-white border-2 border-blue-600 rounded-lg shadow-xl p-4 max-w-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Auth State Debug</h3>
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <strong>Store State:</strong>
              <div className="ml-2 mt-1">
                <p>• Loading: {isLoading ? "⏳ Yes" : "✅ No"}</p>
                <p>• Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
                <p>• Role: {role || "❌ null"}</p>
                <p>• Has Token: {accessToken ? "✅ Yes" : "❌ No"}</p>
                <p>• User: {user?.email || "❌ null"}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded">
              <strong>LocalStorage:</strong>
              <div className="ml-2 mt-1">
                <p>• Token: {storedToken ? "✅ Present" : "❌ Missing"}</p>
                <p className="text-gray-500 text-xs">
                  • User role: Removed from localStorage (decode from JWT)
                </p>
                <p className="text-gray-500 text-xs">
                  • User info: Removed from localStorage (security)
                </p>
              </div>
            </div>

            {storedToken && (
              <div className="bg-green-50 p-2 rounded">
                <strong>Token Preview:</strong>
                <p className="text-xs break-all mt-1">
                  {storedToken.substring(0, 50)}...
                </p>
                {tokenRole && (
                  <p className="text-xs mt-1">
                    <strong>Role (from JWT):</strong> {tokenRole}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 mt-2"
            >
              Clear & Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

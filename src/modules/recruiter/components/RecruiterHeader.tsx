"use client";

import { useEffect, useState } from "react";
import { Link, Menu } from "lucide-react";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { useAuthStore } from "@/store/use-auth-store";
import { decodeJWT } from "@/lib/auth-admin";

interface RecruiterHeaderProps {
  sidebarOpen?: boolean;
}

export function RecruiterHeader({ sidebarOpen = false }: RecruiterHeaderProps) {
  const { user } = useAuthStore();
  const { isAuthenticated, accessToken, logout, role } = useAuthStore();
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-open") === "true";
    }
    return sidebarOpen;
  });
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Decode token CHỈ sau khi có accessToken ở client
    useEffect(() => {
      if (!accessToken) {
        setUserInfo(null);
        return;
      }
      try {
        const decoded = decodeJWT(accessToken);
        setUserInfo({
          email: decoded?.sub || decoded?.email || "User",
          name: decoded?.name || decoded?.sub || "User",
        });
  
        // Update store user if not set
        if (!user && decoded) {
          useAuthStore.setState({
            user: {
              id: decoded?.sub,
              email: decoded?.email || decoded?.sub,
              name: decoded?.name || decoded?.email || decoded?.sub,
            },
          });
        }
      } catch {
        setUserInfo(null);
      }
    }, [accessToken, user]);

  useEffect(() => {
    const checkSidebarState = () => {
      const savedState = localStorage.getItem("sidebar-open");
      const newIsOpen = savedState === "true";
      setIsOpen(newIsOpen);
    };

    // Lắng nghe hover events từ sidebar
    const handleSidebarHover = (event: CustomEvent) => {
      console.log("🎯 Header received sidebar state:", event.detail);
      setIsOpen(event.detail.isOpen);
    };

    window.addEventListener("sidebar-toggle", checkSidebarState);
    window.addEventListener(
      "sidebar-hover",
      handleSidebarHover as EventListener
    );

    // Gọi ngay 1 lần đầu tiên khi mount
    checkSidebarState();

    return () => {
      window.removeEventListener("sidebar-toggle", checkSidebarState);
      window.removeEventListener(
        "sidebar-hover",
        handleSidebarHover as EventListener
      );
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebar-open", newState.toString());
    localStorage.setItem("sidebar-pinned", newState.toString()); // Pin when manually toggled

    // Gửi cả 2 events
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("sidebar-toggle"));
      window.dispatchEvent(
        new CustomEvent("sidebar-hover", {
          detail: { isOpen: newState, isHover: false, isPinned: newState },
        })
      );
    });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-[#1b1b20f5] text-[#ffffff] transition-all duration-300 ${
        isOpen ? "ml-64" : "ml-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-6">
          {/* Nút menu */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[#436a9d] transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Tiêu đề */}
          <h1 className="text-lg font-semibold">CareerMate</h1>
        </div>
        <div className="flex items-center gap-4">
          

          {/* Bên phải header */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <span className="sm:block text-gray-300 hover:text-white transition-colors hidden text-xs md:inline">
                    For Recruiter abc
                  </span>

                  <ProfileDropdown
                    userName={user?.email || userInfo?.email || "User"}
                    userEmail={user?.email || userInfo?.email}
                    role={role || undefined}
                    userAvatar="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTPMg7sLIhRN7k0UrPxSsHzujqgLqdTq67Pj4uVqKmr4sFR0eH4h4h-sWjxVvi3vKOl47pyShZMal8qcNuipNE4fbSfblUL99EfUtDrBto"
                  />
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
        </div>
      </div>
      <div className="border-b border-[#1f4171]"></div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Link, Menu } from "lucide-react";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { useAuthStore } from "@/store/use-auth-store";

interface RecruiterHeaderProps {
  sidebarOpen?: boolean;
}

export function RecruiterHeader({ sidebarOpen = false }: RecruiterHeaderProps) {
  const { user } = useAuthStore();
  const { isAuthenticated, accessToken, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-open") === "true";
    }
    return sidebarOpen;
  });

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
          <span className="hidden text-xs md:inline text-[#ffffff]">
            For Recruiter
          </span>

          {isAuthenticated && user ? (
            <ProfileDropdown
              userName={user?.name || user?.email || "Candidate"}
              userEmail={user?.email}
              userAvatar="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTPMg7sLIhRN7k0UrPxSsHzujqgLqdTq67Pj4uVqKmr4sFR0eH4h4h-sWjxVvi3vKOl47pyShZMal8qcNuipNE4fbSfblUL99EfUtDrBto"
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border-b border-[#1f4171]"></div>
    </header>
  );
}

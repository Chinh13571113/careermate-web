"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useClientAuth } from "@/hooks/useClientAuth";
import { decodeJWT } from "@/lib/auth-admin";
import toast from "react-hot-toast";
import CandidateMenuList from "@/components/layout/CandidateMenuList";

export function ClientHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Use new client auth hook for proper localStorage handling
  const { mounted, isAuthenticated, accessToken, user, role } = useClientAuth();
  const { logout } = useAuthStore();
  const getMenuItemsByRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return [
          { href: "/admin/dashboard", label: "Admin Dashboard", icon: "📊" },
          { href: "/admin/users", label: "User Management", icon: "👥" },
          { href: "/admin/logs", label: "System Logs", icon: "🧾" },
        ];
      case "RECRUITER":
        return [
          { href: "/employer/dashboard", label: "Dashboard", icon: "📋" },
          { href: "/employer/jobs", label: "My Job Posts", icon: "💼" },
          { href: "/employer/candidates", label: "Candidates", icon: "🧑‍💻" },
        ];
      default: // USER
        return [
          { href: "/candidate/profile", label: "Your profile", icon: "👤" },
          { href: "/candidate/my-jobs", label: "My Jobs", icon: "💼" },
          {
            href: "/candidate/cv-templates",
            label: "CV Templates",
            icon: "📄",
          },
        ];
    }
  };

  console.log("🔧 [HEADER] Rendered with auth data:", {
    mounted,
    isAuthenticated,
    hasToken: !!accessToken,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Simple mount effect for debug
  useEffect(() => {
    console.log("🟣 [HEADER] ClientHeader mounted with auth:", {
      isAuthenticated,
      hasToken: !!accessToken,
      user,
      role,
    });
  }, [isAuthenticated, accessToken, user, role]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Decode token after hydration to avoid SSR mismatch
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
    } catch {
      setUserInfo(null);
    }
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setIsUserMenuOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  // Render a skeleton header until the client rehydrates and auth state is restored
  if (!isHydrated || !mounted) {
    return (
      <header
        suppressHydrationWarning
        className="bg-[#1b1b20f5] text-white shadow-lg fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/general/newlogo.png"
              alt="Logo"
              className="h-14 w-auto"
            />
            <span className="text-xl font-bold">CareerMate</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-8 w-20 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-white/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  console.log("🟣 [HEADER] Rendering with final auth state:", {
    isAuthenticated,
    hasToken: !!accessToken,
  });

  return (
    <header
      suppressHydrationWarning
      className="bg-[#1b1b20f5] text-[#fff] shadow-lg fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/images/general/newlogo.png"
                alt="Logo"
                className="h-14 w-auto"
              />
              <span className="text-xl font-bold text-[#ffffff]">
                CareerMate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link
                href="/jobs"
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>All Jobs</span>
                <ChevronDown className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative group">
              <Link
                href="/companies"
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Companies</span>
                <ChevronDown className="w-4 h-4" />
              </Link>
            </div>

            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>

            <Link
              href="/cv-templates-introduction"
              className="text-gray-300 hover:text-white transition-colors"
            >
              CV Templates
            </Link>

            <Link
              href="/ai-jobs"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <span>AI Jobs</span>
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                HOT
              </span>
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Link
              href="/recruiter"
              className="hidden sm:block text-gray-300 hover:text-white transition-colors"
            >
              For Employers
            </Link>

            {/* Authentication State */}
            {isAuthenticated && userInfo ? (
              <div
                className="relative"
                ref={userMenuRef ? userMenuRef : undefined}
              >
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {userInfo.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* ========= User Dropdown ======================= */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {userInfo.name}
                      </p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                    </div>
                    {role === "CANDIDATE" && (
                      <CandidateMenuList
                        prefixCandidate
                        compact
                        onItemClick={() => setIsUserMenuOpen(false)}
                      />
                    )}

                    {/* Example later: recruiter / admin can use different menus */}
                    {role === "RECRUITER" && (
                      <>
                        <Link
                          href="/employer/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>📋</span>
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/employer/jobs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>💼</span>
                          <span>My Job Posts</span>
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 bg-gray-800 fixed left-0 right-0 top-16 z-50">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/jobs"
                className="block text-gray-300 hover:text-white"
              >
                All Jobs
              </Link>
              <Link
                href="/companies"
                className="block text-gray-300 hover:text-white"
              >
                Companies
              </Link>
              <Link
                href="/blog"
                className="block text-gray-300 hover:text-white"
              >
                Blog
              </Link>
              <Link
                href="/cv-templates-introduction"
                className="block text-gray-300 hover:text-white"
              >
                CV Templates
              </Link>
              <Link
                href="/ai-jobs"
                className="block text-gray-300 hover:text-white"
              >
                AI Jobs
              </Link>
              <Link
                href="/update-cvprofile"
                className="block text-gray-300 hover:text-white"
              >
                My Profile
              </Link>
              <Link
                href="/recruiter"
                className="block text-gray-300 hover:text-white"
              >
                For Employers
              </Link>

              {/* Mobile Auth State */}
              {isAuthenticated && userInfo ? (
                <div className="border-t border-gray-700 pt-4">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-white">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-400">{userInfo.email}</p>
                  </div>
                  {getMenuItemsByRole(role ?? "ROLE_CANDIDATE").map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-gray-300 hover:text-white flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <Link
                    href="/sign-in"
                    className="block px-2 py-2 text-gray-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block px-2 py-2 text-gray-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default ClientHeader;



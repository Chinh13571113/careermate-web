"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useClientAuth } from "@/hooks/useClientAuth";
import { decodeJWT } from "@/lib/auth-admin";
import toast from "react-hot-toast";
import CandidateMenuList from "@/components/layout/CandidateMenuList";

export default function ClientHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Lấy trạng thái auth đã chuẩn hoá từ hook client
  const { mounted, isAuthenticated, accessToken, role } = useClientAuth();
  const { logout } = useAuthStore();

  // Đánh dấu đã hydrate (tránh SSR mismatch)
  useEffect(() => setIsHydrated(true), []);

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
    } catch {
      setUserInfo(null);
    }
  }, [accessToken]);

  // Đóng dropdown khi click ra ngoài / nhấn ESC
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setIsUserMenuOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
      // eslint-disable-next-line no-console
      console.error("Logout error:", error);
    }
  };

  // Skeleton nhẹ trong lúc chưa hydrate/mounted
  if (!isHydrated || !mounted) {
    return (
      <header suppressHydrationWarning className="bg-[#1b1b20f5] text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/general/newlogo.png" alt="Logo" className="h-14 w-auto" />
            <span className="text-xl font-bold">CareerMate</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-6">
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

  // Tiện check role đã normalize từ hook (ROLE_CANDIDATE/ROLE_RECRUITER/ROLE_ADMIN/ROLE_USER)
  const isCandidate = role === "ROLE_CANDIDATE";
  const isRecruiter = role === "ROLE_RECRUITER";

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
              <img src="/images/general/newlogo.png" alt="Logo" className="h-14 w-auto" />
              <span className="text-xl font-bold">CareerMate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">All Jobs</Link>
            <Link href="/companies" className="text-gray-300 hover:text-white transition-colors">Companies</Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            <Link href="/cv-templates-introduction" className="text-gray-300 hover:text-white transition-colors">CV Templates</Link>
            <Link href="/ai-jobs" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <span>AI Jobs</span>
              <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full">HOT</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link href="/recruiter" className="hidden sm:block text-gray-300 hover:text-white transition-colors">
              For Employers
            </Link>

            {/* Auth area */}
            {isAuthenticated && userInfo ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen(v => !v)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{userInfo.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                    </div>

                    {/* Candidate menu */}
                    {isCandidate && (
                      <CandidateMenuList
                        prefixCandidate
                        compact
                        onItemClick={() => setIsUserMenuOpen(false)}
                      />
                    )}

                    {/* Recruiter menu (tối giản – có thể tách ra component riêng sau) */}
                    {isRecruiter && (
                      <>
                        <Link
                          href="/employer/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          📋 Dashboard
                        </Link>
                        <Link
                          href="/employer/jobs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          💼 My Job Posts
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
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
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 bg-gray-800 fixed left-0 right-0 top-16 z-50">
            <div className="px-4 py-4 space-y-4">
              <Link href="/jobs" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>All Jobs</Link>
              <Link href="/companies" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Companies</Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
              <Link href="/cv-templates-introduction" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>CV Templates</Link>
              <Link href="/ai-jobs" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>AI Jobs</Link>
              <Link href="/update-cvprofile" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
              <Link href="/recruiter" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>For Employers</Link>

              {isAuthenticated && userInfo ? (
                <div className="border-t border-gray-700 pt-4">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-white">{userInfo.name}</p>
                    <p className="text-xs text-gray-400">{userInfo.email}</p>
                  </div>

                  {/* Gợi ý menu theo role ở mobile */}
                  {[
                    ...(isCandidate
                      ? [
                          { href: "/candidate/profile", label: "👤 Your profile" },
                          { href: "/candidate/my-jobs", label: "💼 My Jobs" },
                          { href: "/candidate/cv-templates", label: "📄 CV Templates" },
                        ]
                      : []),
                    ...(isRecruiter
                      ? [
                          { href: "/employer/dashboard", label: "📋 Dashboard" },
                          { href: "/employer/jobs", label: "💼 My Job Posts" },
                        ]
                      : []),
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
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
                  <Link href="/sign-in" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link href="/sign-up" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

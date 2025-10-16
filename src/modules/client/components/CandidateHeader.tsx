"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { decodeJWT } from "@/lib/auth-admin";
import toast from "react-hot-toast";
import CandidateMenuList from "@/components/layout/CandidateMenuList";

export default function CandidateHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, accessToken, logout } = useAuthStore();

  // ✅ Chỉ đánh dấu đã hydrate khi client mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ Decode token sau khi client mount
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = decodeJWT(accessToken);
        setUserInfo({
          email: decoded?.sub || decoded?.email || "User",
          name: decoded?.name || decoded?.sub || "User",
        });
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [accessToken]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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

  // ✅ Render tĩnh trước khi hydrate
  if (!isHydrated) {
    return (
      <header
        suppressHydrationWarning
        className="bg-[#1b1b20f5] text-white shadow-lg fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/general/newlogo.png" alt="Logo" className="h-14 w-auto" />
            <span className="text-xl font-bold">CareerMate</span>
          </Link>
        </div>
      </header>
    );
  }

  // ✅ Sau khi hydrate (client)
  return (
    <header
      suppressHydrationWarning
      className="bg-[#1b1b20f5] text-white shadow-lg fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/general/newlogo.png" alt="Logo" className="h-14 w-auto" />
              <span className="text-xl font-bold text-white">CareerMate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/candidate/jobs" className="text-gray-300 hover:text-white">All Jobs</Link>
            <Link href="/candidate/companies" className="text-gray-300 hover:text-white">Companies</Link>
            <Link href="/candidate/blog" className="text-gray-300 hover:text-white">Blog</Link>
            <Link href="/candidate/cv-templates-introduction" className="text-gray-300 hover:text-white">CV Templates</Link>
            <Link href="/candidate/ai-jobs" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <span>AI Jobs</span>
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">HOT</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link href="/recruiter" className="hidden sm:block text-gray-300 hover:text-white">
              For Employers
            </Link>

            {/* ✅ Render auth UI only after hydration */}
            {isAuthenticated && userInfo ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{userInfo.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                    </div>

                    <CandidateMenuList
                      onItemClick={() => setIsUserMenuOpen(false)}
                      prefixCandidate
                      compact
                    />

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
                <Link href="/sign-in" className="text-gray-300 hover:text-white">Sign In</Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

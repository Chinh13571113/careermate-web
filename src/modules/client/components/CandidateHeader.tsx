"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { decodeJWT } from "@/lib/auth-admin";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import toast from "react-hot-toast";

export function CandidateHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, accessToken, logout } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Giải mã token để lấy thông tin user
  const getUserInfo = () => {
    if (!accessToken) return null;
    try {
      const decoded = decodeJWT(accessToken);
      return {
        email: decoded?.sub || decoded?.email || "User",
        name: decoded?.name || decoded?.sub || "User",
      };
    } catch {
      return null;
    }
  };

  const user = getUserInfo();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-[#1b1b20f5] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* --- Logo --- */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/images/general/newlogo.png"
                alt="Logo"
                className="h-14 w-auto"
              />
              <span className="text-xl font-bold text-white">Candidate</span>
            </Link>
          </div>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/candidate/jobs"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <span>All Jobs</span>
              <ChevronDown className="w-4 h-4" />
            </Link>

            <Link
              href="/candidate/companies"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <span>Companies</span>
              <ChevronDown className="w-4 h-4" />
            </Link>

            <Link
              href="/candidate/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>

            <Link
              href="/candidate/cv-templates-introduction"
              className="text-gray-300 hover:text-white transition-colors"
            >
              CV Templates
            </Link>

            <Link
              href="/candidate/ai-jobs"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <span>AI Jobs</span>
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                HOT
              </span>
            </Link>
          </nav>

          {/* --- Right Side (Tích hợp “For Recruiter” + ProfileDropdown) --- */}
          <div className="flex items-center space-x-4">
            <span className="sm:block text-gray-300 hover:text-white transition-colors hidden text-xs md:inline">
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

            {/* --- Mobile Menu Button --- */}
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
      </div>
    </header>
  );
}

export default CandidateHeader;

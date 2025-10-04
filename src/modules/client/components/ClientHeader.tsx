"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export function ClientHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className="text-xl font-bold text-white">CareerMate</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        <div className="relative group">
                            <Link href="/jobs" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                                <span>All Jobs</span>
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="relative group">
                            <Link href="/companies" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                                <span>Companies</span>
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                        </div>

                        <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                            Blog
                        </Link>

                        <Link href="/cv-templates-introduction" className="text-gray-300 hover:text-white transition-colors">
                            CV Templates
                        </Link>

                        <Link href="/ai-jobs" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                            <span>AI Jobs</span>
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">HOT</span>
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        <Link href="/recruiter" className="hidden sm:block text-gray-300 hover:text-white transition-colors">
                            For Employers
                        </Link>

                        <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
                            Sign In
                        </Link>

                        <Link href="/sign-up" className="px-4 py-2 bg-gradient-to-r from-[#3a4660] to-gray-400 text-white rounded-md hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors">
                            Sign Up
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-300 hover:text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-700 bg-gray-800">
                        <div className="px-4 py-4 space-y-4">
                            <Link href="/jobs" className="block text-gray-300 hover:text-white">
                                All Jobs
                            </Link>
                            <Link href="/companies" className="block text-gray-300 hover:text-white">
                                Companies
                            </Link>
                            <Link href="/blog" className="block text-gray-300 hover:text-white">
                                Blog
                            </Link>
                            <Link href="/cv-templates-introduction" className="block text-gray-300 hover:text-white">
                                CV Templates
                            </Link>
                            <Link href="/ai-jobs" className="block text-gray-300 hover:text-white">
                                AI Jobs
                            </Link>
                            <Link href="/recruiter" className="block text-gray-300 hover:text-white">
                                For Employers
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default ClientHeader;

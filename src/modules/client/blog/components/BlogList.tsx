"use client";

import { BlogCard } from "./BlogCard";
import { VideoCard } from "./VideoCard";
import { mockBlogPosts, mockVideos } from "../types";
import { useState } from "react";
import { Play } from "lucide-react";

export function BlogList() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;
    const totalPages = Math.ceil(mockBlogPosts.length / postsPerPage);

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = mockBlogPosts.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gray-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <div className="flex items-center">
                            <a href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">H</span>
                                </div>
                                <span className="text-xl font-bold text-white">HireMate</span>
                                <span className="text-white font-bold text-xl">Blog</span>
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            <a href="/jobs" className="text-gray-300 hover:text-white transition-colors">All Jobs</a>
                            <a href="/companies" className="text-gray-300 hover:text-white transition-colors">Companies</a>
                            <a href="/blog" className="text-white font-medium">Blog</a>
                            <a href="/cv-templates" className="text-gray-300 hover:text-white transition-colors">CV Templates</a>
                            <a href="/ai-jobs" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                <span>AI Jobs</span>
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">HOT</span>
                            </a>
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            <a href="/recruiter" className="hidden sm:block text-gray-300 hover:text-white transition-colors">
                                For Employers
                            </a>
                            <a href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
                                Sign In
                            </a>
                            <a href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Blog Posts */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentPosts.map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center space-x-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &lt;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded ${page === currentPage
                                        ? 'bg-red-500 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Videos */}
                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            {mockVideos.slice(0, 6).map(video => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">H</span>
                                </div>
                                <span className="text-xl font-bold">HireMate</span>
                            </div>
                            <p className="text-gray-400 mb-4 max-w-md">
                                The leading AI-powered job portal connecting talented candidates with top employers.
                                Find your dream job or discover exceptional talent.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Facebook
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Twitter
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    LinkedIn
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Instagram
                                </a>
                            </div>
                        </div>

                        {/* For Candidates */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">For Candidates</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="/jobs" className="text-gray-400 hover:text-white transition-colors">
                                        Find Jobs
                                    </a>
                                </li>
                                <li>
                                    <a href="/companies" className="text-gray-400 hover:text-white transition-colors">
                                        Browse Companies
                                    </a>
                                </li>
                                <li>
                                    <a href="/cv-templates" className="text-gray-400 hover:text-white transition-colors">
                                        CV Templates
                                    </a>
                                </li>
                                <li>
                                    <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                                        Career Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* For Employers */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="/recruiter" className="text-gray-400 hover:text-white transition-colors">
                                        Post Jobs
                                    </a>
                                </li>
                                <li>
                                    <a href="/recruiter/candidates" className="text-gray-400 hover:text-white transition-colors">
                                        Find Candidates
                                    </a>
                                </li>
                                <li>
                                    <a href="/recruiter/pricing" className="text-gray-400 hover:text-white transition-colors">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="/recruiter/solutions" className="text-gray-400 hover:text-white transition-colors">
                                        Solutions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-800 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} HireMate. All rights reserved.
                            </div>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Terms of Service
                                </a>
                                <a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

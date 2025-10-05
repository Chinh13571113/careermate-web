"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BlogCard } from "./BlogCard";
import { VideoCard } from "./VideoCard";
import { mockVideos } from "../types";
import {
    Search,
    Calendar,
    User,
    Star,
    MessageSquare,
    BookOpen,
    Clock
} from 'lucide-react';
import { blogApi } from '@/lib/blog-api';
import { publicBlogApi } from '@/lib/public-blog-api';
import { Blog } from '@/types/blog';
import toast from 'react-hot-toast';

export function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const pageSize = 12;

    useEffect(() => {
        fetchBlogs();
    }, [currentPage]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const response = await publicBlogApi.getBlogs({
                page: currentPage,
                size: pageSize,
                sort: 'createdAt,desc',
                status: 'PUBLISHED' // Only show published blogs to users
            });

            const blogs = response.content || [];

            // Check for blob URLs and log warnings
            blogs.forEach(blog => {
                if (blog.thumbnailUrl?.startsWith('blob:')) {
                    console.warn('⚠️ BLOB URL DETECTED IN BLOG LIST:', {
                        blogId: blog.id,
                        title: blog.title,
                        thumbnailUrl: blog.thumbnailUrl,
                        message: 'This blog has a blob URL stored as thumbnail - needs database cleanup'
                    });
                }
            });

            setBlogs(blogs);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error: any) {
            console.error('❌ Public blog API error:', error);

            // Fallback to authenticated API
            try {
                const authResponse = await blogApi.getBlogs({
                    page: currentPage,
                    size: pageSize,
                    sort: 'createdAt,desc',
                    status: 'PUBLISHED'
                });
                setBlogs(authResponse.content);
                setTotalPages(authResponse.totalPages);
                setTotalElements(authResponse.totalElements);
                return;
            } catch (authError) {
                console.error('❌ Both public and authenticated API failed');
                toast.error('Unable to load blogs at this time');
                setBlogs([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = (blogs || []).filter(blog =>
        blog.status === 'PUBLISHED' && (
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getReadingTime = (content: string) => {
        const textLength = content.replace(/<[^>]*>/g, '').split(' ').length;
        const readingTime = Math.ceil(textLength / 200); // Average reading speed: 200 words per minute
        return readingTime;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Public blog viewing now works without authentication!

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
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search blog posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredBlogs.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        {searchTerm ? 'No blog posts match your search criteria' : 'No blog posts available at the moment'}
                                    </p>
                                </div>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <Link key={blog.id} href={`/blog/${blog.id}`}>
                                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                            <CardContent className="p-6 h-full flex flex-col">
                                                {/* Title */}
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h3>

                                                {/* Author and Date */}
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        {blog.author.username}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(blog.createdAt)}
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                    {blog.averageRating && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500" />
                                                            {blog.averageRating.toFixed(1)}
                                                        </div>
                                                    )}
                                                    {blog.commentCount && (
                                                        <div className="flex items-center gap-1">
                                                            <MessageSquare className="w-4 h-4" />
                                                            {blog.commentCount}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {getReadingTime(blog.content)} min read
                                                    </div>
                                                </div>

                                                {/* Content Preview */}
                                                <div className="text-gray-700 text-sm line-clamp-3 flex-1">
                                                    {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                                </div>

                                                {/* Read More Link */}
                                                <div className="mt-4">
                                                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                                                        Read more →
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    &lt;
                                </button>

                                <span className="text-sm text-gray-600 px-4">
                                    Page {currentPage + 1} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
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

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
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">{/* Added margin-top for fixed header */}
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
        </div>
    );
}
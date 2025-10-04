"use client";

import { BlogCard } from "./BlogCard";
import { VideoCard } from "./VideoCard";
import { mockBlogPosts, mockVideos } from "../types";
import { useState } from "react";
import { ClientHeader } from "../../components/ClientHeader";
import { ClientFooter } from "../../components/ClientFooter";

export function BlogList() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;
    const totalPages = Math.ceil(mockBlogPosts.length / postsPerPage);

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = mockBlogPosts.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Use shared header */}
            <ClientHeader />

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

            {/* Use shared footer */}
            <ClientFooter />
        </div>
    );
}

"use client";

import { BlogPost, mockBlogPosts } from "@/modules/client/blog/types";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
    params: {
        id: string;
    };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = mockBlogPosts.find(p => p.id === params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                                <span className="text-white font-bold text-xl">Blog</span>
                            </Link>
                        </div>

                        {/* Back Button */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-4xl font-bold mb-4">{post.title.charAt(0)}</h1>
                            <div className="flex items-center justify-center space-x-2">
                                <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                    {post.category}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {post.readTime} phút đọc
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    <span>Chia sẻ</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                    <span>Lưu</span>
                                </button>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    {post.excerpt}
                                </p>

                                <p>
                                    Đây là nội dung chi tiết của bài viết. Bài viết này cung cấp những thông tin hữu ích và
                                    những lời khuyên thực tế mà bạn có thể áp dụng ngay vào công việc và sự nghiệp của mình.
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Những điểm quan trọng</h2>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Tập trung vào việc áp dụng thực tế các khái niệm đã thảo luận</li>
                                    <li>Dành thời gian để thực hành và triển khai các chiến lược</li>
                                    <li>Luôn cập nhật với những xu hướng và phát triển mới nhất</li>
                                    <li>Kết nối với các chuyên gia trong lĩnh vực của bạn</li>
                                </ul>

                                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kết luận</h2>
                                <p>
                                    Bằng cách làm theo những hướng dẫn này và triển khai các chiến lược được nêu trong bài viết,
                                    bạn sẽ được định vị tốt để đạt được các mục tiêu nghề nghiệp của mình. Hãy nhớ rằng thành công
                                    đến với sự nỗ lực nhất quán và học hỏi liên tục.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className="text-xl font-bold">CareerMate</span>
                        </div>
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} CareerMate. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

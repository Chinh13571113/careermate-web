"use client";

import { BlogPost } from "../types";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="mb-4">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
                    {post.title}
                </Link>
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {post.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {post.tags[0]}
                </span>
            </div>

            {/* Read More Link */}
            <div className="mt-4">
                <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                    Bắt đầu đọc ({post.readTime} phút) →
                </Link>
            </div>
        </article>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Star,
    MessageSquare,
    Calendar,
    User,
    Send,
    Share2,
    Bookmark,
    Clock,
    Eye,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import Link from 'next/link';
import { blogApi } from '@/lib/blog-api';
import { publicBlogApi } from '@/lib/public-blog-api';
import { useAuthStore } from '@/store/use-auth-store';
import { Blog, Comment, Rating, PagedResponse } from '@/types/blog';
import toast from 'react-hot-toast';

interface BlogPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const router = useRouter();
    const paramsData = React.use(params);
    const blogId = parseInt(paramsData.id);
    const { user, isAuthenticated } = useAuthStore();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [userRating, setUserRating] = useState<Rating | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        fetchBlogData();
    }, [blogId]);

    const fetchBlogData = async () => {
        try {
            setLoading(true);

            // Get blog data (public)
            let blogData = await publicBlogApi.getBlog(blogId);

            // Check for blob URLs and log warning
            if (blogData.thumbnailUrl?.startsWith('blob:')) {
                console.warn('⚠️ BLOB URL DETECTED:', {
                    blogId: blogData.id,
                    title: blogData.title,
                    thumbnailUrl: blogData.thumbnailUrl,
                    message: 'This blog has a blob URL stored as thumbnail - needs database cleanup'
                });
            }

            // If no thumbnail URL from public API, try authenticated API as fallback
            if (!blogData.thumbnailUrl) {
                try {
                    const authBlogData = await blogApi.getBlog(blogId);
                    if (authBlogData.thumbnailUrl) {
                        blogData = { ...blogData, thumbnailUrl: authBlogData.thumbnailUrl };
                    }
                } catch (authError) {
                    // Silently fail - public API is primary
                }
            }

            // Try to get comments (may require authentication)
            let commentsData: PagedResponse<Comment> = {
                content: [],
                pageable: {
                    sort: { sorted: false, unsorted: true, empty: true },
                    offset: 0,
                    pageNumber: 0,
                    pageSize: 50,
                    paged: true,
                    unpaged: false
                },
                last: true,
                totalPages: 0,
                totalElements: 0,
                size: 50,
                number: 0,
                first: true,
                numberOfElements: 0,
                empty: true,
                sort: { sorted: false, unsorted: true, empty: true }
            };
            // Get comments (API handles 401 errors gracefully)
            commentsData = await publicBlogApi.getComments(blogId, { page: 0, size: 50 });

            // Get user rating (API handles 401 errors gracefully)
            let userRatingData: Rating | null = null;
            if (isAuthenticated) {
                const ratings = await publicBlogApi.getRatings(blogId);
                userRatingData = ratings.find(r => r.userId === user?.id) || null;
            }

            setBlog(blogData);
            setComments(commentsData.content);
            setUserRating(userRatingData);
            if (userRatingData) {
                setRating(userRatingData.rating);
            }

            // Fetch related blogs
            await fetchRelatedBlogs(blogData);
        } catch (error: any) {
            console.error('❌ Error fetching blog data:', error);
            toast.error('Failed to load blog post');
            router.push('/blog');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedBlogs = async (currentBlog: Blog) => {
        try {
            // Fetch blogs with the same category or tags
            const params: any = {
                page: 0,
                size: 4,
                status: 'PUBLISHED'
            };

            // Try to get blogs with same category first
            if (currentBlog.category) {
                params.keyword = currentBlog.category;
            }

            const response = await publicBlogApi.getBlogs(params);
            const allBlogs = response.content || [];

            // Filter out the current blog and get up to 4 related blogs
            const related = allBlogs
                .filter(b => b.id !== currentBlog.id)
                .slice(0, 4);

            setRelatedBlogs(related);
        } catch (error) {
            console.error('Error fetching related blogs:', error);
            // Don't show error to user, just leave related blogs empty
        }
    };

    const handleCommentSubmit = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to comment');
            return;
        }

        if (!newComment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setSubmittingComment(true);
        try {
            // This would require authentication - for now just show a message
            toast.success('Comment submitted! (Authentication required for actual submission)');
            setNewComment('');
        } catch (error: any) {
            console.error('Error submitting comment:', error);
            toast.error('Failed to submit comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleRatingSubmit = async (newRating: number) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to rate');
            return;
        }

        setSubmittingRating(true);
        try {
            // This would require authentication - for now just show a message
            toast.success(`Rating submitted: ${newRating} stars! (Authentication required for actual submission)`);
            setRating(newRating);
        } catch (error: any) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating');
        } finally {
            setSubmittingRating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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

                {/* Loading Content */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!blog) {
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

                {/* Error Content */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
                        <Link href="/blog">
                            <Button>Back to Blog</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

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
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                    {/* Left Column - Blog Post */}
                    <div className="lg:col-span-5">
                        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Back Button */}
                            <div className="p-6 border-b border-gray-200">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Blog
                                </Link>
                            </div>

                            {/* Header */}
                            <div className="p-6 border-b border-gray-200">
                                {/* Title */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    {blog.title}
                                </h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{blog.author.username}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(blog.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{getReadingTime(blog.content)} min read</span>
                                    </div>
                                    {blog.viewCount && (
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{blog.viewCount} views</span>
                                        </div>
                                    )}
                                </div>

                                {/* Category and Tags */}
                                <div className="flex items-center gap-4 mb-6">
                                    {blog.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {blog.category}
                                        </span>
                                    )}
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Summary */}
                                {blog.summary && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-700 italic">"{blog.summary}"</p>
                                    </div>
                                )}

                                {/* Thumbnail */}
                                {blog.thumbnailUrl && !blog.thumbnailUrl.startsWith('blob:') && (
                                    <div className="mb-6">
                                        <img
                                            src={blog.thumbnailUrl}
                                            alt={blog.title}
                                            className="w-full h-64 object-cover rounded-lg"
                                            onError={(e) => {
                                                // Hide the image element on error
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                {(!blog.thumbnailUrl || blog.thumbnailUrl.startsWith('blob:')) && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-sm">
                                                    {blog.title.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-blue-800 text-sm font-medium">
                                                    {blog.thumbnailUrl?.startsWith('blob:')
                                                        ? 'Thumbnail image is being processed...'
                                                        : 'No thumbnail available for this blog post'
                                                    }
                                                </p>
                                                <p className="text-blue-600 text-xs">
                                                    {blog.thumbnailUrl?.startsWith('blob:')
                                                        ? 'Please refresh the page or contact support if this persists.'
                                                        : 'The author may add a thumbnail later.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="prose prose-lg max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Rating */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Rate this post:</span>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleRatingSubmit(star)}
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(0)}
                                                        disabled={submittingRating}
                                                        className={`w-5 h-5 transition-colors ${star <= (hoveredRating || rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                            } hover:text-yellow-400 disabled:opacity-50`}
                                                    >
                                                        <Star className="w-full h-full fill-current" />
                                                    </button>
                                                ))}
                                                {blog.averageRating && (
                                                    <span className="text-sm text-gray-600 ml-2">
                                                        ({blog.averageRating.toFixed(1)} avg)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Bookmark className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Comments Section */}
                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Comments ({comments.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Comment Form */}
                                    {isAuthenticated ? (
                                        <div className="space-y-4">
                                            <Textarea
                                                placeholder="Write your comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                rows={3}
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleCommentSubmit}
                                                    disabled={submittingComment || !newComment.trim()}
                                                >
                                                    {submittingComment ? 'Submitting...' : 'Submit Comment'}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-600 mb-2">Sign in to leave a comment</p>
                                            <div className="flex gap-2 justify-center">
                                                <Link href="/sign-in">
                                                    <Button variant="outline" size="sm">Sign In</Button>
                                                </Link>
                                                <Link href="/sign-up">
                                                    <Button size="sm">Sign Up</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                        {comments.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="border-l-4 border-gray-200 pl-4 py-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-medium text-gray-900">{comment.user.username}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">{comment.content}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - Related Content */}
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            {/* Author Info - Made Larger */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">About the Author</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                                            <User className="w-10 h-10 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{blog.author.username}</h3>
                                            <p className="text-sm text-gray-600">Content Creator</p>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200">
                                            <p className="text-sm text-gray-500">
                                                {blog.category === 'Technology'
                                                    ? 'Tech enthusiast sharing insights on modern development and innovation.'
                                                    : blog.category === 'Career'
                                                        ? 'Career expert helping professionals navigate their growth journey.'
                                                        : 'Experienced writer sharing valuable insights and practical advice.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Articles - Simple Clean Design */}
                            {relatedBlogs.length > 0 && (
                                <Card className="hidden lg:block">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold">Related Articles</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-0">
                                        {relatedBlogs.map((relatedBlog, index) => (
                                            <div key={relatedBlog.id}>
                                                <Link
                                                    href={`/blog/${relatedBlog.id}`}
                                                    className="block py-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors leading-relaxed">
                                                        {relatedBlog.title}
                                                    </h4>
                                                </Link>
                                                {index < relatedBlogs.length - 1 && (
                                                    <div className="border-b border-gray-200"></div>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
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
                                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Privacy Policy
                                </a>
                                <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Terms of Service
                                </a>
                                <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
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
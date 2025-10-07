// Database Cleanup Utility for Blob URLs
// This script helps identify and clean up blob URLs stored in the database

import { blogApi } from '@/lib/blog-api';

interface BlobUrlBlog {
    id: number;
    title: string;
    thumbnailUrl: string;
}

class BlobUrlCleanup {
    private blobUrlBlogs: BlobUrlBlog[] = [];

    async identifyBlobUrls(): Promise<BlobUrlBlog[]> {
        console.log('🔍 Scanning for blogs with blob URLs...');

        try {
            // Get all blogs
            const response = await blogApi.getBlogs({
                page: 0,
                size: 1000, // Get a large number to scan all blogs
                sort: 'createdAt,desc'
            });

            const blogs = response.content || [];
            const blobUrlBlogs: BlobUrlBlog[] = [];

            blogs.forEach(blog => {
                if (blog.thumbnailUrl?.startsWith('blob:')) {
                    blobUrlBlogs.push({
                        id: blog.id,
                        title: blog.title,
                        thumbnailUrl: blog.thumbnailUrl
                    });
                }
            });

            this.blobUrlBlogs = blobUrlBlogs;

            console.log(`📊 Found ${blobUrlBlogs.length} blogs with blob URLs:`);
            blobUrlBlogs.forEach(blog => {
                console.log(`  - ID: ${blog.id}, Title: "${blog.title}"`);
                console.log(`    Blob URL: ${blog.thumbnailUrl}`);
            });

            return blobUrlBlogs;
        } catch (error) {
            console.error('❌ Error scanning for blob URLs:', error);
            return [];
        }
    }

    async cleanupBlobUrls(): Promise<void> {
        if (this.blobUrlBlogs.length === 0) {
            console.log('ℹ️ No blob URLs found to clean up');
            return;
        }

        console.log(`🧹 Starting cleanup of ${this.blobUrlBlogs.length} blogs with blob URLs...`);

        for (const blog of this.blobUrlBlogs) {
            try {
                console.log(`🔄 Cleaning up blog ID ${blog.id}: "${blog.title}"`);

                // Update the blog to remove the blob URL
                await blogApi.updateBlog(blog.id, {
                    title: blog.title,
                    content: '', // This will be fetched from existing blog
                    summary: '',
                    thumbnailUrl: '', // Clear the blob URL
                    category: '',
                    tags: [],
                    status: 'PUBLISHED' as any
                });

                console.log(`✅ Successfully cleaned up blog ID ${blog.id}`);
            } catch (error) {
                console.error(`❌ Failed to clean up blog ID ${blog.id}:`, error);
            }
        }

        console.log('🎉 Blob URL cleanup completed!');
    }

    generateReport(): void {
        console.log('\n📋 BLOB URL CLEANUP REPORT');
        console.log('========================');
        console.log(`Total blogs with blob URLs: ${this.blobUrlBlogs.length}`);

        if (this.blobUrlBlogs.length > 0) {
            console.log('\nAffected blogs:');
            this.blobUrlBlogs.forEach((blog, index) => {
                console.log(`${index + 1}. ID: ${blog.id}`);
                console.log(`   Title: "${blog.title}"`);
                console.log(`   Blob URL: ${blog.thumbnailUrl}`);
                console.log('');
            });
        }
    }
}

// Usage instructions
console.log(`
🧹 BLOB URL CLEANUP UTILITY
==========================

This utility helps identify and clean up blob URLs stored in the database.

Usage:
1. Run identifyBlobUrls() to scan for blogs with blob URLs
2. Run cleanupBlobUrls() to remove blob URLs from affected blogs
3. Run generateReport() to see a summary

Example:
const cleanup = new BlobUrlCleanup();
await cleanup.identifyBlobUrls();
cleanup.generateReport();
await cleanup.cleanupBlobUrls();
`);

export { BlobUrlCleanup };

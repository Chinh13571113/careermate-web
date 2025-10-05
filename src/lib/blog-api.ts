import api from './api';
import { fileUploadApi } from './file-upload-api';
import type {
    BlogResponse,
    BlogRequest,
    BlogCreateRequest,
    BlogUpdateRequest,
    ApiResponse,
    PagedResponse,
    BlogPaginationParams,
    Comment,
    CommentCreateRequest,
    CommentUpdateRequest,
    Rating,
    RatingCreateRequest,
    CommentPaginationParams,
    ImageUploadResponse,
    BlogStatus
} from '@/types/blog';

class BlogApiService {
    /**
     * Extract all Cloudinary publicIds from blog content and thumbnail
     */
    private async extractAndDeleteImages(blog: BlogResponse): Promise<void> {
        const imageIds: string[] = [];

        // Extract from thumbnail URL
        if (blog.thumbnailUrl && blog.thumbnailUrl.includes('cloudinary.com')) {
            const thumbnailMatch = blog.thumbnailUrl.match(/\/upload\/[^\/]+\/([^.]+\.\w+)$/);
            if (thumbnailMatch) {
                imageIds.push(thumbnailMatch[1]);
            }
        }

        // Extract from content (find all managed-image divs)
        if (blog.content) {
            const contentImageMatches = blog.content.match(/data-image-url="([^"]+)"/g);
            if (contentImageMatches) {
                contentImageMatches.forEach(match => {
                    const urlMatch = match.match(/data-image-url="([^"]+)"/);
                    if (urlMatch) {
                        const imageUrl = urlMatch[1];
                        if (imageUrl.includes('cloudinary.com')) {
                            const publicIdMatch = imageUrl.match(/\/upload\/[^\/]+\/([^.]+\.\w+)$/);
                            if (publicIdMatch) {
                                imageIds.push(publicIdMatch[1]);
                            }
                        }
                    }
                });
            }
        }

        // Delete all found images from Cloudinary
        if (imageIds.length > 0) {
            console.log(`🗑️ Found ${imageIds.length} images to delete from Cloudinary:`, imageIds);

            const deletePromises = imageIds.map(async (publicId) => {
                try {
                    await fileUploadApi.deleteImage(publicId);
                    console.log(`✅ Deleted Cloudinary image: ${publicId}`);
                } catch (error: any) {
                    console.warn(`⚠️ Failed to delete Cloudinary image ${publicId}:`, error.message);
                    // Don't throw - continue with other deletions
                }
            });

            await Promise.all(deletePromises);
            console.log('✅ All blog images deleted from Cloudinary');
        } else {
            console.log('📝 No images found in blog content');
        }
    }
    // Admin Blog Management

    async createBlog(data: BlogCreateRequest): Promise<BlogResponse> {
        console.log('📝 Creating blog with data:', data);
        const response = await api.post<ApiResponse<BlogResponse>>('/blogs', data);
        console.log('📝 Blog creation response:', response.data);
        console.log('📝 Response structure:', {
            hasCode: 'code' in response.data,
            hasResult: 'result' in response.data,
            hasMessage: 'message' in response.data,
            codeValue: response.data.code,
            responseKeys: Object.keys(response.data)
        });

        // Handle different response formats
        const responseData = response.data;

        // Check if it's an error response
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog creation error:', responseData);
            throw new Error(responseData.message || 'Blog creation failed');
        }

        // Try to extract blog data from different possible formats
        if (responseData.result) {
            return responseData.result;
        }

        // If response is directly the blog object (success case)
        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        // If we get here, something is really wrong
        console.error('📝 Unexpected response format:', responseData);
        throw new Error('Unexpected response format from server');
    }

    async updateBlog(blogId: number, data: BlogUpdateRequest): Promise<BlogResponse> {
        console.log('📝 API updateBlog called with:', { blogId, data });
        console.log('📝 Data being sent includes status:', data.status);
        console.log('📝 Data being sent includes title:', data.title);
        console.log('📝 Complete request payload:', JSON.stringify(data, null, 2));

        const response = await api.put<ApiResponse<BlogResponse>>(`/blogs/${blogId}`, data);
        console.log('📝 API updateBlog response:', response.data);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog update error:', responseData);
            throw new Error(responseData.message || 'Failed to update blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async deleteBlog(blogId: number): Promise<void> {
        console.log('🗑️ Deleting blog with ID:', blogId);

        try {
            // First fetch the blog to extract image URLs before deletion
            console.log('🔍 Fetching blog data for image cleanup...');
            const blogData = await this.getBlog(blogId);

            // Clean up all images from Cloudinary before deleting blog
            await this.extractAndDeleteImages(blogData);

            // Now delete the blog from database
            console.log('🗑️ Deleting blog from database...');
            const response = await api.delete<ApiResponse<void>>(`/blogs/${blogId}`);
            console.log('🗑️ Blog deletion response:', response.data);

            // Handle different response formats - check for both 0 and 1000 as success codes
            const responseData = response.data;

            if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
                console.error('📝 Blog deletion error:', responseData);
                throw new Error(responseData.message || 'Failed to delete blog');
            }

            console.log('✅ Blog and all associated images deleted successfully');
        } catch (error: any) {
            console.error('❌ Error during blog deletion:', error);
            throw error;
        }
    }

    async publishBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/blogs/${blogId}/publish`);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog publish error:', responseData);
            throw new Error(responseData.message || 'Failed to publish blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async unpublishBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/blogs/${blogId}/unpublish`);
        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog unpublish error:', responseData);
            throw new Error(responseData.message || 'Failed to unpublish blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async archiveBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/blogs/${blogId}/archive`);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog archive error:', responseData);
            throw new Error(responseData.message || 'Failed to archive blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async unarchiveBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/blogs/${blogId}/unarchive`);
        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog unarchive error:', responseData);
            throw new Error(responseData.message || 'Failed to unarchive blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    // Public Blog Endpoints (No Authentication Required)

    async getBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.get<ApiResponse<BlogResponse>>(`/blogs/${blogId}`);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Get blog error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async getBlogs(params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDir = 'DESC',
            status,
            category,
            keyword
        } = params;

        let url = `/blogs?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

        if (status) url += `&status=${status}`;
        if (category) url += `&category=${category}`;
        if (keyword) url += `&keyword=${keyword}`;

        console.log('📋 Fetching blogs with URL:', url);
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);
        console.log('📋 Blogs response:', response.data);
        console.log('📋 Response structure:', {
            hasCode: 'code' in response.data,
            hasContent: 'content' in response.data,
            hasResult: 'result' in response.data,
            responseKeys: Object.keys(response.data)
        });

        const responseData = response.data;

        // Handle different response formats
        if ('content' in responseData && Array.isArray(responseData.content)) {
            // Direct pagination format (most common)
            return responseData as unknown as PagedResponse<BlogResponse>;
        }

        // Check for error response
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📋 Fetch blogs error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch blogs');
        }

        // Try wrapped result format
        if (responseData.result) {
            return responseData.result;
        }

        // Last resort - return the raw response
        console.error('📋 Unexpected blogs response format:', responseData);
        throw new Error('Unexpected response format from server');
    }

    async getBlogsByStatus(status: BlogStatus, params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10
        } = params;

        const url = `/blogs/status/${status}?page=${page}&size=${size}`;
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);
        if (response.data.code !== 1000) {
            throw new Error(response.data.message);
        }
        return response.data.result!;
    }

    async getBlogsByCategory(category: string, params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10
        } = params;

        const url = `/blogs/category/${category}?page=${page}&size=${size}`;
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);
        if (response.data.code !== 1000) {
            throw new Error(response.data.message);
        }
        return response.data.result!;
    }

    async searchBlogs(keyword: string, params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10
        } = params;

        const url = `/blogs/search?keyword=${keyword}&status=PUBLISHED&page=${page}&size=${size}`;
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);
        if (response.data.code !== 1000) {
            throw new Error(response.data.message);
        }
        return response.data.result!;
    }

    async getCategories(): Promise<string[]> {
        const response = await api.get<ApiResponse<string[]>>('/blogs/categories');
        if (response.data.code !== 1000) {
            throw new Error(response.data.message);
        }
        return response.data.result!;
    }

    // Image Upload
    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post<ApiResponse<ImageUploadResponse>>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.code !== 1000) {
            throw new Error(response.data.message);
        }
        return response.data.result!.imageUrl;
    }

    // Comment endpoints (keeping existing functionality)
    async getComments(blogId: number, params: CommentPaginationParams = {}): Promise<PagedResponse<Comment>> {
        const { page = 0, size = 20 } = params;
        const response = await api.get(`/blogs/${blogId}/comments?page=${page}&size=${size}`);
        return response.data;
    }

    async createComment(blogId: number, data: CommentCreateRequest): Promise<Comment> {
        const response = await api.post(`/blogs/${blogId}/comments`, data);
        return response.data;
    }

    async updateComment(commentId: number, data: CommentUpdateRequest): Promise<Comment> {
        const response = await api.put(`/comments/${commentId}`, data);
        return response.data;
    }

    async deleteComment(commentId: number): Promise<void> {
        await api.delete(`/comments/${commentId}`);
    }

    // Rating endpoints (keeping existing functionality)
    async getRatings(blogId: number): Promise<Rating[]> {
        const response = await api.get(`/blogs/${blogId}/ratings`);
        return response.data;
    }

    async createOrUpdateRating(blogId: number, data: RatingCreateRequest): Promise<Rating> {
        const response = await api.post(`/blogs/${blogId}/ratings`, data);
        return response.data;
    }

    async getUserRating(blogId: number): Promise<Rating | null> {
        try {
            const response = await api.get(`/blogs/${blogId}/ratings/user`);
            return response.data;
        } catch (error: any) {
            // Return null if user hasn't rated (404) or other error
            if (error.response?.status === 404) {
                console.log(`User hasn't rated blog ${blogId} yet`);
                return null;
            }
            console.log('Error fetching user rating:', error.response?.status, error.response?.data);
            return null; // Don't throw - just return null for any error
        }
    }

    async deleteRating(ratingId: number): Promise<void> {
        await api.delete(`/ratings/${ratingId}`);
    }
}

export const blogApi = new BlogApiService();
export default blogApi;

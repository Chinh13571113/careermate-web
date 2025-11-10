'use client';

import React, { useState } from 'react';
import { Upload, X, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fileUploadApi } from '@/lib/file-upload-api';
import toast from 'react-hot-toast';

interface ThumbnailUploadProps {
    value: string;
    onChange: (url: string) => void;
    className?: string;
    onThumbnailChanged?: (publicId: string | null) => void; // Callback to track abandoned thumbnails
    onFileChanged?: (file: File | null) => void; // Callback to track file for later upload
    onThumbnailDeleted?: (publicId: string | null) => void; // Callback to track deleted thumbnails
}

export default function ThumbnailUpload({ value, onChange, className = '', onThumbnailChanged, onFileChanged, onThumbnailDeleted }: ThumbnailUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [urlInput, setUrlInput] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Validate file first
            const validationError = fileUploadApi.validateImageFile(file);
            if (validationError) {
                toast.error(validationError);
                return;
            }

            // Show file size info
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            console.log(`📁 Selected file: ${file.name} (${fileSizeMB}MB)`);

            // Create local URL for preview
            const localUrl = URL.createObjectURL(file);

            // Store file for later upload and show preview
            onChange(localUrl);
            if (onFileChanged) {
                onFileChanged(file);
            }
            toast.success(`Thumbnail added (${fileSizeMB}MB) - will be uploaded when saved`);

            // Clear file input
            event.target.value = '';
        } catch (error: any) {
            console.error('File processing error:', error);
            toast.error(error.message || 'Failed to process thumbnail');
        }
    };

    const handleUrlSubmit = async () => {
        if (!urlInput.trim()) {
            toast.error('Please enter an image URL');
            return;
        }

        try {
            const processedUrl = await fileUploadApi.processImageUrl(urlInput.trim());

            // URLs are considered already uploaded
            onChange(processedUrl);
            if (onFileChanged) {
                onFileChanged(null); // Clear any stored file since we're using URL
            }
            setUrlInput('');
            toast.success('Thumbnail URL processed successfully!');
        } catch (error: any) {
            console.error('URL processing failed:', error);
            toast.error(error.message || 'Invalid image URL');
        }
    };

    const handleRemove = async () => {
        // Extract publicId if it's a Firebase image
        let publicId: string | null = null;

        if (value.includes('firebase') || value.includes('googleapis.com')) {
            // Extract Firebase storage path from URL
            // Firebase URLs typically look like: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Fimage.jpg
            const urlMatch = value.match(/\/o\/(.+)$/);
            if (urlMatch) {
                publicId = decodeURIComponent(urlMatch[1]);
                console.log('📝 Tracking deleted Firebase thumbnail for cleanup:', publicId);
            }
        }

        // Track deleted thumbnail for later cleanup (don't delete immediately)
        if (publicId && onThumbnailDeleted) {
            onThumbnailDeleted(publicId);
        }

        // Always remove from editor and clear stored file
        onChange('');
        if (onFileChanged) {
            onFileChanged(null);
        }
        if (onThumbnailChanged) {
            onThumbnailChanged(null);
        }
        toast.success('Thumbnail removed (will be deleted from Firebase when saved)');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Preview */}
            {value && (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        title="Remove thumbnail (will also delete from Firebase)"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Upload Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="space-y-2">
                    <Label htmlFor="thumbnail-file" className="text-sm font-medium flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Thumbnail
                    </Label>
                    <Input
                        id="thumbnail-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="cursor-pointer"
                    />
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                    <Label htmlFor="thumbnail-url" className="text-sm font-medium flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Or Enter URL
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="thumbnail-url"
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleUrlSubmit();
                                }
                            }}
                            disabled={uploading}
                        />
                        <Button
                            variant="outline"
                            onClick={handleUrlSubmit}
                            disabled={uploading || !urlInput.trim()}
                            size="sm"
                        >
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Help Text */}
            <p className="text-sm text-gray-500">
                Upload a thumbnail image for your blog post. Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP.
                {uploading && <span className="block mt-1 text-blue-600">Large files may take up to 60 seconds to upload...</span>}
            </p>
        </div>
    );
}

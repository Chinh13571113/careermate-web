'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Link, Image as ImageIcon, X } from 'lucide-react';
import { fileUploadApi } from '@/lib/file-upload-api';
import toast from 'react-hot-toast';

interface ImageSelectionResult {
    imageUrl: string;
    publicId?: string;
}

interface ImageUploadDialogProps {
    children?: React.ReactNode;
    onImageSelect: (result: ImageSelectionResult) => void;
    disabled?: boolean;
}

export default function ImageUploadDialog({
    children,
    onImageSelect,
    disabled = false
}: ImageUploadDialogProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [url, setUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [urlPreview, setUrlPreview] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // Validate file
            const validationError = fileUploadApi.validateImageFile(file);
            if (validationError) {
                toast.error(validationError);
                return;
            }

            // Upload to Cloudinary
            const imageUrl = await fileUploadApi.uploadImage(file);

            // Get the publicId from the response (we need to modify fileUploadApi to return it)
            // For now, we'll extract it from the URL pattern
            const publicIdMatch = imageUrl.match(/\/upload\/[^\/]+\/([^.]+\.\w+)$/);
            const publicId = publicIdMatch ? publicIdMatch[1] : undefined;

            onImageSelect({ imageUrl, publicId });
            setOpen(false);
            toast.success('Image uploaded successfully!');

        } catch (error: any) {
            console.error('Upload error:', error);

            if (error.message?.includes('log in')) {
                toast.error(error.message + ' Please refresh the page after logging in.');
            } else if (error.message?.includes('Admin privileges')) {
                toast.error(error.message + ' Only admin users can upload images.');
            } else {
                toast.error(error.message || 'Failed to upload image. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = async () => {
        if (!url.trim()) {
            toast.error('Please enter an image URL');
            return;
        }

        try {
            setUploading(true);

            // Validate and process URL
            const processedUrl = await fileUploadApi.processImageUrl(url.trim());

            // Extract publicId if it's a Cloudinary URL
            const publicIdMatch = processedUrl.match(/\/upload\/[^\/]+\/([^.]+\.\w+)$/);
            const publicId = publicIdMatch ? publicIdMatch[1] : undefined;

            onImageSelect({ imageUrl: processedUrl, publicId });
            setOpen(false);
            setUrl('');
            toast.success('Image URL processed successfully!');

        } catch (error: any) {
            console.error('URL processing error:', error);
            toast.error(error.message || 'Invalid image URL. Please check and try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (value: string) => {
        setUrl(value);
        // Show preview for valid URLs
        if (value.trim() && fileUploadApi.isValidImageUrl(value.trim())) {
            setUrlPreview(value.trim());
        } else {
            setUrlPreview('');
        }
    };

    const resetForm = () => {
        setUrl('');
        setUrlPreview('');
        setMode('upload');
    };

    return (
        <Dialog open={open} onOpenChange={(open: boolean) => {
            setOpen(open);
            if (!open) resetForm();
        }}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm" disabled={disabled} className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100">
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Mode Selection */}
                    <div className="flex space-x-2">
                        <Button
                            variant={mode === 'upload' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode('upload')}
                            disabled={uploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                        </Button>
                        <Button
                            variant={mode === 'url' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode('url')}
                            disabled={uploading}
                        >
                            <Link className="h-4 w-4 mr-2" />
                            URL
                        </Button>
                    </div>

                    {/* File Upload Mode */}
                    {mode === 'upload' && (
                        <div className="space-y-2">
                            <Label>Select Image File</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-gray-500">
                                Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                            </p>
                        </div>
                    )}

                    {/* URL Mode */}
                    {mode === 'url' && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                    id="image-url"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={url}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                    disabled={uploading}
                                />
                            </div>

                            {/* URL Preview */}
                            {urlPreview && (
                                <div className="space-y-2">
                                    <Label>Preview:</Label>
                                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                                        <img
                                            src={urlPreview}
                                            alt="URL preview"
                                            className="w-full h-32 max-h-48 object-cover"
                                            onError={() => setUrlPreview('')}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleUrlSubmit}
                                disabled={uploading || !url.trim()}
                                className="w-full"
                            >
                                {uploading ? 'Processing...' : 'Add Image'}
                            </Button>
                        </div>
                    )}

                    {/* Loading State */}
                    {uploading && (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            <span className="ml-2 text-sm text-gray-600">
                                {mode === 'upload' ? 'Uploading...' : 'Processing URL...'}
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

import React from 'react';
import BlogEditor from '@/modules/admin/blog/components/BlogEditor';

interface EditBlogPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
    const resolvedParams = React.use(params);
    const blogId = parseInt(resolvedParams.id);
    return <BlogEditor blogId={blogId} isEdit={true} />;
}
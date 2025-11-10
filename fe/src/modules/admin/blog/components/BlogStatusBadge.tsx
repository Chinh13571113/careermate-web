'use client';

import { Badge } from '@/components/ui/badge';
import { BlogStatus } from '@/types/blog';

interface BlogStatusBadgeProps {
    status: BlogStatus;
}

export default function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
    const variants = {
        DRAFT: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
        },
        PUBLISHED: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-200',
        },
        ARCHIVED: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200',
        },
    };

    const variant = variants[status];

    return (
        <Badge
            className={`${variant.bg} ${variant.text} ${variant.border} border capitalize`}
        >
            {status.toLowerCase()}
        </Badge>
    );
}

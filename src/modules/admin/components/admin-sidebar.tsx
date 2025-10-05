"use client";

import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    BookOpen,
    Users,
    Settings
} from 'lucide-react';

interface NavItem {
    title: string;
    url: string;
    icon: string;
}

interface AdminSidebarProps {
    navItems: NavItem[];
    className?: string;
}

const iconMap = {
    BarChart3,
    BookOpen,
    Users,
    Settings,
};

export function AdminSidebar({ navItems, className }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn("w-64 bg-white shadow-lg", className)}>
            <div className="p-6">
                <Link href="/" className="text-xl font-bold text-gray-900">
                    CareerMate Admin
                </Link>
            </div>

            <nav className="px-3">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                        const isActive = pathname === item.url ||
                            (item.url !== '/admin' && pathname.startsWith(item.url + '/'));

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <IconComponent className="w-5 h-5 mr-3" />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

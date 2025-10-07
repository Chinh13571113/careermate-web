"use client";

import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    BookOpen,
    Users,
    Settings,
    LogOut,
    User
} from 'lucide-react';
import { useAuthStore } from "@/store/use-auth-store";
import { decodeJWT } from "@/lib/auth-admin";
import toast from "react-hot-toast";

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
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const { isAuthenticated, accessToken, logout } = useAuthStore();

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Get user info from token
    const getUserInfo = () => {
        if (!accessToken) return null;
        try {
            const decoded = decodeJWT(accessToken);
            return {
                email: decoded?.sub || decoded?.email || 'Admin',
                name: decoded?.name || decoded?.sub || 'Admin'
            };
        } catch (error) {
            return null;
        }
    };

    const userInfo = getUserInfo();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");
            router.push('/');
        } catch (error) {
            toast.error("Failed to logout");
            console.error("Logout error:", error);
        }
    };

    return (
        <div className={cn("w-64 bg-white shadow-lg flex flex-col", className)}>
            <div className="p-6">
                <Link href="/" className="text-xl font-bold text-gray-900">
                    CareerMate Admin
                </Link>
            </div>

            <nav className="px-3 flex-1">
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

            {/* User Info and Logout */}
            {isHydrated && isAuthenticated && userInfo && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {userInfo.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {userInfo.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

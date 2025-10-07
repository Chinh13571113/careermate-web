'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminCheck } from '@/lib/auth-admin';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react';

interface AdminAuthGuardProps {
    children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
    const { isAuthenticated, isAdmin } = useAdminCheck();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        // Check authentication status when component mounts
        if (!isAuthenticated || !isAdmin) {
            console.log('Admin access denied:', { isAuthenticated, isAdmin });
        }
    }, [isAuthenticated, isAdmin]);

    // Show loading state while hydrating
    if (!isHydrated) {
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center">
                <div className="text-center">
                    <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show access denied if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-red-800 mb-2">
                            Admin Access Required
                        </h2>
                        <p className="text-red-600 mb-6">
                            You must be logged in as an administrator to access this section.
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push('/sign-in')}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/')}
                                className="w-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-500">
                        <details>
                            <summary className="cursor-pointer">Debug Info</summary>
                            <div className="mt-2 text-left bg-gray-100 p-3 rounded">
                                <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
                                <p><strong>Admin Role:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</p>
                                <p><strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('access_token') ? '✅ Present' : '❌ Missing'}</p>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        );
    }

    // Render children if authenticated and admin
    return <>{children}</>;
}
'use client'

import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoaderCircle } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode
  mode: 'auth' | 'guest'  // 'auth' for protected routes, 'guest' for non-authenticated only routes
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  mode = 'auth',
  redirectTo = mode === 'auth' ? '/sign-in' : '/'
}: AuthGuardProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  const router = useRouter()
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Safely import and initialize
        const apiModule = await import('@/lib/api').catch(e => {
          console.debug("Could not import api module:", e?.message);
          return { initializeAuth: () => Promise.resolve(false) };
        });
        
        const { initializeAuth } = apiModule;
        let success = false;
        
        try {
          success = await initializeAuth();
          console.debug(`Auth initialization ${success ? 'successful' : 'failed'}`);
        } catch (initError: any) {
          // Just log the error without throwing
          console.debug("Auth initialization error:", initError?.message || "Unknown error");
        }
      } catch (error) {
        console.debug("Error in auth initialization process");
      }
    };
    
    initAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    if (mode === 'auth' && !isAuthenticated) {
      router.replace(redirectTo); // Redirect to login if not authenticated
    } else if (mode === 'guest' && isAuthenticated) {
      router.replace(redirectTo); // Redirect to home if authenticated
    }
  }, [isLoading, isAuthenticated, mode, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="size-16 animate-spin text-green-600" />
      </div>
    );
  }

  // For guest routes, we only render if not authenticated
  if (mode === 'guest' && isAuthenticated) {
    return null;
  }

  // For protected routes, we only render if authenticated
  if (mode === 'auth' && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

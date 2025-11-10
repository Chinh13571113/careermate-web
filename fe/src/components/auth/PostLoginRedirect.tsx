"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { getDefaultRedirectPath, getRoleCategory } from "@/lib/role-utils";

// Component to handle post-login redirects
export function usePostLoginRedirect() {
  const router = useRouter();
  const { isAuthenticated, user, role } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    console.log("🟡 [REDIRECT] PostLoginRedirect effect triggered");
    console.log("🟡 [REDIRECT] isAuthenticated:", isAuthenticated);
    console.log("🟡 [REDIRECT] user:", user);
    console.log("🟡 [REDIRECT] role:", role);
    console.log("🟡 [REDIRECT] hasChecked:", hasChecked);

    // Only check once per mount
    if (hasChecked) {
      console.log("🟡 [REDIRECT] Already checked, skipping");
      return;
    }

    if (isAuthenticated && role) {
      console.log("🟡 [REDIRECT] User is authenticated, checking role...");
      
      const roleCategory = getRoleCategory(role);
      const redirectPath = getDefaultRedirectPath(role);
      
      console.log("🟡 [REDIRECT] Role category:", roleCategory);
      console.log("🟡 [REDIRECT] Redirect path:", redirectPath);

      if (roleCategory) {
        console.log(`🟢 [REDIRECT] ${roleCategory} detected! Redirecting to ${redirectPath}...`);

        // Use setTimeout to ensure state updates are complete
        setTimeout(() => {
          console.log("🟢 [REDIRECT] Executing redirect...");
          console.log("🟢 [REDIRECT] Current URL:", window.location.href);

          // Try Next.js router first
          router.push(redirectPath);

          // Fallback to window.location after delay
          setTimeout(() => {
            if (!window.location.pathname.includes(redirectPath)) {
              console.log(
                "🟢 [REDIRECT] Router push failed, using window.location"
              );
              window.location.href = redirectPath;
            }
          }, 500);
        }, 200);
      } else {
        console.log("🟡 [REDIRECT] Regular user, staying on current page");
      }

      setHasChecked(true);
    } else {
      console.log("🟡 [REDIRECT] Not authenticated or no role yet");

      // Check JWT as fallback (decode role from access_token)
      if (isAuthenticated) {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            let tokenRole = null;
            
            if (payload.scope) {
              tokenRole = typeof payload.scope === 'string' 
                ? payload.scope.split(' ')[0] 
                : payload.scope;
            } else if (Array.isArray(payload.roles)) {
              tokenRole = payload.roles[0];
            }
            
            console.log("🟡 [REDIRECT] Role from JWT:", tokenRole);

            if (tokenRole) {
              const roleCategory = getRoleCategory(tokenRole);
              const redirectPath = getDefaultRedirectPath(tokenRole);
              
              console.log(
                `🟢 [REDIRECT] ${roleCategory} role found in JWT, redirecting to ${redirectPath}...`
              );
              setTimeout(() => {
                router.push(redirectPath);
              }, 200);
              setHasChecked(true);
            }
          } catch (e) {
            console.log("🟡 [REDIRECT] Could not decode JWT");
          }
        }
      }
    }
  }, [isAuthenticated, user, role, hasChecked, router]);

  return null;
}

// Hook version for use in components
export const PostLoginRedirect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  usePostLoginRedirect();
  return <>{children}</>;
};

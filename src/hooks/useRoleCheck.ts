/**
 * Role Check Hooks
 * Custom hooks để check role trong components
 */

"use client";

import { useAuthStore } from '@/store/use-auth-store';
import { isAdmin, isRecruiter, isCandidate, canAccessAdmin, canAccessRecruiter, getRoleCategory, type RoleCategory } from '@/lib/role-utils';
import { hasAnyRole } from '@/lib/role-utils';

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin(): boolean {
  const role = useAuthStore((s) => s.role);
  return isAdmin(role);
}

/**
 * Hook to check if current user is recruiter
 */
export function useIsRecruiter(): boolean {
  const role = useAuthStore((s) => s.role);
  return isRecruiter(role);
}

/**
 * Hook to check if current user is candidate
 */
export function useIsCandidate(): boolean {
  const role = useAuthStore((s) => s.role);
  return isCandidate(role);
}

/**
 * Hook to check if current user can access admin panel
 */
export function useCanAccessAdmin(): boolean {
  const role = useAuthStore((s) => s.role);
  return canAccessAdmin(role);
}

/**
 * Hook to check if current user can access recruiter panel
 */
export function useCanAccessRecruiter(): boolean {
  const role = useAuthStore((s) => s.role);
  return canAccessRecruiter(role);
}

/**
 * Hook to get current user's role category
 */
export function useRoleCategory(): RoleCategory | null {
  const role = useAuthStore((s) => s.role);
  return getRoleCategory(role);
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(allowedRoles: RoleCategory[]): boolean {
  const role = useAuthStore((s) => s.role);
  return hasAnyRole(role, allowedRoles);
}

/**
 * Hook to get all role information
 */
export function useRoleInfo() {
  const role = useAuthStore((s) => s.role);
  
  return {
    role,
    isAdmin: isAdmin(role),
    isRecruiter: isRecruiter(role),
    isCandidate: isCandidate(role),
    canAccessAdmin: canAccessAdmin(role),
    canAccessRecruiter: canAccessRecruiter(role),
    roleCategory: getRoleCategory(role),
  };
}

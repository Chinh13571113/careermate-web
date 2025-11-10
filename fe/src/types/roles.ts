/**
 * Role Types & Constants
 * Định nghĩa các role trong hệ thống
 */

export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  RECRUITER: 'ROLE_RECRUITER',
  CANDIDATE: 'ROLE_CANDIDATE',
  USER: 'ROLE_USER', // Alias for CANDIDATE
} as const;

// Alternative role names (for backward compatibility)
export const ROLE_ALIASES = {
  ADMIN: ['ADMIN', 'ROLE_ADMIN', 'SUPERADMIN', 'ROLE_SUPERADMIN'],
  RECRUITER: ['RECRUITER', 'ROLE_RECRUITER', 'EMPLOYER', 'ROLE_EMPLOYER'],
  CANDIDATE: ['CANDIDATE', 'ROLE_CANDIDATE', 'USER', 'ROLE_USER', 'CLIENT', 'ROLE_CLIENT'],
} as const;

export type RoleType = typeof USER_ROLES[keyof typeof USER_ROLES];
export type RoleCategory = 'ADMIN' | 'RECRUITER' | 'CANDIDATE';

/**
 * Check if a role belongs to a category
 */
export function isRoleInCategory(role: string | null | undefined, category: RoleCategory): boolean {
  if (!role) return false;
  
  const normalizedRole = role.toUpperCase();
  return ROLE_ALIASES[category].some(alias => 
    normalizedRole === alias.toUpperCase()
  );
}

/**
 * Normalize role to standard format
 */
export function normalizeRole(role: string | null | undefined): RoleType | null {
  if (!role) return null;
  
  const normalizedRole = role.toUpperCase();
  
  if (ROLE_ALIASES.ADMIN.some(alias => normalizedRole === alias.toUpperCase())) {
    return USER_ROLES.ADMIN;
  }
  
  if (ROLE_ALIASES.RECRUITER.some(alias => normalizedRole === alias.toUpperCase())) {
    return USER_ROLES.RECRUITER;
  }
  
  if (ROLE_ALIASES.CANDIDATE.some(alias => normalizedRole === alias.toUpperCase())) {
    return USER_ROLES.CANDIDATE;
  }
  
  return null;
}

/**
 * Get user role category
 */
export function getRoleCategory(role: string | null | undefined): RoleCategory | null {
  if (!role) return null;
  
  if (isRoleInCategory(role, 'ADMIN')) return 'ADMIN';
  if (isRoleInCategory(role, 'RECRUITER')) return 'RECRUITER';
  if (isRoleInCategory(role, 'CANDIDATE')) return 'CANDIDATE';
  
  return null;
}

/**
 * Role hierarchy (for permission checking)
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY: Record<RoleType, number> = {
  [USER_ROLES.ADMIN]: 3,
  [USER_ROLES.RECRUITER]: 2,
  [USER_ROLES.CANDIDATE]: 1,
  [USER_ROLES.USER]: 1, // Same as CANDIDATE
} as const;

/**
 * Check if user has minimum required role
 */
export function hasMinimumRole(userRole: string | null | undefined, requiredRole: RoleType): boolean {
  const normalizedUserRole = normalizeRole(userRole);
  if (!normalizedUserRole) return false;
  
  const userLevel = ROLE_HIERARCHY[normalizedUserRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

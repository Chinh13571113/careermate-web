import { useAuthStore } from '@/store/use-auth-store';

export const ADMIN_ROLES = ['ROLE_ADMIN', 'ADMIN'];

// Function to decode JWT token
export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

// Check if user has admin role from multiple sources
export const checkAdminRole = (): boolean => {
  try {
    // Method 1: Check from auth store
    const { accessToken, role, isAuthenticated } = useAuthStore.getState();
    
    console.log('🔍 [ADMIN_CHECK] Checking admin role...');
    console.log('🔍 [ADMIN_CHECK] Store state:', { 
      isAuthenticated, 
      role, 
      hasToken: !!accessToken 
    });
    
    if (!isAuthenticated || !accessToken) {
      console.log('🔍 [ADMIN_CHECK] Not authenticated');
      return false;
    }

    // Development bypass - if we have any authentication, allow admin access for debugging
    if (process.env.NODE_ENV === 'development' && isAuthenticated) {
      console.log('🔍 [ADMIN_CHECK] Development mode - allowing admin access for authenticated user');
      return true;
    }

    // Method 2: Check stored role directly
    if (role && ADMIN_ROLES.includes(role)) {
      console.log('🔍 [ADMIN_CHECK] Admin role found in store:', role);
      return true;
    }

    // Method 3: Decode token and check scope/roles
    try {
      const decoded = decodeJWT(accessToken);
      console.log('🔍 [ADMIN_CHECK] Decoded token:', decoded);
      
      if (decoded?.scope) {
        // Handle scope as string or array
        let scopes = [];
        if (typeof decoded.scope === 'string') {
          scopes = decoded.scope.split(' ');
        } else if (Array.isArray(decoded.scope)) {
          scopes = decoded.scope;
        } else {
          scopes = [decoded.scope];
        }
        
        console.log('🔍 [ADMIN_CHECK] Token scopes:', scopes);
        
        const hasAdminScope = ADMIN_ROLES.some(adminRole => scopes.includes(adminRole));
        if (hasAdminScope) {
          console.log('🔍 [ADMIN_CHECK] Admin role found in token scope');
          return true;
        }
      }
      
      // Check roles field in token
      const tokenRoles = decoded?.roles || [];
      console.log('🔍 [ADMIN_CHECK] Token roles field:', tokenRoles);
      
      const hasAdminRole = ADMIN_ROLES.some(adminRole => tokenRoles.includes(adminRole));
      if (hasAdminRole) {
        console.log('🔍 [ADMIN_CHECK] Admin role found in token roles');
        return true;
      }
      
    } catch (tokenError) {
      console.error('🔍 [ADMIN_CHECK] Error decoding token:', tokenError);
    }
    
    console.log('🔍 [ADMIN_CHECK] No admin role found');
    return false;
    
  } catch (error) {
    console.error('🔍 [ADMIN_CHECK] Error in admin check:', error);
    return false;
  }
};

// Hook for components to use
export const useAdminCheck = () => {
  const { accessToken, isAuthenticated } = useAuthStore();
  
  return {
    isAuthenticated,
    isAdmin: checkAdminRole(),
    accessToken: !!accessToken
  };
};

// For server-side or utility usage
export const requireAdmin = () => {
  const isAdmin = checkAdminRole();
  if (!isAdmin) {
    throw new Error('Admin access required');
  }
  return true;
};
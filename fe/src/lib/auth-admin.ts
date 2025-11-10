import { useAuthStore } from '@/store/use-auth-store';

export const ADMIN_ROLES = ['ROLE_ADMIN', 'ADMIN'];

export const useAdminCheck = () => {
    const { accessToken, isAuthenticated } = useAuthStore();

    const isAdmin = () => {
        if (!accessToken || !isAuthenticated) {
            console.log('🔍 Admin check failed: No token or not authenticated');
            console.log('🔍 accessToken:', !!accessToken);
            console.log('🔍 isAuthenticated:', isAuthenticated);
            return false;
        }

        try {
            const decoded = decodeJWT(accessToken);
            console.log('🔍 Decoded token for admin check:', decoded);
            
            // Check scope field first (which contains roles like "ROLE_ADMIN" or "ROLE_ADMIN PERMISSION1 PERMISSION2")
            if (decoded?.scope) {
                console.log('🔍 Token scope (raw):', decoded.scope);
                
                // Handle both single role and space-separated roles
                const scopeParts = typeof decoded.scope === 'string' 
                    ? decoded.scope.split(' ') 
                    : [decoded.scope];
                    
                console.log('🔍 Token scope parts:', scopeParts);
                
                const hasAdminRole = ADMIN_ROLES.some(role => scopeParts.includes(role));
                console.log('🔍 Has admin role from scope:', hasAdminRole);
                
                if (hasAdminRole) return true;
            }
            
            // Check direct scope match (in case scope is just "ROLE_ADMIN")
            if (decoded?.scope && ADMIN_ROLES.includes(decoded.scope)) {
                console.log('🔍 Direct scope match for admin:', decoded.scope);
                return true;
            }
            
            // Fallback to roles field
            const roles = decoded?.roles || [];
            console.log('🔍 Token roles field:', roles);
            const hasAdminFromRoles = ADMIN_ROLES.some(role => roles.includes(role));
            console.log('🔍 Has admin role from roles field:', hasAdminFromRoles);
            
            return hasAdminFromRoles;
        } catch (error) {
            console.error('🔍 Error checking admin role:', error);
            return false;
        }
    };

    return {
        isAuthenticated,
        isAdmin: isAdmin(),
        accessToken: !!accessToken
    };
};

export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

export const requireAdmin = () => {
    const check = useAdminCheck();
    if (!check.isAuthenticated || !check.isAdmin) {
        throw new Error('Admin access required');
    }
    return check;
};

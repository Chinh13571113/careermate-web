import { useAuthStore } from '@/store/use-auth-store';

export const ADMIN_ROLES = ['ROLE_ADMIN', 'ADMIN'];

export const useAdminCheck = () => {
    const { accessToken, isAuthenticated } = useAuthStore();

    const isAdmin = () => {
        if (!accessToken || !isAuthenticated) {
            return false;
        }

        try {
            const decoded = decodeJWT(accessToken);
            const roles = decoded?.scope ? [decoded.scope] : decoded?.roles || [];
            return ADMIN_ROLES.some(role => roles.includes(role));
        } catch (error) {
            console.error('Error checking admin role:', error);
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

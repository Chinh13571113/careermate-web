// Hook to sync auth state immediately on client-side hydration
// This runs synchronously during component initialization to prevent flashing

import { useMemo, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

// Global flag to prevent multiple sync attempts
let hasAlreadySynced = false;

export const useServerSideAuthSync = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Effect to handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use useMemo to prevent recalculation on every render
  const syncedState = useMemo(() => {
    // Only log on first call to avoid spam
    if (!hasAlreadySynced) {
      console.log("🔄 [SYNC] useServerSideAuthSync called (first time)");
    }
    
    // Get current state from store
    const state = useAuthStore.getState();
    
    // If we're on the server, return default state
    if (typeof window === 'undefined') {
      if (!hasAlreadySynced) {
        console.log("🔄 [SYNC] Server side, returning default state");
      }
      return { isAuthenticated: false, accessToken: null };
    }
    
    // Always check localStorage when on client, regardless of mount state
    try {
      const storedToken = localStorage.getItem('access_token');
      const storedExpiry = localStorage.getItem('token_expires_at');
      
      console.log("🔍 [SYNC] localStorage check (isMounted:", isMounted, "):", {
        hasToken: !!storedToken,
        expiry: storedExpiry ? new Date(parseInt(storedExpiry)) : null,
        now: new Date()
      });
      
      if (storedToken && storedExpiry) {
        const expiresAt = parseInt(storedExpiry, 10);
        const isValid = expiresAt > Date.now();
        
        console.log("🔍 [SYNC] Token validation:", {
          expiresAt: new Date(expiresAt),
          now: new Date(),
          isValid,
          timeLeft: expiresAt - Date.now()
        });
        
        if (isValid) {
          console.log("🟢 [SYNC] Found valid token, returning authenticated state");
          return { isAuthenticated: true, accessToken: storedToken };
        } else {
          console.log("🟡 [SYNC] Token expired");
        }
      } else {
        console.log("🟡 [SYNC] No token or expiry found in localStorage");
      }
    } catch (error) {
      console.log("🟡 [SYNC] localStorage access error:", error);
    }
    
    // If already synced before, just return current store state
    if (hasAlreadySynced) {
      return { 
        isAuthenticated: state.isAuthenticated, 
        accessToken: state.accessToken 
      };
    }
    
    console.log("🔄 [SYNC] Current store state:", {
      hasToken: !!state.accessToken,
      isAuth: state.isAuthenticated,
      user: state.user,
      role: state.role
    });
    
    // If state is already synced and valid, return it
    if (state.accessToken && state.isAuthenticated) {
      console.log("🔄 [SYNC] Store already has valid state, returning it");
      hasAlreadySynced = true;
      return { isAuthenticated: state.isAuthenticated, accessToken: state.accessToken };
    }
    
    // Otherwise, sync from localStorage immediately (only once)
    console.log("🔄 [SYNC] Store state invalid, checking localStorage...");
    const storedToken = localStorage.getItem('access_token');
    const storedExpiry = localStorage.getItem('token_expires_at');
    
    console.log("🔄 [SYNC] localStorage data after mount:", {
      hasToken: !!storedToken,
      expiry: storedExpiry ? new Date(parseInt(storedExpiry)) : null,
      isMounted: isMounted
    });
    
    if (storedToken && storedExpiry) {
      const expiresAt = parseInt(storedExpiry, 10);
      const isValid = expiresAt > Date.now();
      
      console.log("🔄 [SYNC] Token validation:", {
        expiresAt: new Date(expiresAt),
        now: new Date(),
        isValid,
        timeLeft: expiresAt - Date.now()
      });
      
      if (isValid) {
        // Decode user info & role từ JWT thay vì localStorage (an toàn hơn)
        let userInfo = null;
        let role = null;
        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            userInfo = {
              id: payload.sub,
              email: payload.email,
              name: payload.name || payload.email
            };
            
            // Extract role from JWT
            if (payload.scope) {
              role = typeof payload.scope === 'string' ? payload.scope.split(' ')[0] : payload.scope;
            } else if (Array.isArray(payload.roles)) {
              role = payload.roles[0];
            }
          }
        } catch (e) {
          console.log("🟡 [SYNC] Could not decode JWT user info");
        }
        
        // Update store immediately (synchronously)
        console.log("🟢 [SYNC] Syncing valid state to store");
        useAuthStore.setState({
          accessToken: storedToken,
          tokenExpiresAt: expiresAt,
          isAuthenticated: true,
          user: userInfo,
          role: role
        });
        
        hasAlreadySynced = true;
        return { isAuthenticated: true, accessToken: storedToken };
      } else {
        // Clean expired tokens
        console.log("� [SYNC] Token expired, clearing all auth data");
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('user_role');
        // Xóa user_info nếu còn (legacy)
        localStorage.removeItem('user_info');
      }
    }
    
    console.log("🔄 [SYNC] No valid auth found, returning unauthenticated");
    hasAlreadySynced = true;
    return { isAuthenticated: false, accessToken: null };
  }, [isMounted]); // Depend on mount state
  
  return syncedState;
};
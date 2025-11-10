/**
 * Security Cleanup Utility
 * Xóa dữ liệu nhạy cảm khỏi localStorage để tăng cường bảo mật
 */

export function cleanupSensitiveData() {
  if (typeof window === 'undefined') return;
  
  try {
    // Xóa user_info (chứa email và thông tin cá nhân)
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      console.log('🧹 [SECURITY] Removing sensitive user_info from localStorage');
      localStorage.removeItem('user_info');
    }
    
    // Xóa user_role (có thể decode từ JWT, không cần lưu)
    const userRole = localStorage.getItem('user_role');
    if (userRole) {
      console.log('🧹 [SECURITY] Removing user_role from localStorage (decode from JWT instead)');
      localStorage.removeItem('user_role');
    }
    
    // Xóa các keys legacy khác nếu có
    const legacyKeys = ['refresh_token', 'user', 'profile'];
    legacyKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🧹 [SECURITY] Removing legacy key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ [SECURITY] Cleanup completed. Only keeping: access_token, token_expires_at');
  } catch (error) {
    console.error('❌ [SECURITY] Cleanup failed:', error);
  }
}

/**
 * Kiểm tra và báo cáo dữ liệu nhạy cảm trong localStorage
 */
export function auditLocalStorage() {
  if (typeof window === 'undefined') return;
  
  const sensitiveKeys = ['user_info', 'user_role', 'email', 'password', 'refresh_token'];
  const found: string[] = [];
  
  sensitiveKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      found.push(key);
    }
  });
  
  if (found.length > 0) {
    console.warn('⚠️ [SECURITY AUDIT] Found sensitive data in localStorage:', found);
    return { hasSensitiveData: true, keys: found };
  }
  
  console.log('✅ [SECURITY AUDIT] No sensitive data found in localStorage');
  return { hasSensitiveData: false, keys: [] };
}

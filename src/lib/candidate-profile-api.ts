import api from './api';

/**
 * User Profile API
 * Get current logged-in user's information
 */

export interface UserRole {
  name: string;
  description: string;
  permissions: any[];
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  status: string;
  roles: UserRole[];
}

export interface UserProfileResponse {
  code: number;
  result: UserProfile;
}

/**
 * Fetch current user profile
 * GET /api/users/current
 * 
 * This API returns the authenticated user's basic info including:
 * - id: User ID (number) - THIS IS WHAT WE NEED for candidateId
 * - username: User's display name
 * - email: User's email
 * - status: Account status (ACTIVE, etc.)
 * - roles: User's roles (CANDIDATE, RECRUITER, etc.)
 */
export const fetchCurrentUser = async (): Promise<UserProfile> => {
  try {
    console.log('📝 Fetching current user profile...');
    
    const response = await api.get<UserProfileResponse>(
      '/api/users/current'
    );

    console.log('✅ User profile response:', response.data);

    const responseData = response.data;

    // Check for success
    const isSuccess = 
      responseData.code === 200 || 
      responseData.code === 1000 || 
      responseData.code === 0;

    if (!isSuccess) {
      throw new Error('Failed to fetch user profile');
    }

    return responseData.result;
    
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(
        error.response.data?.message || 'Failed to fetch user profile'
      );
    }
    
    throw error;
  }
};

/**
 * DEPRECATED: Use fetchCurrentUser instead
 * Kept for backward compatibility
 */
export const fetchCandidateProfile = fetchCurrentUser;

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
 * Candidate Profile from /api/candidates/profiles/current
 */
export interface CandidateProfile {
  candidateId: number;
  dob: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  image: string;
  gender: string;
  link: string;
}

export interface CandidateProfileResponse {
  code: number;
  message: string;
  result: CandidateProfile;
}

/**
 * Fetch current candidate profile
 * GET /api/candidates/profiles/current
 * 
 * This API returns the authenticated candidate's profile including:
 * - candidateId: Candidate ID (number) - THIS IS WHAT WE NEED
 * - fullName, dob, title, phone, address, etc.
 */
export const fetchCurrentCandidateProfile = async (): Promise<CandidateProfile> => {
  try {
    console.log('📝 Fetching current candidate profile...');
    
    const response = await api.get<CandidateProfileResponse>(
      '/api/candidates/profiles/current'
    );

    console.log('✅ Raw response:', response);
    console.log('✅ Response status:', response.status);
    console.log('✅ Response data:', response.data);

    const responseData = response.data;

    // Check for success - handle both direct response and nested result
    if (!responseData) {
      throw new Error('Empty response from server');
    }

    // If response has code field, check it
    if ('code' in responseData) {
      if (responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to fetch candidate profile');
      }
      
      // Return the result
      if (!responseData.result) {
        throw new Error('No result in response');
      }
      
      return responseData.result;
    }

    // If response doesn't have code field, it might be the direct data
    // This shouldn't happen but handle it just in case
    console.warn('⚠️ Unexpected response format, treating as direct data');
    return responseData as unknown as CandidateProfile;
    
  } catch (error: any) {
    // If 400/404, profile doesn't exist yet - this is expected for new users
    if (error.response?.status === 400 || error.response?.status === 404) {
      console.log('⚠️ Candidate profile not found (status:', error.response.status, ') - This is normal for new users');
      throw new Error('PROFILE_NOT_FOUND');
    }
    
    // Only log actual errors (not expected 400/404)
    console.error('❌ Error fetching candidate profile:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(
        error.response.data?.message || 'Failed to fetch candidate profile'
      );
    }
    
    throw error;
  }
};

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
 * DEPRECATED: Use fetchCurrentCandidateProfile instead
 * Kept for backward compatibility
 */
export const fetchCandidateProfile = fetchCurrentCandidateProfile;

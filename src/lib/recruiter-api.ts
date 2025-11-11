import api from './api';
import { RecruiterResponse } from '@/types/recruiter';

// Skill Interface
export interface Skill {
  id: number;
  name: string;
}

export interface SkillsResponse {
  code: number;
  message: string;
  result: Skill[];
}

// Get all skills
export const getSkills = async (): Promise<SkillsResponse> => {
  try {
    console.log('🔵 [GET SKILLS] Fetching all skills');
    const response = await api.get('/api/jdskill');
    console.log('✅ [GET SKILLS] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [GET SKILLS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch skills');
  }
};

export const getRecruiters = async (): Promise<RecruiterResponse> => {
  try {
    // Use the dedicated endpoint for pending recruiters
    const response = await api.get(`/api/admin/recruiters/pending`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recruiters:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recruiters');
  }
};

// Search all recruiters with filters
export interface SearchRecruitersParams {
  keyword?: string;
  status?: string; // PENDING, APPROVED, ACTIVE, REJECTED, BANNED
  page?: number;
  size?: number;
  sortBy?: string; // Default: 'id'
  sortDir?: string; // 'asc' or 'desc'
}

export interface PaginatedRecruiterResponse {
  code: number;
  message: string;
  result: {
    content: any[]; // Array of recruiters
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const searchRecruiters = async (params?: SearchRecruitersParams): Promise<PaginatedRecruiterResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.keyword) {
      queryParams.append('keyword', params.keyword);
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params?.sortDir) {
      queryParams.append('sortDir', params.sortDir);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/admin/recruiters/search${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 [Search Recruiters] URL:', url);
    const response = await api.get(url);
    console.log('✅ [Search Recruiters] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error searching recruiters:', error);
    throw new Error(error.response?.data?.message || 'Failed to search recruiters');
  }
};

export const approveRecruiter = async (recruiterId: number): Promise<any> => {
  try {
    // Use PUT method as per new API requirements
    const response = await api.put(`/api/admin/recruiters/${recruiterId}/approve`);
    return response.data;
  } catch (error: any) {
    console.error('Error approving recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to approve recruiter');
  }
};

export const rejectRecruiter = async (recruiterId: number, reason: string): Promise<any> => {
  try {
    // Use PUT as the API expects PUT /api/admin/recruiters/{recruiterId}/reject
    const response = await api.put(`/api/admin/recruiters/${recruiterId}/reject?reason=${encodeURIComponent(reason)}`);
    return response.data;
  } catch (error: any) {
    console.error('Error rejecting recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to reject recruiter');
  }
};

export interface UpdateOrganizationRequest {
  companyName: string;
  website?: string;
  logoUrl?: string;
  businessLicense: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress: string;
  about?: string;
}

export const updateOrganization = async (data: UpdateOrganizationRequest): Promise<any> => {
  try {
    const response = await api.put('/api/recruiter/update-organization', data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating organization:', error);
    throw new Error(error.response?.data?.message || 'Failed to update organization');
  }
};

// Recruiter Profile Interface
export interface RecruiterProfile {
  recruiterId: number;
  accountId: number;
  email: string;
  username: string;
  companyName: string;
  website?: string;
  logoUrl?: string;
  about?: string;
  rating?: number;
  businessLicense: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress: string;
  accountStatus: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'REJECTED' | 'BANNED';
  accountRole: string;
  verificationStatus?: string;
  rejectionReason?: string;
}

export interface RecruiterProfileResponse {
  code: number;
  message: string;
  result: RecruiterProfile;
}

// Get My Recruiter Profile
export const getMyRecruiterProfile = async (): Promise<RecruiterProfileResponse> => {
  try {
    const response = await api.get('/api/recruiter/my-profile');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recruiter profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recruiter profile');
  }
};

// Ban Recruiter
export const banRecruiter = async (accountId: number, reason: string): Promise<any> => {
  try {
    const response = await api.put(`/api/admin/recruiters/account/${accountId}/ban`, null, {
      params: { reason }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error banning recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to ban recruiter');
  }
};

// Unban Recruiter
export const unbanRecruiter = async (accountId: number): Promise<any> => {
  try {
    const response = await api.put(`/api/admin/recruiters/account/${accountId}/unban`);
    return response.data;
  } catch (error: any) {
    console.error('Error unbanning recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to unban recruiter');
  }
};

// Job Posting APIs
export interface JdSkill {
  id: number;
  mustToHave: boolean;
}

export interface RecruiterJobPosting {
  id: number;
  title: string;
  description: string;
  address: string;
  expirationDate: string;
  createAt: string;
  yearsOfExperience: number;
  workModel: string;
  salaryRange: string;
  reason: string;
  jobPackage: string;
  status: string;
  skills?: Array<{ id: number; name: string; mustToHave: boolean }>;
}

export interface RecruiterJobPostingsResponse {
  code: number;
  message: string;
  result: RecruiterJobPosting[];
}

// Get all job postings of current recruiter
export const getRecruiterJobPostings = async (): Promise<RecruiterJobPostingsResponse> => {
  try {
    console.log('🔵 [GET RECRUITER JOB POSTINGS] Fetching...');
    const response = await api.get('/api/jobposting/recruiter');
    console.log('✅ [GET RECRUITER JOB POSTINGS] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [GET RECRUITER JOB POSTINGS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch job postings');
  }
};

export interface CreateJobPostRequest {
  title: string;
  description: string;
  address: string;
  expirationDate: string; // Format: YYYY-MM-DD
  jdSkills: JdSkill[];
  yearsOfExperience: number;
  workModel: string;
  salaryRange: string;
  reason: string;
  jobPackage: string;
}

export interface JobPostResponse {
  code: number;
  message: string;
  result: any;
}

// Create Job Post
export const createJobPost = async (data: CreateJobPostRequest): Promise<JobPostResponse> => {
  try {
    console.log('🔵 [CREATE JOB] Sending request:', data);
    const response = await api.post('/api/jobposting', data);
    console.log('✅ [CREATE JOB] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [CREATE JOB] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to create job post');
  }
};

// Update Job Posting Expiration Date
export const extendJobPosting = async (jobPostingId: number, newExpirationDate: string): Promise<JobPostResponse> => {
  try {
    console.log('🔵 [EXTEND JOB] Job ID:', jobPostingId, 'New date:', newExpirationDate);
    const response = await api.put(`/api/jobposting/${jobPostingId}/extend`, null, {
      params: { expirationDate: newExpirationDate }
    });
    console.log('✅ [EXTEND JOB] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [EXTEND JOB] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to extend job posting');
  }
};

// Get Job Posting Statistics
export interface JobPostingStats {
  jobPostingId: number;
  views: number;
  applicants: number;
}

export interface JobPostingStatsResponse {
  code: number;
  message: string;
  result: JobPostingStats;
}

export const getJobPostingStats = async (jobPostingId: number): Promise<JobPostingStatsResponse> => {
  try {
    console.log('🔵 [GET JOB STATS] Job ID:', jobPostingId);
    const response = await api.get(`/api/jobposting/${jobPostingId}/stats`);
    console.log('✅ [GET JOB STATS] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [GET JOB STATS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch job statistics');
  }
};

// Job Application APIs
export interface JobApplication {
  id: number;
  jobPostingId: number;
  jobTitle: string;
  jobDescription: string;
  expirationDate: string;
  candidateId: number;
  cvFilePath: string;
  fullName: string;
  phoneNumber: string;
  preferredWorkLocation: string;
  coverLetter: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REVIEWING';
  createAt: string;
}

export interface JobApplicationsResponse {
  code: number;
  message: string;
  result: JobApplication[];
}

// Get Job Applications by Job Posting ID
export const getJobApplications = async (jobPostingId: number): Promise<JobApplicationsResponse> => {
  try {
    console.log('🔵 [GET APPLICATIONS] Fetching for job posting:', jobPostingId);
    const response = await api.get(`/api/job-apply/job-posting/${jobPostingId}`);
    console.log('✅ [GET APPLICATIONS] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [GET APPLICATIONS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch job applications');
  }
};

// Update Job Application Status
export const updateJobApplicationStatus = async (
  applicationId: number, 
  status: 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED'
): Promise<any> => {
  try {
    console.log(`🔵 [UPDATE APPLICATION STATUS] ID: ${applicationId}, Status: ${status}`);
    const response = await api.put(`/api/job-apply/${applicationId}?status=${status}`);
    console.log('✅ [UPDATE APPLICATION STATUS] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [UPDATE APPLICATION STATUS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to update job application status');
  }
};

// Approve Job Application (using updateJobApplicationStatus)
export const approveJobApplication = async (applicationId: number): Promise<any> => {
  return updateJobApplicationStatus(applicationId, 'APPROVED');
};

// Reject Job Application (using updateJobApplicationStatus)
export const rejectJobApplication = async (applicationId: number, reason?: string): Promise<any> => {
  return updateJobApplicationStatus(applicationId, 'REJECTED');
};

// Set Job Application to Reviewing (using updateJobApplicationStatus)
export const setReviewingJobApplication = async (applicationId: number): Promise<any> => {
  return updateJobApplicationStatus(applicationId, 'REVIEWING');
};

// Change Password
export interface ChangePasswordRequest {
  password: string;
  repeatPassword: string;
}

export interface ChangePasswordResponse {
  code: number;
  message: string;
  result?: any;
}

export const changePassword = async (email: string, data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  try {
    console.log('🔵 [CHANGE PASSWORD] Sending request for email:', email);
    const response = await api.put(`/api/users/change-password/${encodeURIComponent(email)}`, data);
    console.log('✅ [CHANGE PASSWORD] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [CHANGE PASSWORD] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

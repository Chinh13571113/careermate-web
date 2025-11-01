import api from './api';
import { RecruiterResponse } from '@/types/recruiter';

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
    const response = await api.post(`/api/admin/recruiters/${recruiterId}/reject?reason=${encodeURIComponent(reason)}`);
    return response.data;
  } catch (error: any) {
    console.error('Error rejecting recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to reject recruiter');
  }
};

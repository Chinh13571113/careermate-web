import api from './api';

/**
 * Job Recommendation API
 * POST /api/v1/jobs/job-postings/
 */

export interface JobRecommendationRequest {
  candidate_id: number;
  skills: string[];
  title: string;
  description: string;
  top_n?: number; // Default: 5
}

export interface JobRecommendation {
  job_id: number;
  title: string;
  skills: string;
  description: string;
  semantic_similarity?: number;
  skill_overlap?: number;
  title_boost?: number;
  similarity?: number;
  final_score?: number;
  source_weight?: {
    content: number;
    cf: number;
  };
}

export interface JobRecommendationResponse {
  ok: boolean;
  results: {
    content_based: JobRecommendation[];
    collaborative: JobRecommendation[];
    hybrid_top: JobRecommendation[];
  };
}

/**
 * Get job recommendations based on candidate profile
 * POST /api/v1/jobs/job-postings/
 */
export const getJobRecommendations = async (
  data: JobRecommendationRequest
): Promise<JobRecommendationResponse> => {
  try {
    console.log('🔵 [JOB RECOMMENDATION] Request:', data);
    
    const response = await api.post<JobRecommendationResponse>(
      '/api/v1/jobs/job-postings/',
      data
    );

    console.log('✅ [JOB RECOMMENDATION] Response:', response.data);
    
    if (!response.data.ok) {
      throw new Error('Failed to get job recommendations');
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ [JOB RECOMMENDATION] Error:', error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 'Failed to get job recommendations'
    );
  }
};

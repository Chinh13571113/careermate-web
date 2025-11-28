"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Lock, X, ArrowLeft, Briefcase, TrendingUp, Star } from "lucide-react";
import { checkJobRecommendationAccess } from "@/lib/entitlement-api";
import { getJobRecommendations, type JobRecommendation } from "@/lib/job-recommendation-api";
import { fetchCurrentCandidateProfile } from "@/lib/candidate-profile-api";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function JobRecommendationPage() {
  const router = useRouter();
  const { candidateId } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Job recommendation data
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const accessRes = await checkJobRecommendationAccess();
      setHasAccess(accessRes.hasAccess);
      
      if (!accessRes.hasAccess) {
        setShowUpgradeModal(true);
      } else {
        // If has access, fetch recommendations
        await fetchRecommendations();
      }
    } catch (error) {
      console.error('Error checking job recommendation access:', error);
      setShowUpgradeModal(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsLoadingRecommendations(true);
      
      // Fetch candidate profile to get candidateId and title
      const profile = await fetchCurrentCandidateProfile();
      console.log('📋 [JOB RECOMMENDATION] Profile:', profile);

      if (!profile.candidateId) {
        toast.error("Không tìm thấy thông tin tài khoản");
        return;
      }

      // Fetch resume data to get skills and About Me
      const resumeResponse = await api.get('/api/resume');
      console.log('📋 [JOB RECOMMENDATION] Resume:', resumeResponse.data);

      let skills: string[] = [];
      let aboutMe = "";

      if (resumeResponse.data.result && resumeResponse.data.result.length > 0) {
        const resume = resumeResponse.data.result[0];
        
        // Extract skills
        if (resume.skills && resume.skills.length > 0) {
          skills = resume.skills.map((skill: any) => skill.skillName);
        }
        
        // Extract About Me
        if (resume.aboutMe) {
          aboutMe = resume.aboutMe;
        }
      }

      // Build request data
      const requestData = {
        candidate_id: profile.candidateId,
        skills: skills,
        title: profile.title || "Developer", // Professional Title
        description: aboutMe || "No description available",
        top_n: 5
      };

      console.log('📤 [JOB RECOMMENDATION] Request:', requestData);

      const response = await getJobRecommendations(requestData);
      
      // Set hybrid recommendations as default
      setRecommendations(response.results.hybrid_top || []);
      
      console.log('✅ [JOB RECOMMENDATION] Got recommendations:', response.results);
      
      if (response.results.hybrid_top.length === 0) {
        toast.success("Không tìm thấy công việc phù hợp", { icon: "ℹ️" });
      } else {
        toast.success(`Tìm thấy ${response.results.hybrid_top.length} công việc phù hợp!`);
      }
    } catch (error: any) {
      console.error('❌ [JOB RECOMMENDATION] Error:', error);
      toast.error(error.message || "Không thể tải gợi ý công việc");
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Access granted - show job recommendations page
  if (hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Recommendations</h1>
                <p className="text-gray-600">Gợi ý công việc phù hợp với hồ sơ của bạn</p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoadingRecommendations ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Đang tìm kiếm công việc phù hợp...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Job Cards */}
              {recommendations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Không tìm thấy công việc phù hợp
                    </h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      Hãy cập nhật thêm thông tin trong profile để nhận được gợi ý công việc tốt hơn.
                    </p>
                    <button
                      onClick={() => router.push('/candidate/cm-profile')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Cập nhật Profile
                    </button>
                  </div>
                </div>
              ) : (
                recommendations.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {job.final_score && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">
                                {(job.final_score * 100).toFixed(0)}% Match
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.split(',').map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Match Details */}
                    {(job.semantic_similarity || job.skill_overlap !== undefined) && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                        {job.semantic_similarity && (
                          <div>
                            <span className="font-medium">Semantic:</span>{' '}
                            {(job.semantic_similarity * 100).toFixed(0)}%
                          </div>
                        )}
                        {job.skill_overlap !== undefined && (
                          <div>
                            <span className="font-medium">Skill Match:</span>{' '}
                            {(job.skill_overlap * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* View Job Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          // TODO: Navigate to job detail page
                          toast.success('Xem chi tiết công việc #' + job.job_id);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // No access - show upgrade modal
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showUpgradeModal && (
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200">
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Premium Feature</h3>
                <p className="text-sm text-gray-500">Unlock full access</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium mb-2">
                    Bạn cần nâng cấp gói Premium để sử dụng tính năng này
                  </p>
                  <p className="text-sm text-gray-600">
                    Job Recommendation là tính năng dành riêng cho thành viên Premium. Nâng cấp ngay để nhận được gợi ý công việc phù hợp nhất với bạn!
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Premium Benefits:</p>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Personalized Job Recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>AI-Powered Job Matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Priority Job Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Access to All Premium Features</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Quay lại
              </button>
              <button
                onClick={() => router.push('/candidate/pricing')}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

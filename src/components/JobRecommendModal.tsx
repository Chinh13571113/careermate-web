"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Briefcase, Star, Lock } from "lucide-react";
import { checkJobRecommendationAccess } from "@/lib/entitlement-api";
import { getJobRecommendations, type JobRecommendation } from "@/lib/job-recommendation-api";
import { fetchCurrentCandidateProfile } from "@/lib/candidate-profile-api";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface JobRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobRecommendModal({ isOpen, onClose }: JobRecommendModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [contentBasedJobs, setContentBasedJobs] = useState<JobRecommendation[]>([]);
  const [collaborativeJobs, setCollaborativeJobs] = useState<JobRecommendation[]>([]);
  const [hotJobs, setHotJobs] = useState<JobRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'main' | 'recommended' | 'hot'>('main');

  useEffect(() => {
    if (isOpen) {
      checkAccessAndFetch();
    }
  }, [isOpen]);

  const checkAccessAndFetch = async () => {
    try {
      setLoading(true);
      
      // Check access
      const accessRes = await checkJobRecommendationAccess();
      setHasAccess(accessRes.hasAccess);
      
      if (!accessRes.hasAccess) {
        setShowUpgradePrompt(true);
        setLoading(false);
        return;
      }

      // If has access, fetch recommendations
      await fetchRecommendations();
    } catch (error) {
      console.error('Error checking access:', error);
      setShowUpgradePrompt(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // Fetch candidate profile
      const profile = await fetchCurrentCandidateProfile();
      
      if (!profile.candidateId) {
        toast.error("Không tìm thấy thông tin tài khoản");
        return;
      }

      // Fetch resume data
      const resumeResponse = await api.get('/api/resume');
      
      let skills: string[] = [];
      let aboutMe = "";

      if (resumeResponse.data.result && resumeResponse.data.result.length > 0) {
        const resume = resumeResponse.data.result[0];
        
        if (resume.skills && resume.skills.length > 0) {
          skills = resume.skills.map((skill: any) => skill.skillName);
        }
        
        if (resume.aboutMe) {
          aboutMe = resume.aboutMe;
        }
      }

      // Build request
      const requestData = {
        candidate_id: profile.candidateId,
        skills: skills,
        title: profile.title || "Developer",
        description: aboutMe || "No description available",
        top_n: 5
      };

      const response = await getJobRecommendations(requestData);
      
      // Set data for 3 sections
      setContentBasedJobs(response.results.content_based || []);
      setCollaborativeJobs(response.results.collaborative || []);
      setHotJobs(response.results.hybrid_top || []);
      
      const totalJobs = (response.results.content_based?.length || 0) + 
                        (response.results.collaborative?.length || 0) + 
                        (response.results.hybrid_top?.length || 0);
      
      if (totalJobs > 0) {
        toast.success(`Tìm thấy ${totalJobs} công việc phù hợp!`);
      } else {
        toast.success("Không tìm thấy công việc phù hợp", { icon: "ℹ️" });
      }
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      toast.error("Không thể tải gợi ý công việc");
    }
  };

  const handleUpgrade = () => {
    onClose();
    router.push('/candidate/pricing');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Job Recommendations</h2>
              <p className="text-sm text-gray-600">Gợi ý công việc phù hợp với hồ sơ của bạn</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Đang tìm kiếm công việc phù hợp...</p>
            </div>
          ) : showUpgradePrompt ? (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
                <p className="text-gray-600">
                  Bạn cần nâng cấp gói Premium để sử dụng tính năng Job Recommendation
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-3">Premium Benefits:</p>
                <ul className="space-y-2 text-sm text-blue-800">
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

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Đóng
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Nâng cấp ngay
                </button>
              </div>
            </div>
          ) : (contentBasedJobs.length === 0 && collaborativeJobs.length === 0 && hotJobs.length === 0) ? (
            <div className="text-center py-20 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Không tìm thấy công việc phù hợp
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy cập nhật thêm thông tin trong profile để nhận được gợi ý tốt hơn.
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push('/candidate/cm-profile');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Cập nhật Profile
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('main')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'main'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Phù hợp nhất ({contentBasedJobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'recommended'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Recommend for you ({collaborativeJobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('hot')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'hot'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Job Hot 🔥 ({hotJobs.length})
                </button>
              </div>

              {/* Job List */}
              <div className="space-y-4">
                {activeTab === 'main' && contentBasedJobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        {job.final_score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-600">
                              {(job.final_score * 100).toFixed(0)}% Match
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.split(',').slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                        {job.skills.split(',').length > 4 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{job.skills.split(',').length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Match Details */}
                    {(job.semantic_similarity || job.skill_overlap !== undefined) && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                        {job.semantic_similarity && (
                          <div>
                            <span className="font-medium">Semantic:</span>{' '}
                            {(job.semantic_similarity * 100).toFixed(0)}%
                          </div>
                        )}
                        {job.skill_overlap !== undefined && (
                          <div>
                            <span className="font-medium">Skill:</span>{' '}
                            {(job.skill_overlap * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={() => {
                        toast.success('Xem chi tiết công việc #' + job.job_id);
                        onClose();
                      }}
                      className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}

                {activeTab === 'recommended' && collaborativeJobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        {job.final_score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-600">
                              {(job.final_score * 100).toFixed(0)}% Match
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.split(',').slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                        {job.skills.split(',').length > 4 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{job.skills.split(',').length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Match Details */}
                    {(job.semantic_similarity || job.skill_overlap !== undefined) && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                        {job.semantic_similarity && (
                          <div>
                            <span className="font-medium">Semantic:</span>{' '}
                            {(job.semantic_similarity * 100).toFixed(0)}%
                          </div>
                        )}
                        {job.skill_overlap !== undefined && (
                          <div>
                            <span className="font-medium">Skill:</span>{' '}
                            {(job.skill_overlap * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={() => {
                        toast.success('Xem chi tiết công việc #' + job.job_id);
                        onClose();
                      }}
                      className="mt-3 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}

                {activeTab === 'hot' && hotJobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 p-5 hover:shadow-md transition-shadow relative"
                  >
                    {/* Hot Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                      🔥 HOT
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-16">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        {job.final_score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-600">
                              {(job.final_score * 100).toFixed(0)}% Match
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.split(',').slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                        {job.skills.split(',').length > 4 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{job.skills.split(',').length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Match Details */}
                    {(job.semantic_similarity || job.skill_overlap !== undefined) && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-orange-100 pt-3">
                        {job.semantic_similarity && (
                          <div>
                            <span className="font-medium">Semantic:</span>{' '}
                            {(job.semantic_similarity * 100).toFixed(0)}%
                          </div>
                        )}
                        {job.skill_overlap !== undefined && (
                          <div>
                            <span className="font-medium">Skill:</span>{' '}
                            {(job.skill_overlap * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={() => {
                        toast.success('Xem chi tiết công việc #' + job.job_id);
                        onClose();
                      }}
                      className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}

                {/* Empty state for each tab */}
                {activeTab === 'main' && contentBasedJobs.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Không có công việc phù hợp</p>
                  </div>
                )}
                {activeTab === 'recommended' && collaborativeJobs.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Không có công việc được đề xuất</p>
                  </div>
                )}
                {activeTab === 'hot' && hotJobs.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Không có job hot</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

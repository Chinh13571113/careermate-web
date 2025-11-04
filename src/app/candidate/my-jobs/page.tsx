"use client";

import { useState, useEffect } from "react";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import CVSidebar from "@/components/layout/CVSidebar";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { useAuthStore } from "@/store/use-auth-store";
import {
  fetchMyJobApplications,
  getStatusColor,
  getStatusText,
  formatApplicationDate,
  type JobApplication
} from "@/lib/my-jobs-api";
import toast from "react-hot-toast";

type TabType = "applied" | "saved" | "recent";

const MyJobsPage = () => {
  // Sử dụng context thay vì useEffect
  const { headerHeight } = useLayout();
  const { candidateId, fetchCandidateProfile } = useAuthStore();

  // Backup solution nếu context chưa hoạt động
  const [headerH, setHeaderH] = useState(headerHeight || 0);

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<TabType>("applied");

  // State for job applications
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  // Chỉ sử dụng localStorage ở client-side
  useEffect(() => {
    // Kiểm tra nếu đang ở client-side
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  // Fetch candidate profile if not loaded
  useEffect(() => {
    console.log('🔍 [Candidate My Jobs] Current candidateId:', candidateId);

    if (!candidateId) {
      console.log('📝 CandidateId not in store, fetching profile...');
      fetchCandidateProfile();
    } else {
      console.log('✅ CandidateId available:', candidateId);
    }
  }, [candidateId, fetchCandidateProfile]);

  // Fetch job applications
  useEffect(() => {
    const loadJobApplications = async () => {
      console.log('🔄 [Candidate My Jobs] loadJobApplications triggered, candidateId:', candidateId);

      if (!candidateId) {
        console.log('⏳ Waiting for candidateId...');
        return;
      }

      setIsLoading(true);
      try {
        console.log('📡 Fetching job applications for candidate:', candidateId);
        const applications = await fetchMyJobApplications(candidateId);
        setJobApplications(applications);
        console.log(`✅ Loaded ${applications.length} job applications`, applications);
      } catch (error: any) {
        console.error('❌ Failed to load job applications:', error);
        console.error('Error details:', error?.response?.data || error?.message);
        toast.error('Failed to load job applications');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobApplications();
  }, [candidateId]);

  const toggleJobDetails = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <>
      <ClientHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* GRID 2 cột: sidebar | content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`, // cao header
            ["--content-pad" as any]: "24px", // vì main có py-6 = 24px
          }}
        >
          {/* Sidebar trái: sticky + ẩn mobile */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="jobs" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                My Jobs
              </h1>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("applied")}
                  className={`pb-3 px-1 mr-8 relative ${activeTab === "applied"
                    ? "text-gray-500 font-medium border-b-2 border-gray-500"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Applied Jobs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500 text-white rounded-full">
                    {jobApplications.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("saved")}
                  className={`pb-3 px-1 mr-8 relative ${activeTab === "saved"
                    ? "text-gray-500 font-medium border-b-2 border-gray-500"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Saved Jobs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    0
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("recent")}
                  className={`pb-3 px-1 mr-8 relative ${activeTab === "recent"
                    ? "text-gray-500 font-medium border-b-2 border-gray-500"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Recent Viewed Jobs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    6
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === "applied" && (
                  <div>
                    <div className="flex items-center mb-8 text-gray-500 text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3"
                        />
                      </svg>
                      Your applied jobs are stored for the last 12 months.
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                      <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
                      </div>
                    )}

                    {/* Job Applications List */}
                    {!isLoading && jobApplications.length > 0 && (
                      <div className="space-y-4">
                        {jobApplications.map((application) => (
                          <div
                            key={application.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                          >
                            {/* Job Header */}
                            <div className="p-4 bg-white">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-600 font-semibold">
                                      {application.jobTitle.charAt(0)}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                        {application.jobTitle}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        Applied on {formatApplicationDate(application.createAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                                      {getStatusText(application.status)}
                                    </span>
                                    {new Date(application.expirationDate) < new Date() && (
                                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                        Expired
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Expand Button */}
                                <button
                                  onClick={() => toggleJobDetails(application.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <svg
                                    className={`w-5 h-5 text-gray-600 transition-transform ${expandedJobId === application.id ? 'rotate-180' : ''
                                      }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedJobId === application.id && (
                              <div className="border-t border-gray-200 bg-gray-50 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                                    <div className="space-y-1 text-gray-600">
                                      <p><span className="font-medium">Full Name:</span> {application.fullName}</p>
                                      <p><span className="font-medium">Phone:</span> {application.phoneNumber}</p>
                                      <p><span className="font-medium">Preferred Location:</span> {application.preferredWorkLocation}</p>
                                      <p><span className="font-medium">CV:</span> {application.cvFilePath.split('/').pop()}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                      {application.coverLetter || 'No cover letter provided'}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                                  <Link
                                    href={`/jobs-detail?id=${application.jobPostingId}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    View Job Details
                                  </Link>
                                  <a
                                    href={`/${application.cvFilePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                                  >
                                    View CV
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && jobApplications.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="bg-gray-200 p-4 rounded-lg mb-4">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 mb-6">
                          You haven't applied to any jobs in the last 12 months.
                        </p>
                        <Link
                          href="/jobs-list"
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
                        >
                          Explore jobs
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "saved" && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-6">
                      You haven't saved any jobs yet.
                    </p>
                    <Link
                      href="/jobs-list"
                      className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
                    >
                      Explore jobs
                    </Link>
                  </div>
                )}

                {activeTab === "recent" && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-6">
                      No recently viewed jobs to display.
                    </p>
                    <Link
                      href="/jobs-list"
                      className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
                    >
                      Explore jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <ClientFooter />
    </>
  );
};

export default MyJobsPage;

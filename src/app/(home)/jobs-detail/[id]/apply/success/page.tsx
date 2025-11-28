"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { FiCheck, FiArrowRight, FiSearch, FiBriefcase, FiMail, FiExternalLink } from "react-icons/fi";
import { fetchJobPostingById, transformJobPosting, fetchJobPostings } from "@/lib/job-api";
import { useAuthStore } from "@/store/use-auth-store";
import Image from "next/image";
import Link from "next/link";

// ===== Types =====
interface JobDetails {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
}

interface SimilarJob {
  id: number;
  title: string;
  company: string;
  salaryRange?: string;
  location: string;
}

// ===== Components =====
function SuccessIcon() {
  return (
    <div className="relative">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FiCheck className="w-10 h-10 text-green-600" />
      </div>
      {/* Confetti effect */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <span className="text-2xl">🎉</span>
      </div>
    </div>
  );
}

function SimilarJobCard({ job }: { job: SimilarJob }) {
  return (
    <Link
      href={`/jobs-detail/${job.id}`}
      className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <FiBriefcase className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {job.title}
        </h4>
        <p className="text-sm text-gray-600 truncate">{job.company}</p>
        {job.salaryRange && (
          <p className="text-sm text-green-600 font-medium mt-1">{job.salaryRange}</p>
        )}
      </div>
      <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-1" />
    </Link>
  );
}

function SkillTag({ skill, onAdd }: { skill: string; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center gap-1"
    >
      {skill}
      <span className="text-gray-400">+</span>
    </button>
  );
}

// ===== Main Component =====
export default function ApplicationSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const jobId = params.id as string;
  const applicationId = searchParams.get("applicationId");
  
  const { user } = useAuthStore();
  
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Suggested skills based on common job requirements
  const suggestedSkills = ["Java", "Team Management", "DevOps", "C#", "Python"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch applied job details
        if (jobId) {
          const response = await fetchJobPostingById(parseInt(jobId));
          if (response) {
            const transformed = transformJobPosting(response);
            setJobDetails({
              id: transformed.id,
              title: transformed.title,
              company: transformed.company,
              companyLogo: transformed.companyLogo,
              location: transformed.location,
            });
          }
        }

        // Fetch similar jobs
        const jobsResponse = await fetchJobPostings({ page: 0, size: 4 });
        if (jobsResponse?.result?.content) {
          const filtered = jobsResponse.result.content
            .filter((job: any) => job.id !== parseInt(jobId))
            .slice(0, 4)
            .map((job: any) => {
              const transformed = transformJobPosting(job);
              return {
                id: transformed.id,
                title: transformed.title,
                company: transformed.company,
                salaryRange: transformed.salaryRange,
                location: transformed.location,
              };
            });
          setSimilarJobs(filtered);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleSkillAdd = (skill: string) => {
    // TODO: Implement skill subscription
    console.log("Adding skill preference:", skill);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
          <SuccessIcon />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Amazing! We have received your CV
          </h1>
          
          <p className="text-gray-600 mb-6">We have received your CV to:</p>

          {/* Applied Job Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500">•</span>
              <span className="text-gray-700">
                <strong>Position:</strong> {jobDetails?.title || "Loading..."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <span className="text-gray-700">
                <strong>Company:</strong>{" "}
                <span className="text-red-600 font-medium">{jobDetails?.company || "Loading..."}</span>
              </span>
            </div>
          </div>

          {/* Email Notification */}
          <div className="flex items-start gap-3 text-left text-sm text-gray-600 bg-blue-50 rounded-lg p-4 mb-6">
            <FiMail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              Your CV will be sent to the employer after it is approved by our review team. 
              Please check email{" "}
              <span className="font-medium text-blue-600">{user?.email}</span>{" "}
              to get updates on your CV status.
            </p>
          </div>

          {applicationId && (
            <p className="text-xs text-gray-400 mb-4">
              Application ID: #{applicationId}
            </p>
          )}
        </div>

        {/* Similar Jobs Section */}
        {similarJobs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBriefcase className="w-5 h-5" />
              Have you seen these jobs in {jobDetails?.location || "your area"}?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {similarJobs.map((job) => (
                <SimilarJobCard key={job.id} job={job} />
              ))}
            </div>

            <Link
              href="/jobs-list"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <FiSearch className="w-4 h-4" />
              Search for other similar jobs
            </Link>
          </div>
        )}

        {/* Job Alert Subscription */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Don&apos;t miss new jobs like this one in {jobDetails?.location || "your area"}
          </h2>
          <p className="text-gray-600 mb-4">
            Choose your skills and get matching jobs for free
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {suggestedSkills.map((skill) => (
              <SkillTag key={skill} skill={skill} onAdd={() => handleSkillAdd(skill)} />
            ))}
          </div>

          <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            Subscribe
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/candidate/my-jobs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View My Applications
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/jobs-list"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse More Jobs
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

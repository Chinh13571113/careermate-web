"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import Image from "next/image";

interface JobRecommendation {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  salaryRange: string;
  location: string;
}

export default function ApplicationSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [appliedJob, setAppliedJob] = useState({
    position: "Technical Lead (C#, Java, Python)",
    company: "Veriserve Việt Nam",
  });

  const [recommendedJobs, setRecommendedJobs] = useState<JobRecommendation[]>([
    {
      id: 101,
      title: "Vision Engineer (C++, C#, Python)",
      company: "MEKTEC Manufacturing Corporation (Vietnam) Ltd",
      salaryRange: "800 - 2,000 USD",
      location: "Bắc Ninh",
    },
    {
      id: 102,
      title: "Python Developer AI & ETL Engineer (LangChain, MongoDB)",
      company: "TMA Solutions",
      salaryRange: "Up to $2500",
      location: "Hồ Chí Minh",
    },
    {
      id: 103,
      title: "Fullstack Developer (Golang, NodeJS, ReactJS, Java)- SSM",
      company: "SSM Vietnam",
      salaryRange: "900 - 1,600 USD",
      location: "Hồ Chí Minh",
    },
    {
      id: 104,
      title: "Windows Application Developer (C#, C++, WPF)",
      company: "LARION Computing Ltd",
      salaryRange: "1,000 - 2,500 USD",
      location: "Hồ Chí Minh",
    },
  ]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const availableSkills = ["Java", "Team Management", "DevOps", "C#", "Python"];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubscribe = () => {
    console.log("Subscribing with skills:", selectedSkills);
    // API call to subscribe
    alert("Subscribed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
        {/* Success Message Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          {/* Robot Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 relative">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Robot body */}
                <rect x="25" y="45" width="50" height="45" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
                {/* Robot head */}
                <rect x="30" y="25" width="40" height="25" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
                {/* Eyes */}
                <circle cx="40" cy="35" r="3" fill="#374151"/>
                <circle cx="60" cy="35" r="3" fill="#374151"/>
                {/* Antenna */}
                <line x1="50" y1="25" x2="50" y2="15" stroke="#9CA3AF" strokeWidth="2"/>
                <circle cx="50" cy="12" r="3" fill="#EF4444"/>
                {/* Smile */}
                <path d="M 40 42 Q 50 47 60 42" stroke="#374151" strokeWidth="2" fill="none"/>
                {/* Arms */}
                <rect x="15" y="50" width="10" height="25" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
                <rect x="75" y="50" width="10" height="25" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
                {/* Paper plane */}
                <g transform="translate(70, 20)">
                  <path d="M 0 0 L 15 5 L 0 10 L 3 5 Z" fill="#EF4444"/>
                  <line x1="3" y1="5" x2="8" y2="5" stroke="#DC2626" strokeWidth="1"/>
                </g>
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Amazing! We have received your CV
          </h1>

          <div className="text-left max-w-md mx-auto mb-6">
            <p className="text-gray-700 mb-2">We have received your CV for:</p>
            <ul className="space-y-1 ml-6">
              <li className="text-gray-900">
                • Position: <span className="font-medium">{appliedJob.position}</span>
              </li>
              <li className="text-gray-900">
                • Company: <span className="font-medium">{appliedJob.company}</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Your CV will be sent to the employer after it is approved by our review team. Please check email{" "}
            <span className="font-medium">yourname@gmail.com</span> to get updates on your CV status.
          </p>
        </div>

        {/* Job Recommendations in Ha Noi */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Have you seen these jobs in Ha Noi?
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-red-500 transition-colors cursor-pointer"
                onClick={() => router.push(`/candidate/jobs-detail?id=${job.id}`)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    {job.companyLogo ? (
                      <Image src={job.companyLogo} alt={job.company} width={48} height={48} />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">
                        {job.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    {job.salaryRange}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push(`/candidate/jobs-list?location=Ha Noi`)}
              className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 transition-colors"
            >
              Search for other similar jobs
            </button>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Don&apos;t miss new jobs like this one in Ha Noi
          </h2>
          <p className="text-gray-600 mb-6">Choose your skills and get matching jobs for free</p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedSkills.includes(skill)
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                }`}
              >
                {skill}
                {selectedSkills.includes(skill) && (
                  <span className="ml-2 text-white">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            className="px-8 py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors"
          >
            Subscribe
          </button>
        </div>

        {/* Back to Jobs Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/candidate/jobs-list")}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            ← Back to Job Listings
          </button>
        </div>
      </div>

      <ClientFooter />
    </div>
  );
}

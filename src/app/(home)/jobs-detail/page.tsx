"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import JobCard from "../../../components/JobCard";
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { FiMapPin, FiSearch, FiX, FiStar } from 'react-icons/fi';
import { IoFilterOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';

interface JobListing {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  postedAgo: string;
  jobType: string;
  workMode: string;
  experience: string;
  expertise: string;
  skills: string[];
  highlights: string[];
  description: string[];
  // NEW
  salaryRange?: string;           // dải lương hiển thị chip + meta bar
  benefitSummary?: string[];      // tóm tắt 3–4 quyền lợi cho meta bar
  benefits?: string[];            // danh sách chi tiết cho block “Compensation & Benefits”
  isHot?: boolean;
  isNegotiable?: boolean;
  companyType?: string;
}

const jobs: JobListing[] = [
  {
    id: 1,
    title: "Senior IT Operators (Corebanking)",
    company: "VIBbank",
    location: "Hồ Chí Minh",
    workMode: "At office",
    postedAgo: "1 hour ago",
    jobType: "Full time",
    experience: "5+ years",
    expertise: "Core Banking & Support",
    skills: ["Java", "DevOps", "Linux", "Cloud", "SQL", "Oracle"],
    isHot: true,
    salaryRange: "45–70M VND gross",
    benefitSummary: [
      "13th + performance bonus",
      "Hybrid/On-call allowance",
      "Private health insurance",
      "15 days paid leave",
    ],
    benefits: [
      "Total rewards: 13th-month + performance bonus + on-call allowance",
      "Private health insurance (self) + annual health check",
      "Hybrid policy, flexible working hours",
      "15 days annual leave + company trips",
      "Certification budget (AWS/CKA/ITIL…) & internal training",
      "High-impact Core Banking environment (HA/DR, PCI-DSS)",
    ],
    highlights: [
      "People development",
      "High promotion opportunities",
      "Attractive salary package",
    ],
    description: [
      "Provide technical support to support teams and customers through SLAs.",
      "Troubleshoot and resolve incidents quickly, collaborating across departments.",
      "Maintain performance, integrity, and security of applications.",
      "Participate in project releases, ensuring requirements are met timely.",
      "Escalate and communicate emerging risks before they become major issues.",
    ],
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "NEXON DEV VNA",
    location: "Hà Nội",
    workMode: "Remote",
    postedAgo: "2 hours ago",
    jobType: "Full time",
    experience: "3+ years",
    expertise: "Frontend Development",
    skills: ["React", "JavaScript", "TypeScript", "CSS"],
    salaryRange: "35–55M VND gross",
    benefitSummary: [
      "Flexible hours",
      "Annual bonus",
      "Health insurance",
      "Remote-first",
    ],
    benefits: [
      "Annual performance bonus",
      "Private health insurance",
      "Remote-first policy & home office support",
      "Learning budget for courses/conferences",
    ],
    isHot: false,
    highlights: [
      "Work with latest technologies",
      "Flexible working hours",
      "International team collaboration",
    ],
    description: [
      "Develop modern web applications using React and TypeScript.",
      "Collaborate with UI/UX designers to implement pixel-perfect designs.",
      "Write clean, maintainable, and well-documented code.",
      "Participate in code reviews and contribute to team best practices.",
    ],
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "MB Bank",
    location: "Đà Nẵng",
    workMode: "Hybrid",
    postedAgo: "3 hours ago",
    jobType: "Full time",
    experience: "4+ years",
    expertise: "Full Stack Development",
    skills: ["Python", "JavaScript", "MongoDB", "Docker"],
    isNegotiable: true,
    salaryRange: "Negotiable",
    benefitSummary: ["Hybrid", "Annual bonus", "Insurance", "Learning budget"],
    benefits: [
      "Competitive package with annual bonus",
      "Hybrid policy, allowance for WFH",
      "Private health insurance & health check",
      "Learning budget; clear promotion path",
    ],
    highlights: [
      "Competitive salary package",
      "Career development opportunities",
      "Modern tech stack",
    ],
    description: [
      "Build end-to-end web applications with modern frameworks.",
      "Design and implement RESTful APIs and microservices.",
      "Work with databases, cloud services, and DevOps practices.",
      "Mentor junior developers and lead technical discussions.",
    ],
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "LG Electronics Development Vietnam",
    location: "Hồ Chí Minh",
    workMode: "At office",
    postedAgo: "4 hours ago",
    jobType: "Full time",
    experience: "5+ years",
    expertise: "DevOps & Infrastructure",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    salaryRange: "50–80M VND gross",
    benefitSummary: ["Global benefits", "Bonus", "Insurance", "Growth path"],
    benefits: [
      "Global company benefits & annual bonus",
      "Private insurance for employee & family options",
      "Training & certification reimbursement",
      "Modern office, equipment provided",
    ],
    isHot: true,
    highlights: [
      "Work with cutting-edge technology",
      "Global company benefits",
      "Professional growth opportunities",
    ],
    description: [
      "Manage and optimize cloud infrastructure on AWS.",
      "Implement CI/CD pipelines and automation tools.",
      "Monitor system performance and ensure high availability.",
      "Collaborate with development teams on deployment strategies.",
    ],
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "NAB Innovation Centre Vietnam",
    location: "Hồ Chí Minh",
    workMode: "At office",
    postedAgo: "5 hours ago",
    jobType: "Full time",
    experience: "3+ years",
    expertise: "Backend Development",
    skills: ["Node.js", "Java", "MongoDB", "AWS"],
    salaryRange: "Thỏa thuận",
    benefitSummary: ["Agile", "Bonus", "Insurance", "International exposure"],
    benefits: [
      "Annual performance bonus",
      "Private health insurance",
      "Agile environment & international teams",
      "Education stipend / certification support",
    ],
    isHot: false,
    highlights: [
      "Work in fintech environment",
      "Agile methodology",
      "International exposure",
    ],
    description: [
      "Develop robust backend services and APIs.",
      "Work with microservices architecture.",
      "Ensure code quality and system reliability.",
      "Participate in architecture design decisions.",
    ],
  },
];

export default function JobsDetailPage() {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState<number>(jobs[0]?.id || 1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("All Cities");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 5;

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || jobs[0];

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleJobSelect = (jobId: number) => {
    setSelectedJobId(jobId);
  };

  const handleApplyNow = () => {
    router.push(`/candidate/jobs/${selectedJobId}/apply`);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchKeyword, "in", searchLocation);
  };

  const clearSearch = () => {
    setSearchKeyword("");
  };

  return (
    <>
      <ClientHeader />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Search Bar Section */}
        <div className="py-4 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Location Dropdown */}
                <div className="relative flex-shrink-0">
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="appearance-none w-full md:w-64 pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer text-gray-700"
                  >
                    <option value="All Cities">All Cities</option>
                    <option value="Ho Chi Minh">Ho Chi Minh</option>
                    <option value="Ha Noi">Ha Noi</option>
                    <option value="Da Nang">Da Nang</option>
                  </select>
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="lập trình viên fullstack"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {searchKeyword && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="hover:shadow-xl bg-gradient-to-r from-[#3a4660] to-gray-400 hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors flex-shrink-0"
                >
                  <FiSearch className="w-5 h-5" />
                  Search
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {/* Level Dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer text-gray-700 text-sm"
                  >
                    <option>Level</option>
                    <option>Intern</option>
                    <option>Fresher</option>
                    <option>Junior</option>
                    <option>Middle</option>
                    <option>Senior</option>
                    <option>Leader</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Working Model Dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer text-gray-700 text-sm"
                  >
                    <option>Working Model</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>Onsite</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Salary Dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer text-gray-700 text-sm"
                  >
                    <option>Salary</option>
                    <option>Dưới 10 triệu</option>
                    <option>10-15 triệu</option>
                    <option>15-20 triệu</option>
                    <option>20-30 triệu</option>
                    <option>30-50 triệu</option>
                    <option>Trên 50 triệu</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Job Domain Dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer text-gray-700 text-sm"
                  >
                    <option>Job Domain</option>
                    <option>Backend</option>
                    <option>Frontend</option>
                    <option>Fullstack</option>
                    <option>Mobile</option>
                    <option>DevOps</option>
                    <option>AI/ML</option>
                    <option>Data Science</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Filter Button */}
                <button className="ml-auto flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm">
                  <IoFilterOutline className="w-5 h-5" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-4">
          <main className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <aside className="lg:col-span-5">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Available Jobs{" "}
                    <span className="text-blue-600">({jobs.length})</span>
                  </h2>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleJobSelect(job.id)}
                        className="cursor-pointer"
                      >
                        <JobCard
                          id={job.id}
                          title={job.title}
                          company={job.company}
                          location={job.location}
                          postedAgo={job.postedAgo}
                          workMode={job.workMode}
                          skills={job.skills}
                          isHot={job.isHot}
                          isNegotiable={job.isNegotiable}
                          companyType={job.companyType}
                          isSelected={selectedJobId === job.id}
                          salaryRange={job.salaryRange}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg ${currentPage === page
                              ? 'bg-red-500 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </aside>

              <section className="lg:col-span-7">
                <div className="sticky top-20 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Header with company and job title - Fixed */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {selectedJob.company}
                          </span>
                          <span className="text-sm text-gray-700">
                            ✓ You will love it
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedJob.title}
                        </h1>

                        {/* NEW: chips ngay dưới tiêu đề */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedJob.salaryRange && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {selectedJob.salaryRange}
                            </span>
                          )}
                          <span className="px-3 py-1 rounded-full text-sm bg-sky-50 text-sky-700 border border-sky-200">
                            {selectedJob.workMode}
                          </span>
                          <span className="px-3 py-1 rounded-full text-sm bg-violet-50 text-violet-700 border border-violet-200">
                            {selectedJob.jobType}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {selectedJob.location} ·{" "}
                          <span className="text-blue-600">{selectedJob.jobType}</span>{" "}
                          · {selectedJob.postedAgo}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={handleApplyNow}
                        className="flex-1 bg-gradient-to-r from-[#3a4660] to-gray-400 text-white px-6 py-2 rounded-md font-medium hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors">
                        Apply Now
                      </button>

                      {/* Bookmark Button */}
                      <div className="relative group">
                        <button
                          onClick={() => setIsBookmarked(!isBookmarked)}
                          className="p-3 border-2 border-gray-300 rounded-md hover:border-red-500 transition-colors"
                        >
                          {isBookmarked ? (
                            <AiFillStar className="w-6 h-6 text-red-500" />
                          ) : (
                            <FiStar className="w-6 h-6 text-gray-600" />
                          )}
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap">
                            {isBookmarked ? 'Saved' : 'Save this job'}
                          </div>
                          <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 right-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content Area */}
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    <div className="p-6">
                      {/* NEW: meta bar tóm tắt compensation */}
                      {(selectedJob.salaryRange || selectedJob.benefitSummary?.length) && (
                        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-800">
                            {selectedJob.salaryRange && (
                              <li className="font-medium flex items-center gap-1">
                                <RiMoneyDollarCircleLine className="text-green-600" size={18} /> {selectedJob.salaryRange}
                              </li>
                            )}
                            {selectedJob.benefitSummary?.slice(0, 3).map((x, i) => (
                              <li key={i}>• {x}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Skills:</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Java</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">DevOps</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Linux</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Cloud</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">SQL</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Oracle</span>
                          </div>

                          <h3 className="font-semibold text-gray-700 mb-3">Job Expertise:</h3>
                          <p className="text-sm text-gray-700 mb-4 ml-2">DevOps Engineer</p>

                          <h3 className="font-semibold text-gray-700 mb-3">Job Domain:</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Banking</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">IT Services and IT Consulting</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Software Products and Web Services</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Securities & Investment</span>
                            <span className="px-4 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full shadow-sm">Financial Services</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-blue-900 mb-3">Top 3 reasons to join us</h3>
                          <ul className="space-y-2 text-sm">
                            {selectedJob.highlights.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* NEW: block Compensation & Benefits */}
                      {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">Compensation & Benefits</h3>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-700">
                            {selectedJob.benefits.map((b, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="font-semibold text-gray-900">Job description</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-700">
                          {selectedJob.description.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>

          {/* Floating chat button */}
          <div
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#3a4660] to-gray-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300 z-40"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
          </div>

          {/* CHAT BOX — đã xoá khe hở trắng, dùng 1 nền gradient + bỏ rounded lồng nhau */}
          {isChatOpen && (
            <div className="fixed bottom-6 right-6 z-50">
              <div className="rounded-2xl shadow-2xl w-96 h-[520px] flex flex-col overflow-hidden bg-gradient-to-b from-[#3a4660] via-gray-500 to-gray-400">
                {/* header trong suốt, không bo góc riêng */}
                <div className="p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Quiz Agent</h3>
                        <p className="text-sm text-white/80">Practice for your interview</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* content bg trong suốt, bỏ rounded để không hở mép */}
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="p-4">
                    <div className="bg-white/10 text-white rounded-lg p-3 mb-6 shadow-md">
                      <p className="text-sm font-medium mb-2">
                        Which CI/CD tool is commonly used for automating the software delivery pipeline in DevOps?
                      </p>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-white/40 focus:outline-none">
                          <span className="text-sm">A</span>
                        </button>
                        <span className="text-sm text-white">Docker</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-white/40 focus:outline-none">
                          <span className="text-sm">B</span>
                        </button>
                        <span className="text-sm text-white">Jenkins</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-white/40 focus:outline-none">
                          <span className="text-sm">C</span>
                        </button>
                        <span className="text-sm text-white">Kubernetes</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-white/40 focus:outline-none">
                          <span className="text-sm">D</span>
                        </button>
                        <span className="text-sm text-white">Visual Studio</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer trong suốt + border mảnh, không bo riêng */}
                <div className="border-t border-white/10 p-3">
                  <div className="flex justify-between">
                    <button className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20">
                      Skip
                    </button>
                    <button className="px-4 py-2 bg-white text-[#3a4660] font-medium rounded-md hover:bg-gray-100">
                      Next Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ClientFooter />
    </>
  );
}

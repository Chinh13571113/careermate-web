"use client";
import Link from "next/link";
import { useState } from "react";
import JobCard from "../../components/JobCard";

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
    skills: ["DevOps Engineer", "At office", "Hồ Chí Minh"],
    isHot: true,
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
  }
];

const menuLinks = [
  "All Jobs",
  "IT Companies",
  "Blog",
  "CV IT Templates",
  "AI & Data Jobs",
];

export default function JobsPage() {
  const [selectedJobId, setSelectedJobId] = useState<number>(jobs[0]?.id || 1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const selectedJob = jobs.find(job => job.id === selectedJobId) || jobs[0];

  const handleJobSelect = (jobId: number) => {
    setSelectedJobId(jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Jobs <span className="text-blue-600">({jobs.length})</span></h2>
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
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedJob.company}
                    </span>
                    <span className="text-sm text-gray-700">✓ You'll love it</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedJob.title}
                  </h1>
                  <p className="text-gray-600 text-sm mb-4">
                    📍 {selectedJob.location} · <span className="text-blue-600">{selectedJob.jobType}</span> · {selectedJob.postedAgo}
                  </p>
                </div>
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-blue-500'}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Apply Now
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="px-6 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Ask AI
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedJob.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="font-semibold text-blue-900 mb-3">Job Expertise</h3>
                  <p className="text-sm text-gray-700 mb-4">{selectedJob.expertise}</p>
                  
                  <h3 className="font-semibold text-gray-900 mb-3">Job Domain</h3>
                  <p className="text-sm text-gray-700">Banking • IT Services and IT Consulting • Software Products and Web Services</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Top 3 reasons to join us</h3>
                  <ul className="space-y-2 text-sm">
                    {selectedJob.highlights.map((item: string, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-gray-900">Job description</h3>
                  <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors">
                    ⭐ Show Quiz
                  </button>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  {selectedJob.description.map((item: string, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>




        </div>
      </main>

      <div 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300 z-40"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Career Assistant</h3>
                    <p className="text-sm text-blue-100">Ask me about jobs & career advice</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-white rounded-lg p-3 flex-1 shadow-sm">
                  <p className="text-sm text-gray-700">
                    Hello! I'm your AI career assistant. I can help you with:
                  </p>
                  <ul className="mt-2 text-xs text-gray-600 space-y-1">
                    <li>• Job recommendations based on your profile</li>
                    <li>• Salary insights and market trends</li>
                    <li>• Interview preparation tips</li>
                    <li>• Career guidance and development</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">You</span>
                </div>
                <div className="bg-blue-600 text-white rounded-lg p-3 flex-1">
                  <p className="text-sm">Hi! Can you tell me more about the {selectedJob.title} position?</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-white rounded-lg p-3 flex-1 shadow-sm">
                  <p className="text-sm text-gray-700">
                    Great choice! The <strong>{selectedJob.title}</strong> role at <strong>{selectedJob.company}</strong> offers:
                  </p>
                  <ul className="mt-2 text-xs text-gray-600 space-y-1">
                    {selectedJob.highlights.slice(0, 2).map((highlight, index) => (
                      <li key={index}>• {highlight}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">
                    Would you like salary insights or interview tips for this position?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">You</span>
                </div>
                <div className="bg-blue-600 text-white rounded-lg p-3 flex-1">
                  <p className="text-sm">Yes, please tell me about the salary range and what to expect in interviews.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-white rounded-lg p-3 flex-1 shadow-sm">
                  <p className="text-sm text-gray-700">
                    <strong>Salary Range:</strong> For {selectedJob.title} with {selectedJob.experience} experience in {selectedJob.location}, expect $1,500-$2,500/month.
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Interview Tips:</strong>
                  </p>
                  <ul className="mt-1 text-xs text-gray-600 space-y-1">
                    <li>• Prepare examples demonstrating your {selectedJob.expertise} skills</li>
                    <li>• Review banking domain knowledge and regulations</li>
                    <li>• Be ready to discuss system troubleshooting scenarios</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Ask me anything about this job..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors">
                  💰 Salary info
                </button>
                <button className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors">
                  🎯 Interview tips
                </button>
                <button className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors">
                  🔍 Similar jobs
                </button>
                <button className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors">
                  📈 Career path
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

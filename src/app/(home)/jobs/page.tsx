"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  Calendar,
  Filter,
  Bookmark,
  BookmarkIcon,
  ChevronRight,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { ClientHeader } from "@/modules/client/components/ClientHeader";
import { ClientFooter } from "@/modules/client/components/ClientFooter";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");

  const jobTypes = [
    { id: "all", name: "All Types", count: 1240 },
    { id: "fulltime", name: "Full-time", count: 890 },
    { id: "parttime", name: "Part-time", count: 156 },
    { id: "contract", name: "Contract", count: 123 },
    { id: "internship", name: "Internship", count: 71 },
  ];

  const locations = [
    { id: "all", name: "All Locations" },
    { id: "hcm", name: "Ho Chi Minh City" },
    { id: "hanoi", name: "Hanoi" },
    { id: "danang", name: "Da Nang" },
    { id: "remote", name: "Remote Work" },
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Vietnam",
      logo: "/api/placeholder/60/60",
      location: "Ho Chi Minh City",
      salary: "$1,000-1,500 USD",
      type: "Full-time",
      experience: "3-5 years",
      postedDate: "2 days ago",
      isUrgent: true,
      isSaved: false,
      skills: ["React", "TypeScript", "Next.js", "Node.js"],
      description:
        "We are looking for an experienced Senior Frontend Developer with React and modern ecosystem to join our product development team.",
      benefits: [
        "Health Insurance",
        "13th month salary",
        "Flexible working",
        "Training budget",
      ],
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Design Studio",
      logo: "/api/placeholder/60/60",
      location: "Hanoi",
      salary: "$600-1,000 USD",
      type: "Full-time",
      experience: "2-4 years",
      postedDate: "1 day ago",
      isUrgent: false,
      isSaved: true,
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      description:
        "UI/UX Designer position for web and mobile app projects. Experience in user-centered design required.",
      benefits: [
        "MacBook Pro",
        "Design tools license",
        "Creative environment",
        "Flexible hours",
      ],
    },
    {
      id: 3,
      title: "Data Scientist Intern",
      company: "AI Solutions",
      logo: "/api/placeholder/60/60",
      location: "Remote",
      salary: "$300-500 USD",
      type: "Internship",
      experience: "0-1 years",
      postedDate: "3 days ago",
      isUrgent: false,
      isSaved: false,
      skills: ["Python", "Machine Learning", "SQL", "Tableau"],
      description:
        "Great internship opportunity for students/fresh graduates who want to step into the Data Science field.",
      benefits: [
        "Mentoring",
        "Real project experience",
        "Certificate",
        "Future job opportunity",
      ],
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      company: "Growth Marketing Agency",
      logo: "/api/placeholder/60/60",
      location: "Ho Chi Minh City",
      salary: "$500-750 USD",
      type: "Full-time",
      experience: "1-3 years",
      postedDate: "1 week ago",
      isUrgent: false,
      isSaved: false,
      skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
      description:
        "Looking for Digital Marketing Specialist to execute online marketing campaigns for diverse clients.",
      benefits: [
        "Performance bonus",
        "Marketing budget",
        "Training courses",
        "Team building",
      ],
    },
    {
      id: 5,
      title: "Full-stack Developer",
      company: "StartupXYZ",
      logo: "/api/placeholder/60/60",
      location: "Da Nang",
      salary: "$800-1,200 USD",
      type: "Full-time",
      experience: "2-5 years",
      postedDate: "4 days ago",
      isUrgent: true,
      isSaved: false,
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      description:
        "Join our tech startup to build innovative products. Looking for passionate full-stack developers who love challenges.",
      benefits: [
        "Equity options",
        "Latest tech stack",
        "Startup environment",
        "Growth opportunity",
      ],
    },
    {
      id: 6,
      title: "Business Analyst",
      company: "Enterprise Corp",
      logo: "/api/placeholder/60/60",
      location: "Hanoi",
      salary: "$750-1,000 USD",
      type: "Full-time",
      experience: "2-4 years",
      postedDate: "5 days ago",
      isUrgent: false,
      isSaved: false,
      skills: ["SQL", "Excel", "PowerBI", "Business Process"],
      description:
        "Business Analyst role focusing on process improvement and data analysis for enterprise-level solutions.",
      benefits: [
        "Professional development",
        "International environment",
        "Performance bonus",
        "Healthcare",
      ],
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesLocation =
      selectedLocation === "all" ||
      job.location.toLowerCase().includes(selectedLocation);
    const matchesType =
      selectedJobType === "all" ||
      job.type.toLowerCase().replace("-", "") === selectedJobType;

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Use shared header */}
      <ClientHeader />
      <div className="container mx-auto px-4 py-8 mt-16">{/* Added margin-top for fixed header */}
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-white-900 to-indigo-900 rounded-lg text-white p-8 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Discover thousands of job opportunities from leading companies and 
              promising startups
            </p>

            {/* Quick Search */}
            <div className="bg-white rounded-lg p-4 text-gray-800 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Position, company, skills..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="bg-gradient-to-r from-[#3a4660] to-gray-400 text-white rounded-lg hover:from-[#3a4660] hover:to-[#3a4660] px-8 py-3 transition-all duration-200 font-medium">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Filters
              </h3>

              {/* Job Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Job Type
                </label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedJobType(type.id)}
                      className={`w-full text-left flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                        selectedJobType === type.id
                          ? "bg-gradient-to-r from-[#3a4660] to-gray-400 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span>{type.name}</span>
                      <span
                        className={`text-sm ${
                          selectedJobType === type.id
                            ? "text-gray-300"
                            : "text-[#6B7280]"
                        }`}
                      >
                        ({type.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Salary Range (million VND)
                </label>
                <div className="space-y-2">
                  {["All", "Under 15", "15-25", "25-35", "Over 35"].map(
                    (range) => (
                      <label key={range} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded mr-3 border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">{range}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Experience
                </label>
                <div className="space-y-2">
                  {[
                    "All",
                    "No requirement",
                    "1-2 years",
                    "3-5 years",
                    "Over 5 years",
                  ].map((exp) => (
                    <label key={exp} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded mr-3 border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Alerts */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Job Alerts
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get notified about new job opportunities that match your profile
              </p>
              <button className="w-full bg-gradient-to-r from-[#3a4660] to-gray-400 hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors text-white py-2 rounded-lg">
                Create Alert
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {" "}
                  <strong className="text-gray-900">
                    {filteredJobs.length}
                  </strong>{" "}
                  job opportunities found
                </span>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option value="relevance">Most Relevant</option>
                  <option value="date">Newest</option>
                  <option value="salary-high">Salary High to Low</option>
                  <option value="salary-low">Salary Low to High</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-gray-700 cursor-pointer">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 font-medium mb-2">
                                {job.company}
                              </p>

                              <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{job.type}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Briefcase className="w-4 h-4" />
                                  <span>{job.experience}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {job.isUrgent && (
                                <span className="bg-[#3a4660] text-white px-2 py-1 rounded-full text-xs font-medium">
                                  Urgent
                                </span>
                              )}
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <BookmarkIcon
                                  className={`w-5 h-5 ${
                                    job.isSaved
                                      ? "fill-current text-gray-600"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {job.description}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Benefits */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Benefits:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.slice(0, 3).map((benefit) => (
                                <span
                                  key={benefit}
                                  className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200"
                                >
                                  {benefit}
                                </span>
                              ))}
                              {job.benefits.length > 3 && (
                                <span className="text-xs text-[#6B7280]">
                                  +{job.benefits.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {job.postedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>15 applicants</span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        <button className="px-6 py-2 bg-gradient-to-r from-[#3a4660] to-gray-400 text-white rounded-lg hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Load More Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Use shared footer */}
      <ClientFooter />
    </div>
  );
}

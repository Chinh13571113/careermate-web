'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  TrendingUp
} from 'lucide-react';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');

  const jobTypes = [
    { id: 'all', name: 'Tất cả', count: 1240 },
    { id: 'fulltime', name: 'Full-time', count: 890 },
    { id: 'parttime', name: 'Part-time', count: 156 },
    { id: 'contract', name: 'Contract', count: 123 },
    { id: 'internship', name: 'Thực tập', count: 71 }
  ];

  const locations = [
    { id: 'all', name: 'Tất cả địa điểm' },
    { id: 'hcm', name: 'TP. Hồ Chí Minh' },
    { id: 'hanoi', name: 'Hà Nội' },
    { id: 'danang', name: 'Đà Nẵng' },
    { id: 'remote', name: 'Làm việc từ xa' }
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Vietnam",
      logo: "/api/placeholder/60/60",
      location: "TP.HCM",
      salary: "25-35 triệu VNĐ",
      type: "Full-time",
      experience: "3-5 năm",
      postedDate: "2 ngày trước",
      isUrgent: true,
      isSaved: false,
      skills: ["React", "TypeScript", "Next.js", "Node.js"],
      description: "Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với React và ecosystem hiện đại để tham gia đội ngũ phát triển sản phẩm.",
      benefits: ["Bảo hiểm sức khỏe", "13th month salary", "Flexible working", "Training budget"]
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Design Studio",
      logo: "/api/placeholder/60/60",
      location: "Hà Nội",
      salary: "15-25 triệu VNĐ",
      type: "Full-time",
      experience: "2-4 năm",
      postedDate: "1 ngày trước",
      isUrgent: false,
      isSaved: true,
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      description: "Vị trí UI/UX Designer cho các dự án web và mobile app. Yêu cầu có kinh nghiệm thiết kế user-centered design.",
      benefits: ["MacBook Pro", "Design tools license", "Creative environment", "Flexible hours"]
    },
    {
      id: 3,
      title: "Data Scientist Intern",
      company: "AI Solutions",
      logo: "/api/placeholder/60/60",
      location: "Remote",
      salary: "8-12 triệu VNĐ",
      type: "Internship",
      experience: "0-1 năm",
      postedDate: "3 ngày trước",
      isUrgent: false,
      isSaved: false,
      skills: ["Python", "Machine Learning", "SQL", "Tableau"],
      description: "Cơ hội thực tập tuyệt vời cho sinh viên/fresh graduate muốn bước chân vào lĩnh vực Data Science.",
      benefits: ["Mentoring", "Real project experience", "Certificate", "Future job opportunity"]
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      company: "Growth Marketing Agency",
      logo: "/api/placeholder/60/60",
      location: "TP.HCM",
      salary: "12-18 triệu VNĐ",
      type: "Full-time",
      experience: "1-3 năm",
      postedDate: "1 tuần trước",
      isUrgent: false,
      isSaved: false,
      skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
      description: "Tìm kiếm Digital Marketing Specialist để thực hiện các chiến dịch marketing online cho nhiều client đa dạng.",
      benefits: ["Performance bonus", "Marketing budget", "Training courses", "Team building"]
    },
    {
      id: 5,
      title: "Full-stack Developer",
      company: "StartupXYZ",
      logo: "/api/placeholder/60/60",
      location: "Đà Nẵng",
      salary: "20-30 triệu VNĐ",
      type: "Full-time",
      experience: "2-5 năm",
      postedDate: "4 ngày trước",
      isUrgent: true,
      isSaved: false,
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      description: "Join our tech startup to build innovative products. Looking for passionate full-stack developers who love challenges.",
      benefits: ["Equity options", "Latest tech stack", "Startup environment", "Growth opportunity"]
    },
    {
      id: 6,
      title: "Business Analyst",
      company: "Enterprise Corp",
      logo: "/api/placeholder/60/60",
      location: "Hà Nội",
      salary: "18-25 triệu VNĐ",
      type: "Full-time",
      experience: "2-4 năm",
      postedDate: "5 ngày trước",
      isUrgent: false,
      isSaved: false,
      skills: ["SQL", "Excel", "PowerBI", "Business Process"],
      description: "Business Analyst role focusing on process improvement and data analysis for enterprise-level solutions.",
      benefits: ["Professional development", "International environment", "Performance bonus", "Healthcare"]
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation);
    const matchesType = selectedJobType === 'all' || job.type.toLowerCase().replace('-', '') === selectedJobType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl text-white p-8 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Tìm công việc mơ ước của bạn</h1>
            <p className="text-xl opacity-90 mb-6">
              Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu và startup đầy tiềm năng
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
                    placeholder="Vị trí, công ty, kỹ năng..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Bộ lọc</h3>
              
              {/* Job Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Loại công việc</label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedJobType(type.id)}
                      className={`w-full text-left flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                        selectedJobType === type.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{type.name}</span>
                      <span className="text-sm text-gray-500">({type.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Mức lương (triệu VNĐ)</label>
                <div className="space-y-2">
                  {['Tất cả', 'Dưới 15', '15-25', '25-35', 'Trên 35'].map((range) => (
                    <label key={range} className="flex items-center">
                      <input type="checkbox" className="rounded mr-3" />
                      <span className="text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Kinh nghiệm</label>
                <div className="space-y-2">
                  {['Tất cả', 'Không yêu cầu', '1-2 năm', '3-5 năm', 'Trên 5 năm'].map((exp) => (
                    <label key={exp} className="flex items-center">
                      <input type="checkbox" className="rounded mr-3" />
                      <span className="text-sm text-gray-700">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Thông báo việc làm</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nhận thông báo về các cơ hội việc làm phù hợp với bạn
              </p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Tạo thông báo
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Tìm thấy <strong>{filteredJobs.length}</strong> việc làm phù hợp
                </span>
                <select className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="relevance">Liên quan nhất</option>
                  <option value="date">Mới nhất</option>
                  <option value="salary-high">Lương cao đến thấp</option>
                  <option value="salary-low">Lương thấp đến cao</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <img 
                          src={job.logo} 
                          alt={job.company}
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                                {job.title}
                              </h3>
                              <p className="text-blue-600 font-medium mb-2">{job.company}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
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
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Urgent
                                </span>
                              )}
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <BookmarkIcon className={`w-5 h-5 ${job.isSaved ? 'fill-current text-red-500' : ''}`} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          {/* Benefits */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.slice(0, 3).map((benefit) => (
                                <span key={benefit} className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                                  {benefit}
                                </span>
                              ))}
                              {job.benefits.length > 3 && (
                                <span className="text-xs text-gray-500">+{job.benefits.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Đăng {job.postedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>15 ứng viên</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-1"
                        >
                          <span>Chi tiết</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Ứng tuyển
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
                Xem thêm việc làm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
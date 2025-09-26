'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Video,
  Users,
  Award,
  ChevronDown,
  Calendar,
  CheckCircle
} from 'lucide-react';

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedPriceRange, setPriceRange] = useState('all');

  const expertiseAreas = [
    { id: 'all', name: 'Tất cả lĩnh vực', count: 234 },
    { id: 'programming', name: 'Lập trình', count: 89 },
    { id: 'design', name: 'Thiết kế', count: 45 },
    { id: 'business', name: 'Kinh doanh', count: 56 },
    { id: 'marketing', name: 'Marketing', count: 34 },
    { id: 'data-science', name: 'Data Science', count: 28 }
  ];

  const mentors = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      title: "Senior Full-stack Developer",
      company: "Google Vietnam",
      avatar: "/api/placeholder/80/80",
      rating: 4.9,
      reviewCount: 127,
      experience: "8+ năm kinh nghiệm",
      location: "TP.HCM, Việt Nam",
      expertise: ["React", "Node.js", "AWS", "MongoDB"],
      languages: ["Tiếng Việt", "English"],
      pricePerHour: 800000,
      responseTime: "Thường phản hồi trong 2 giờ",
      sessionsCompleted: 156,
      bio: "Tôi đã làm việc tại các công ty công nghệ hàng đầu và có kinh nghiệm phát triển nhiều ứng dụng web scale lớn. Tôi yêu thích việc chia sẻ kiến thức và giúp các bạn trẻ phát triển sự nghiệp.",
      availability: "Sáng & Tối",
      specialties: [
        "Code review & Architecture",
        "Career guidance",
        "Interview preparation",
        "System design"
      ],
      isOnline: true,
      isTopRated: true
    },
    {
      id: 2,
      name: "Trần Thị B",
      title: "UI/UX Design Lead",
      company: "Shopee Singapore",
      avatar: "/api/placeholder/80/80",
      rating: 4.8,
      reviewCount: 89,
      experience: "6+ năm kinh nghiệm",
      location: "Singapore",
      expertise: ["Figma", "User Research", "Prototyping", "Design System"],
      languages: ["Tiếng Việt", "English"],
      pricePerHour: 950000,
      responseTime: "Thường phản hồi trong 1 giờ",
      sessionsCompleted: 98,
      bio: "Chuyên gia thiết kế UX với kinh nghiệm làm việc tại các sản phẩm có hàng triệu người dùng. Tôi có thể giúp bạn từ research, wireframe đến prototype hoàn chỉnh.",
      availability: "Cuối tuần",
      specialties: [
        "User experience design",
        "Design thinking workshop",
        "Portfolio review",
        "Career transition to UX"
      ],
      isOnline: false,
      isTopRated: true
    },
    {
      id: 3,
      name: "Lê Văn C",
      title: "Digital Marketing Manager",
      company: "Facebook Vietnam",
      avatar: "/api/placeholder/80/80",
      rating: 4.7,
      reviewCount: 156,
      experience: "5+ năm kinh nghiệm",
      location: "Hà Nội, Việt Nam",
      expertise: ["Facebook Ads", "Google Ads", "SEO", "Analytics"],
      languages: ["Tiếng Việt", "English"],
      pricePerHour: 600000,
      responseTime: "Thường phản hồi trong 3 giờ",
      sessionsCompleted: 203,
      bio: "Marketing specialist với track record tăng trưởng doanh số cho nhiều thương hiệu lớn. Tôi sẽ chia sẻ kinh nghiệm thực tế về digital marketing và growth hacking.",
      availability: "Tối trong tuần",
      specialties: [
        "Performance marketing",
        "Social media strategy",
        "Marketing automation",
        "ROI optimization"
      ],
      isOnline: true,
      isTopRated: false
    },
    {
      id: 4,
      name: "Phạm Thị D",
      title: "Data Science Manager",
      company: "Grab Vietnam",
      avatar: "/api/placeholder/80/80",
      rating: 4.9,
      reviewCount: 67,
      experience: "7+ năm kinh nghiệm",
      location: "TP.HCM, Việt Nam",
      expertise: ["Python", "Machine Learning", "SQL", "Tableau"],
      languages: ["Tiếng Việt", "English"],
      pricePerHour: 1200000,
      responseTime: "Thường phản hồi trong 4 giờ",
      sessionsCompleted: 78,
      bio: "Lead Data Scientist với kinh nghiệm xây dựng các hệ thống ML production. Tôi có thể giúp bạn từ kiến thức cơ bản đến advanced ML và career path trong Data Science.",
      availability: "Chủ nhật",
      specialties: [
        "Machine Learning in production",
        "Data strategy & governance",
        "Team leadership",
        "Technical interview prep"
      ],
      isOnline: false,
      isTopRated: true
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl text-white p-8 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Kết nối với Mentor chuyên nghiệp</h1>
            <p className="text-xl opacity-90 mb-6">
              Học hỏi từ các chuyên gia hàng đầu, nhận được lời khuyên cá nhân hóa và đẩy nhanh sự nghiệp của bạn
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>200+ mentor chuyên nghiệp</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Đánh giá trung bình 4.8/5</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>5000+ sessions đã hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Tìm mentor</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tên mentor, kỹ năng..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Expertise Areas */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lĩnh vực chuyên môn</label>
                <div className="space-y-2">
                  {expertiseAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedExpertise(area.id)}
                      className={`w-full text-left flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                        selectedExpertise === area.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{area.name}</span>
                      <span className="text-sm text-gray-500">({area.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá (VNĐ/giờ)</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả mức giá</option>
                  <option value="0-500000">Dưới 500,000đ</option>
                  <option value="500000-1000000">500,000đ - 1,000,000đ</option>
                  <option value="1000000+">Trên 1,000,000đ</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">Đang online</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">Top rated</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Success Story */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Câu chuyện thành công</h3>
              <div className="text-sm text-gray-600 mb-4">
                "Mentor của tôi đã giúp tôi chuyển đổi từ Marketing sang Data Science chỉ trong 6 tháng. Lộ trình học tập rất cụ thể và thực tế."
              </div>
              <div className="flex items-center space-x-2">
                <img src="/api/placeholder/32/32" alt="Student" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Hoàng Minh T.</p>
                  <p className="text-xs text-gray-500">Data Analyst tại VinGroup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Tìm thấy <strong>{filteredMentors.length}</strong> mentor phù hợp
                </span>
                <select className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="recommended">Được đề xuất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="experience">Kinh nghiệm nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="space-y-6">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left: Avatar & Basic Info */}
                    <div className="lg:w-64 flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.name}
                          className="w-20 h-20 rounded-full mx-auto lg:mx-0 mb-4"
                        />
                        {mentor.isOnline && (
                          <div className="absolute top-0 right-0 lg:left-16 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {mentor.isTopRated && (
                          <div className="absolute -top-1 -right-1 lg:left-14 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            TOP
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center lg:text-left">
                        <h3 className="font-bold text-lg mb-1">{mentor.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">{mentor.title}</p>
                        <p className="text-blue-600 text-sm font-medium mb-3">{mentor.company}</p>
                        
                        <div className="flex items-center justify-center lg:justify-start space-x-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{mentor.rating}</span>
                          <span className="text-sm text-gray-500">({mentor.reviewCount} đánh giá)</span>
                        </div>
                        
                        <div className="flex items-center justify-center lg:justify-start space-x-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{mentor.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-center lg:justify-start space-x-1 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>{mentor.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1">
                      <p className="text-gray-700 mb-4 leading-relaxed">{mentor.bio}</p>
                      
                      {/* Expertise Tags */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Kỹ năng chuyên môn:</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Dịch vụ mentoring:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mentor.specialties.map((specialty) => (
                            <div key={specialty} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{specialty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium text-gray-800">{mentor.sessionsCompleted}</p>
                          <p>Sessions hoàn thành</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{mentor.responseTime.split(' ')[4]}</p>
                          <p>Thời gian phản hồi</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{mentor.availability}</p>
                          <p>Khung giờ có sẵn</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{mentor.languages.join(', ')}</p>
                          <p>Ngôn ngữ</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing & Actions */}
                    <div className="lg:w-64 flex-shrink-0">
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {mentor.pricePerHour.toLocaleString()}đ
                          </div>
                          <div className="text-sm text-gray-500">per giờ</div>
                        </div>
                        
                        <div className="space-y-3">
                          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                            <MessageCircle className="w-4 h-4" />
                            <span>Nhắn tin</span>
                          </button>
                          
                          <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                            <Video className="w-4 h-4" />
                            <span>Đặt lịch call</span>
                          </button>
                          
                          <Link 
                            href={`/mentors/${mentor.id}`}
                            className="w-full bg-white border text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                          >
                            Xem profile
                          </Link>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {mentor.responseTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
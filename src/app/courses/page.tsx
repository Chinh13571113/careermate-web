'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen, 
  Trophy,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: 'Tất cả', count: 124 },
    { id: 'programming', name: 'Lập trình', count: 45 },
    { id: 'design', name: 'Thiết kế', count: 28 },
    { id: 'data-science', name: 'Data Science', count: 22 },
    { id: 'business', name: 'Kinh doanh', count: 18 },
    { id: 'marketing', name: 'Marketing', count: 11 }
  ];

  const levels = [
    { id: 'all', name: 'Tất cả cấp độ' },
    { id: 'beginner', name: 'Cơ bản' },
    { id: 'intermediate', name: 'Trung cấp' },
    { id: 'advanced', name: 'Nâng cao' }
  ];

  const courses = [
    {
      id: 1,
      title: "Lập trình React từ cơ bản đến nâng cao",
      instructor: "Nguyễn Văn A",
      category: "programming",
      level: "intermediate",
      duration: "8 tuần",
      lessons: 45,
      students: 2340,
      rating: 4.8,
      price: "2,990,000",
      originalPrice: "3,990,000",
      image: "/api/placeholder/400/250",
      description: "Khóa học toàn diện về React, từ những kiến thức cơ bản đến các kỹ thuật nâng cao như Hooks, Context API, Redux...",
      tags: ["React", "JavaScript", "Frontend"],
      isPopular: true,
      progress: 0
    },
    {
      id: 2,
      title: "Node.js & Express Backend Development",
      instructor: "Trần Thị B",
      category: "programming",
      level: "intermediate",
      duration: "6 tuần",
      lessons: 38,
      students: 1890,
      rating: 4.7,
      price: "2,490,000",
      originalPrice: "3,290,000",
      image: "/api/placeholder/400/250",
      description: "Học cách xây dựng API backend mạnh mẽ với Node.js, Express, và MongoDB.",
      tags: ["Node.js", "Express", "Backend"],
      isPopular: false,
      progress: 0
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Lê Văn C",
      category: "design",
      level: "beginner",
      duration: "4 tuần",
      lessons: 28,
      students: 1560,
      rating: 4.9,
      price: "1,990,000",
      originalPrice: "2,790,000",
      image: "/api/placeholder/400/250",
      description: "Khóa học cơ bản về thiết kế UI/UX, từ nghiên cứu user đến prototyping và testing.",
      tags: ["UI Design", "UX Research", "Figma"],
      isPopular: true,
      progress: 0
    },
    {
      id: 4,
      title: "Data Science with Python",
      instructor: "Phạm Thị D",
      category: "data-science",
      level: "intermediate",
      duration: "10 tuần",
      lessons: 52,
      students: 980,
      rating: 4.6,
      price: "3,490,000",
      originalPrice: "4,490,000",
      image: "/api/placeholder/400/250",
      description: "Khám phá thế giới Data Science với Python, pandas, numpy, và machine learning.",
      tags: ["Python", "Data Analysis", "Machine Learning"],
      isPopular: false,
      progress: 0
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      instructor: "Hoàng Văn E",
      category: "marketing",
      level: "beginner",
      duration: "5 tuần",
      lessons: 32,
      students: 1240,
      rating: 4.5,
      price: "1,790,000",
      originalPrice: "2,490,000",
      image: "/api/placeholder/400/250",
      description: "Chiến lược marketing số toàn diện từ SEO, SEM đến social media marketing.",
      tags: ["SEO", "Google Ads", "Social Media"],
      isPopular: false,
      progress: 0
    },
    {
      id: 6,
      title: "Business Management Essentials",
      instructor: "Vũ Thị F",
      category: "business",
      level: "beginner",
      duration: "6 tuần",
      lessons: 35,
      students: 890,
      rating: 4.4,
      price: "2,290,000",
      originalPrice: "2,990,000",
      image: "/api/placeholder/400/250",
      description: "Những kỹ năng quản lý cần thiết cho lãnh đạo doanh nghiệp hiệu quả.",
      tags: ["Management", "Leadership", "Strategy"],
      isPopular: false,
      progress: 0
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Khóa học</h1>
          <p className="text-gray-600">Khám phá hàng trăm khóa học chất lượng cao từ các chuyên gia hàng đầu</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Lọc khóa học</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tên khóa học, giảng viên..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Từ khóa phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'Python', 'UI/UX', 'Node.js', 'Marketing'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Tìm thấy <strong>{filteredCourses.length}</strong> khóa học
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="popular">Phổ biến nhất</option>
                    <option value="newest">Mới nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        {course.isPopular && (
                          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Phổ biến
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          {course.lessons} bài học
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-2 flex-1">{course.title}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">Gi강ng viên: {course.instructor}</p>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-bold text-blue-600">{course.price}đ</span>
                            <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}đ</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {course.level === 'beginner' ? 'Cơ bản' : 
                             course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                          </span>
                        </div>
                        
                        <Link 
                          href={`/courses/${course.id}`}
                          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Đăng ký ngay</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="flex">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-64 h-40 object-cover"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-2">Giảng viên: {course.instructor}</p>
                            <p className="text-gray-600 mb-4">{course.description}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{course.lessons} bài học</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{course.students.toLocaleString()} học viên</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{course.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-6">
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-blue-600">{course.price}đ</span>
                              <span className="text-sm text-gray-500 line-through block">{course.originalPrice}đ</span>
                            </div>
                            
                            <Link 
                              href={`/courses/${course.id}`}
                              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                            >
                              <Play className="w-4 h-4" />
                              <span>Đăng ký</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
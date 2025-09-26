'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Target, 
  BookOpen, 
  Briefcase, 
  Trophy, 
  Calendar, 
  BarChart3, 
  MessageCircle,
  Bell,
  Settings,
  Search,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Play,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - trong thực tế sẽ lấy từ API
  const userProfile = {
    name: "Nguyễn Văn A",
    avatar: "/api/placeholder/60/60",
    careerGoal: "Full-stack Developer",
    completedCourses: 12,
    totalCourses: 20,
    skillLevel: 65,
    streak: 15
  };

  const recentActivities = [
    { id: 1, type: 'course', title: 'Hoàn thành khóa "React Cơ bản"', time: '2 giờ trước', icon: CheckCircle, color: 'text-green-600' },
    { id: 2, type: 'assessment', title: 'Làm bài kiểm tra "JavaScript ES6"', time: '1 ngày trước', icon: Trophy, color: 'text-yellow-600' },
    { id: 3, type: 'mentor', title: 'Cuộc gọi với mentor John Doe', time: '2 ngày trước', icon: MessageCircle, color: 'text-blue-600' },
  ];

  const recommendedCourses = [
    { 
      id: 1, 
      title: "Node.js Backend Development", 
      instructor: "Trần Minh B", 
      duration: "4 tuần", 
      level: "Trung cấp",
      rating: 4.8,
      students: 1520,
      image: "/api/placeholder/300/180"
    },
    { 
      id: 2, 
      title: "Database Design với MongoDB", 
      instructor: "Lê Thị C", 
      duration: "3 tuần", 
      level: "Cơ bản",
      rating: 4.6,
      students: 890,
      image: "/api/placeholder/300/180"
    },
    { 
      id: 3, 
      title: "DevOps với Docker & AWS", 
      instructor: "Phạm Văn D", 
      duration: "6 tuần", 
      level: "Nâng cao",
      rating: 4.9,
      students: 650,
      image: "/api/placeholder/300/180"
    }
  ];

  const upcomingEvents = [
    { id: 1, title: "Tech Talk: AI trong lập trình", date: "28/09/2025", time: "19:00", type: "webinar" },
    { id: 2, title: "Workshop: Git & GitHub", date: "02/10/2025", time: "14:00", type: "workshop" },
    { id: 3, title: "Career Fair 2025", date: "15/10/2025", time: "09:00", type: "event" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center mb-6">
                <img 
                  src="/api/placeholder/80/80" 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                <p className="text-gray-600">{userProfile.careerGoal}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiến độ học tập</span>
                  <span className="text-sm font-semibold">{userProfile.completedCourses}/{userProfile.totalCourses}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(userProfile.completedCourses / userProfile.totalCourses) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cấp độ kỹ năng</span>
                  <span className="text-sm font-semibold">{userProfile.skillLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${userProfile.skillLevel}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold">Chuỗi học tập</span>
                </div>
                <p className="text-center text-2xl font-bold text-blue-600">{userProfile.streak} ngày</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Link href="/assessment" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Làm bài đánh giá</span>
                </Link>
                <Link href="/courses" className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Tìm khóa học</span>
                </Link>
                <Link href="/mentors" className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Tìm mentor</span>
                </Link>
                <Link href="/jobs" className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium">Tìm việc làm</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-6 mb-8">
              <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại, {userProfile.name}!</h1>
              <p className="opacity-90">Hôm nay là một ngày tuyệt vời để tiếp tục hành trình phát triển sự nghiệp của bạn.</p>
              <div className="flex items-center space-x-4 mt-4">
                <Link href="/courses" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Tiếp tục học tập
                </Link>
                <Link href="/assessment" className="bg-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-300 transition-colors">
                  Đánh giá năng lực
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Khóa học hoàn thành</p>
                    <p className="text-2xl font-bold text-green-600">{userProfile.completedCourses}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Giờ học tích lũy</p>
                    <p className="text-2xl font-bold text-blue-600">127</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chứng chỉ đạt được</p>
                    <p className="text-2xl font-bold text-purple-600">8</p>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Điểm trung bình</p>
                    <p className="text-2xl font-bold text-yellow-600">8.5</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity & Recommended Courses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Hoạt động gần đây</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/activity" className="text-blue-600 text-sm font-medium hover:underline mt-4 inline-block">
                  Xem tất cả hoạt động
                </Link>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Sự kiện sắp tới</h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date} - {event.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.type === 'webinar' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'workshop' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Khóa học được đề xuất</h3>
                <Link href="/courses" className="text-blue-600 text-sm font-medium hover:underline">
                  Xem tất cả
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">Giảng viên: {course.instructor}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{course.duration}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{course.level}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                        <span className="text-gray-500">{course.students} học viên</span>
                      </div>
                      
                      <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Bắt đầu học</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
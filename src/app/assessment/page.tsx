'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  Target, 
  ChevronRight, 
  Play, 
  Trophy, 
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function AssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  const assessmentCategories = [
    {
      id: 'personality',
      title: 'Đánh giá tính cách nghề nghiệp',
      description: 'Khám phá kiểu tính cách và phong cách làm việc phù hợp',
      icon: '🧠',
      color: 'blue',
      assessments: [
        {
          id: 1,
          title: 'MBTI - Chỉ số Myers-Briggs',
          description: 'Xác định kiểu tính cách và xu hướng nghề nghiệp của bạn',
          duration: '15-20 phút',
          questions: 60,
          participants: 15420,
          difficulty: 'Cơ bản',
          rating: 4.8,
          isPopular: true
        },
        {
          id: 2,
          title: 'DISC Assessment',
          description: 'Đánh giá phong cách giao tiếp và lãnh đạo',
          duration: '10-15 phút',
          questions: 40,
          participants: 8930,
          difficulty: 'Cơ bản',
          rating: 4.6,
          isPopular: false
        }
      ]
    },
    {
      id: 'skills',
      title: 'Đánh giá kỹ năng chuyên môn',
      description: 'Kiểm tra kiến thức và kỹ năng trong lĩnh vực cụ thể',
      icon: '⚡',
      color: 'green',
      assessments: [
        {
          id: 3,
          title: 'Lập trình Front-end',
          description: 'Đánh giá kỹ năng HTML, CSS, JavaScript, React',
          duration: '30-45 phút',
          questions: 50,
          participants: 5670,
          difficulty: 'Trung cấp',
          rating: 4.7,
          isPopular: true
        },
        {
          id: 4,
          title: 'Digital Marketing',
          description: 'Kiểm tra kiến thức về SEO, SEM, Social Media',
          duration: '25-35 phút',
          questions: 45,
          participants: 3240,
          difficulty: 'Cơ bản',
          rating: 4.5,
          isPopular: false
        },
        {
          id: 5,
          title: 'UI/UX Design',
          description: 'Đánh giá hiểu biết về thiết kế trải nghiệm người dùng',
          duration: '20-30 phút',
          questions: 35,
          participants: 4150,
          difficulty: 'Trung cấp',
          rating: 4.6,
          isPopular: false
        }
      ]
    },
    {
      id: 'career',
      title: 'Định hướng nghề nghiệp',
      description: 'Tìm hiểu ngành nghề và lộ trình sự nghiệp phù hợp',
      icon: '🎯',
      color: 'purple',
      assessments: [
        {
          id: 6,
          title: 'Khám phá sở thích nghề nghiệp',
          description: 'Xác định lĩnh vực công việc phù hợp với đam mê',
          duration: '20-25 phút',
          questions: 80,
          participants: 12350,
          difficulty: 'Cơ bản',
          rating: 4.9,
          isPopular: true
        },
        {
          id: 7,
          title: 'Đánh giá năng lực lãnh đạo',
          description: 'Kiểm tra tiềm năng quản lý và lãnh đạo',
          duration: '15-20 phút',
          questions: 30,
          participants: 2890,
          difficulty: 'Nâng cao',
          rating: 4.4,
          isPopular: false
        }
      ]
    }
  ];

  const myResults = [
    {
      id: 1,
      title: 'MBTI - Chỉ số Myers-Briggs',
      result: 'ENFP - The Campaigner',
      score: 85,
      date: '15/09/2025',
      category: 'Tính cách'
    },
    {
      id: 2,
      title: 'Lập trình Front-end',
      result: 'Thành thạo',
      score: 78,
      date: '10/09/2025',
      category: 'Kỹ năng'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white p-8 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Đánh giá năng lực & Định hướng nghề nghiệp</h1>
            <p className="text-xl opacity-90 mb-6">
              Khám phá tiềm năng, xác định điểm mạnh và tìm ra con đường sự nghiệp phù hợp với bạn
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Định hướng chính xác</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Chứng chỉ uy tín</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>50,000+ người tham gia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Kết quả của tôi</h3>
              {myResults.length > 0 ? (
                <div className="space-y-4">
                  {myResults.map((result) => (
                    <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{result.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{result.category} • {result.date}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">{result.result}</span>
                        <span className="text-sm text-gray-500">{result.score}%</span>
                      </div>
                    </div>
                  ))}
                  <Link href="/assessment/results" className="text-blue-600 text-sm font-medium hover:underline">
                    Xem tất cả kết quả
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có kết quả đánh giá nào</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Gợi ý cho bạn</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800 mb-1">Bắt đầu với MBTI</h4>
                  <p className="text-sm text-blue-600">Khám phá tính cách nghề nghiệp của bạn</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800 mb-1">Đánh giá kỹ năng</h4>
                  <p className="text-sm text-green-600">Xác định trình độ chuyên môn hiện tại</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Assessment Categories */}
            <div className="space-y-8">
              {assessmentCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{category.title}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {category.assessments.map((assessment) => (
                      <div key={assessment.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{assessment.title}</h3>
                              {assessment.isPopular && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Phổ biến
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{assessment.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>{assessment.questions} câu hỏi</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{assessment.participants.toLocaleString()} lượt</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{assessment.rating}/5</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            assessment.difficulty === 'Cơ bản' ? 'bg-green-100 text-green-800' :
                            assessment.difficulty === 'Trung cấp' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {assessment.difficulty}
                          </span>
                        </div>

                        <button 
                          onClick={() => setSelectedAssessment(assessment)}
                          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Bắt đầu đánh giá</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-center mb-6">Tại sao nên thực hiện đánh giá?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Định hướng chính xác</h3>
                  <p className="text-gray-600">Xác định rõ ràng điểm mạnh, sở thích và con đường nghề nghiệp phù hợp</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Nhận chứng chỉ</h3>
                  <p className="text-gray-600">Được cấp chứng chỉ có giá trị sau khi hoàn thành đánh giá</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChevronRight className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Lộ trình cá nhân hóa</h3>
                  <p className="text-gray-600">Nhận gợi ý khóa học và lộ trình phát triển phù hợp với kết quả</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">{selectedAssessment.title}</h2>
                <p className="text-gray-600 mb-6">{selectedAssessment.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">{selectedAssessment.duration}</p>
                    <p className="text-xs text-gray-500">Thời gian</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">{selectedAssessment.questions}</p>
                    <p className="text-xs text-gray-500">Câu hỏi</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">{selectedAssessment.participants.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Lượt tham gia</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2 fill-current" />
                    <p className="text-sm font-medium">{selectedAssessment.rating}/5</p>
                    <p className="text-xs text-gray-500">Đánh giá</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Hướng dẫn thực hiện
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Đọc kỹ từng câu hỏi và chọn đáp án phù hợp nhất</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Trả lời một cách trung thực để có kết quả chính xác nhất</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Không có đáp án đúng hay sai, chỉ cần chọn phù hợp với bạn</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bạn có thể tạm dừng và tiếp tục sau nếu cần thiết</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <Link
                  href={`/assessment/${selectedAssessment.id}`}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Bắt đầu ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
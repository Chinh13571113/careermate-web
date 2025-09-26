'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Check, User, Target, BookOpen, Briefcase } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Chào mừng đến với CareerMate",
    icon: User,
    description: "Hệ thống định hướng nghề nghiệp thông minh",
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Chào mừng đến với CareerMate!</h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          CareerMate là nền tảng định hướng nghề nghiệp giúp bạn khám phá tiềm năng, 
          xác định mục tiêu và xây dựng lộ trình sự nghiệp phù hợp.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Định hướng rõ ràng</h3>
            <p className="text-sm text-gray-600">Xác định con đường nghề nghiệp phù hợp</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Học tập cá nhân hóa</h3>
            <p className="text-sm text-gray-600">Lộ trình học tập được tùy chỉnh</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Kết nối cơ hội</h3>
            <p className="text-sm text-gray-600">Tìm kiếm việc làm và thực tập</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Tạo hồ sơ cá nhân",
    icon: User,
    description: "Xây dựng thông tin cá nhân và sở thích",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Tạo hồ sơ cá nhân</h2>
          <p className="text-gray-600 mt-2">Cung cấp thông tin để chúng tôi hiểu bạn hơn</p>
        </div>
        
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-800">Thông tin cơ bản</h3>
            <p className="text-sm text-blue-600">Họ tên, tuổi, địa chỉ, trình độ học vấn</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-semibold text-purple-800">Sở thích & kỹ năng</h3>
            <p className="text-sm text-purple-600">Những gì bạn yêu thích và giỏi về</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800">Mục tiêu nghề nghiệp</h3>
            <p className="text-sm text-green-600">Định hướng và ngành nghề quan tâm</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Khám phá nghề nghiệp",
    icon: Target,
    description: "Tìm hiểu các ngành nghề phù hợp với bạn",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Khám phá nghề nghiệp</h2>
          <p className="text-gray-600 mt-2">Tìm hiểu các cơ hội nghề nghiệp phù hợp</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="font-semibold mb-2">Công nghệ thông tin</h3>
            <p className="text-sm text-gray-600">Lập trình, phát triển web, AI, cybersecurity</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold mb-2">Kinh doanh & Marketing</h3>
            <p className="text-sm text-gray-600">Quản trị, digital marketing, sales</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold mb-2">Thiết kế & Sáng tạo</h3>
            <p className="text-sm text-gray-600">UI/UX, graphic design, content creation</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="font-semibold mb-2">Y tế & Sức khỏe</h3>
            <p className="text-sm text-gray-600">Bác sĩ, y tá, dược sĩ, dinh dưỡng</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Lộ trình học tập",
    icon: BookOpen,
    description: "Xây dựng kế hoạch học tập cá nhân hóa",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Lộ trình học tập</h2>
          <p className="text-gray-600 mt-2">Kế hoạch học tập được tùy chỉnh cho bạn</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Đánh giá năng lực hiện tại</h3>
                <p className="text-sm text-green-600">Kiểm tra kiến thức và kỹ năng của bạn</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800">Xác định mục tiêu</h3>
                <p className="text-sm text-blue-600">Đặt ra các mục tiêu học tập cụ thể</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800">Lộ trình cá nhân hóa</h3>
                <p className="text-sm text-purple-600">Khóa học và tài liệu phù hợp</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Theo dõi tiến độ</h3>
                <p className="text-sm text-orange-600">Cập nhật và điều chỉnh kế hoạch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Bắt đầu hành trình",
    icon: Briefcase,
    description: "Sẵn sàng để bắt đầu định hướng nghề nghiệp",
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Sẵn sàng bắt đầu!</h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Bạn đã hoàn tất quá trình định hướng ban đầu. 
          Hãy bắt đầu hành trình khám phá và phát triển sự nghiệp của mình!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mt-8">
          <Link href="/courses" className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors block text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2" />
            <span className="font-semibold">Khám phá nghề nghiệp</span>
          </Link>
          <Link href="/courses" className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors block text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2" />
            <span className="font-semibold">Bắt đầu học tập</span>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Tiếp theo bạn có thể:</h3>
          <div className="text-left max-w-md mx-auto space-y-2">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Tham gia các bài kiểm tra định hướng</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Xem các khóa học được đề xuất</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Kết nối với mentor và cộng đồng</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Tìm kiếm cơ hội thực tập và việc làm</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export default function GuidancePage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header với progress bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Định hướng nghề nghiệp</h1>
            <span className="text-sm text-gray-600">
              Bước {currentStep + 1} / {steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  index === currentStep
                    ? 'bg-blue-100 text-blue-700'
                    : index < currentStep
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === currentStep
                    ? 'bg-blue-500 text-white'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px]">
            {steps[currentStep].content}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <span>Vào Dashboard</span>
                <Check className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <span>Tiếp theo</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
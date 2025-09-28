
import Link from 'next/link';
import { ArrowRight, Target, BookOpen, Users, TrendingUp, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Chào mừng đến với <span className="text-blue-600">CareerMate</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nền tảng định hướng nghề nghiệp thông minh giúp bạn khám phá tiềm năng, 
            xác định mục tiêu và xây dựng lộ trình sự nghiệp phù hợp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/guidance"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <span>Bắt đầu định hướng</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-gray-200 shadow-md hover:shadow-lg">
              <span>Tìm hiểu thêm</span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Định hướng rõ ràng</h3>
            <p className="text-gray-600">
              Xác định con đường nghề nghiệp phù hợp với năng lực và sở thích của bạn
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Học tập cá nhân hóa</h3>
            <p className="text-gray-600">
              Lộ trình học tập được tùy chỉnh dựa trên mục tiêu và trình độ của bạn
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <Link href="/cv-templates" className="block h-full">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Tạo CV chuyên nghiệp</h3>
              <p className="text-gray-600">
                Công cụ tạo CV với nhiều template đẹp mắt và chuyên nghiệp
              </p>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Cộng đồng mentor</h3>
            <p className="text-gray-600">
              Kết nối với các chuyên gia và mentor trong lĩnh vực bạn quan tâm
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Theo dõi tiến độ</h3>
            <p className="text-gray-600">
              Cập nhật tiến độ học tập và điều chỉnh mục tiêu phù hợp
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Sẵn sàng bắt đầu hành trình?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người dùng đã tìm được định hướng nghề nghiệp phù hợp 
            thông qua CareerMate. Bắt đầu ngay hôm nay!
          </p>
          <Link 
            href="/guidance"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <span>Khám phá ngay</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

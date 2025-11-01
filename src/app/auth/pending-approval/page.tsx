"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function PendingApprovalPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    // Log for debugging
    console.log("📋 [Pending Approval] User email:", email);
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-yellow-200">
          {/* Header with animated gradient */}
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4 animate-bounce">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Đang Chờ Phê Duyệt
              </h1>
              <p className="text-yellow-100 text-lg">
                Your Account is Under Review
              </p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Email Display */}
            {email && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Tài khoản của bạn
                  </p>
                  <p className="text-gray-800 font-medium truncate">{email}</p>
                </div>
              </div>
            )}

            {/* Main Message */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                <AlertCircle className="w-4 h-4" />
                <span>Trạng thái: Đang chờ duyệt</span>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Tài khoản của bạn đang được <span className="font-semibold text-yellow-600">Admin</span> xem xét và phê duyệt. 
                Vui lòng kiên nhẫn chờ đợi trong thời gian này.
              </p>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800">Đăng ký thành công</h3>
                  <p className="text-sm text-gray-600">Thông tin của bạn đã được gửi đi</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800">Đang xem xét</h3>
                  <p className="text-sm text-gray-600">Admin đang kiểm tra thông tin của bạn</p>
                </div>
              </div>

              <div className="flex items-start gap-4 opacity-50">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800">Phê duyệt hoàn tất</h3>
                  <p className="text-sm text-gray-600">Bạn sẽ nhận được thông báo qua email</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">Lưu ý quan trọng</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Quá trình phê duyệt thường mất <strong>1-2 ngày làm việc</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Bạn sẽ nhận được email thông báo khi tài khoản được phê duyệt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Đảm bảo kiểm tra cả thư mục spam/junk mail</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-4">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <span>Quay về trang chủ</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">
            Cần hỗ trợ? Liên hệ với chúng tôi qua email:{" "}
            <a href="mailto:support@careermate.com" className="text-yellow-600 hover:text-yellow-700 font-medium">
              support@careermate.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

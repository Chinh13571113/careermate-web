"use client";

import { Clock, Home, RefreshCcw, Edit3, XCircle, AlertCircle, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OAuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // "pending", "rejected", "error"
  const reason = searchParams.get("reason"); // reject reason nếu có
  const message = searchParams.get("message"); // error message
  const email = searchParams.get("email"); // user email if available
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (status === "pending") {
      setDisplayMessage("Tài khoản của bạn đang chờ admin duyệt. Vui lòng quay lại sau.");
    } else if (status === "rejected") {
      setDisplayMessage("Tài khoản recruiter của bạn đã bị từ chối bởi Admin.");
    } else if (message) {
      setDisplayMessage(decodeURIComponent(message));
    } else {
      setDisplayMessage("Đã xảy ra lỗi trong quá trình xác thực.");
    }
  }, [status, message]);

  const getStatusConfig = () => {
    if (status === "rejected") {
      return {
        bgColor: "from-red-50 via-orange-50 to-red-50",
        iconBg: "bg-gradient-to-br from-red-500 to-red-600",
        icon: <XCircle className="w-10 h-10 text-white" />,
        title: "Đăng Ký Bị Từ Chối",
        titleColor: "text-red-700",
        borderColor: "border-red-200",
      };
    } else if (status === "pending") {
      return {
        bgColor: "from-yellow-50 via-orange-50 to-amber-50",
        iconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
        icon: <Clock className="w-10 h-10 text-white" />,
        title: "Đang Chờ Duyệt",
        titleColor: "text-yellow-700",
        borderColor: "border-yellow-200",
      };
    } else {
      return {
        bgColor: "from-gray-50 via-blue-50 to-gray-50",
        iconBg: "bg-gradient-to-br from-gray-500 to-gray-600",
        icon: <AlertCircle className="w-10 h-10 text-white" />,
        title: "Xác Thực Thất Bại",
        titleColor: "text-gray-700",
        borderColor: "border-gray-200",
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgColor} flex items-center justify-center p-4`}>
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border ${config.borderColor}`}>
          {/* Header */}
          <div className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 ${config.iconBg} rounded-full shadow-lg mb-4 ${status === "pending" ? "animate-bounce" : ""}`}>
              {config.icon}
            </div>
            <h1 className={`text-3xl font-bold ${config.titleColor} mb-3`}>
              {config.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {displayMessage}
            </p>
          </div>

          {/* Email Display */}
          {email && (
            <div className="px-8 pb-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Tài khoản
                  </p>
                  <p className="text-gray-800 font-medium truncate">{email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {status === "rejected" && reason && (
            <div className="px-8 pb-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">Lý do từ chối:</h4>
                    <p className="text-red-800 leading-relaxed">
                      {decodeURIComponent(reason)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Message for Rejected Status */}
          {status === "rejected" && (
            <div className="px-8 pb-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Bước tiếp theo:</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Vui lòng cập nhật thông tin theo yêu cầu của Admin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Đảm bảo thông tin doanh nghiệp chính xác và đầy đủ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Sau khi cập nhật, tài khoản sẽ được xem xét lại</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-8 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex-1 inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                <Home className="w-5 h-5 mr-2" />
                Về Trang Chủ
              </button>

              {status === "rejected" ? (
                <button
                  onClick={() => router.push("/profile")}
                  className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Edit3 className="w-5 h-5 mr-2" />
                  Cập Nhật Thông Tin
                </button>
              ) : status === "pending" ? (
                <button
                  onClick={() => router.push("/auth/pending-approval")}
                  className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Xem Chi Tiết
                </button>
              ) : (
                <button
                  onClick={() => router.push("/sign-in")}
                  className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Thử Lại
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">
            Cần hỗ trợ? Liên hệ:{" "}
            <a 
              href="mailto:support@careermate.com" 
              className={`${status === "rejected" ? "text-red-600 hover:text-red-700" : status === "pending" ? "text-yellow-600 hover:text-yellow-700" : "text-blue-600 hover:text-blue-700"} font-medium hover:underline`}
            >
              support@careermate.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


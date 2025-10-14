"use client";

import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp,
  Calendar,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { getRoleDisplayName } from "@/lib/role-utils";

export default function RecruiterDashboard() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, role } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mock data - sẽ thay bằng API call thực
  const stats = [
    {
      title: "Jobs đang tuyển",
      value: "12",
      change: "+2 tuần này",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Đơn ứng tuyển",
      value: "48",
      change: "+12 hôm nay",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Ứng viên mới",
      value: "24",
      change: "+8 tuần này",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "32%",
      change: "+5% so với tháng trước",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      candidateName: "Nguyễn Văn A",
      position: "Senior Frontend Developer",
      appliedDate: "2024-10-14",
      status: "pending",
    },
    {
      id: 2,
      candidateName: "Trần Thị B",
      position: "Backend Developer",
      appliedDate: "2024-10-14",
      status: "reviewing",
    },
    {
      id: 3,
      candidateName: "Lê Văn C",
      position: "Full Stack Developer",
      appliedDate: "2024-10-13",
      status: "approved",
    },
    {
      id: 4,
      candidateName: "Phạm Thị D",
      position: "UI/UX Designer",
      appliedDate: "2024-10-13",
      status: "pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
      reviewing: { label: "Đang xem xét", color: "bg-blue-100 text-blue-800" },
      approved: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
      rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (!isHydrated) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng trở lại, {user?.name || "Recruiter"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Đây là tổng quan về hoạt động tuyển dụng của bạn
        </p>
        {role && (
          <span className="inline-block mt-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {getRoleDisplayName(role)}
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
            <p className="text-xs text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Đơn ứng tuyển gần đây
            </h2>
            <a
              href="/recruiter/applications"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Xem tất cả →
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.map((application) => {
                const statusBadge = getStatusBadge(application.status);
                return (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {application.candidateName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.candidateName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {application.appliedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/recruiter/jobs/new"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 flex items-center justify-between transition-colors group"
        >
          <div>
            <h3 className="font-semibold text-lg mb-1">Đăng tin tuyển dụng</h3>
            <p className="text-sm text-blue-100">Tạo job mới ngay</p>
          </div>
          <Briefcase className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="/recruiter/candidates"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 flex items-center justify-between transition-colors group"
        >
          <div>
            <h3 className="font-semibold text-lg mb-1">Tìm ứng viên</h3>
            <p className="text-sm text-purple-100">Xem database ứng viên</p>
          </div>
          <Users className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="/recruiter/analytics"
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 flex items-center justify-between transition-colors group"
        >
          <div>
            <h3 className="font-semibold text-lg mb-1">Xem thống kê</h3>
            <p className="text-sm text-green-100">Báo cáo & phân tích</p>
          </div>
          <TrendingUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}

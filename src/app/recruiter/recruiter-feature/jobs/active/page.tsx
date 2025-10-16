// export default function ActiveJobsPage() {
//     return (
//         <>
//             <header className="mb-6 flex items-center justify-between">
//                 <h1 className="text-xl font-semibold text-sky-800">Active Jobs</h1>
//             </header>
//             <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <p className="text-gray-600">Active jobs list will be implemented here.</p>
//             </div>
//         </>
//     );
// }

"use client";

import { Eye } from "lucide-react";
import React from "react";

// Component Placeholder Icon (Sử dụng Emoji)
interface PlaceholderIconProps {
  children: React.ReactNode;
  className?: string;
}

const PlaceholderIcon = ({
  children,
  className = "",
}: PlaceholderIconProps) => (
  <div className={`inline-block ${className}`}>{children}</div>
);

// Dữ liệu mẫu cho các tin tuyển dụng đang hoạt động
const activeJobsData = [
  {
    id: "J001",
    title: "Software Engineering (Backend)",
    applicants: 45,
    views: 1250,
    status: "Active",
    postedDate: "2025-09-01",
    expiresIn: 7, // Ngày còn lại
    isBoosted: true,
  },
  {
    id: "J002",
    title: "Bridge Software Engineer (BrSE)",
    applicants: 120,
    views: 2800,
    status: "Expiring Soon",
    postedDate: "2025-09-15",
    expiresIn: 2,
    isBoosted: false,
  },
  {
    id: "J003",
    title: "Software Engineering (Fullstack)",
    applicants: 8,
    views: 550,
    status: "Active",
    postedDate: "2025-10-01",
    expiresIn: 20,
    isBoosted: false,
  },
];

export default function ActiveJobsPage() {
  return (
    <div className="p-4 sm:p-0">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Tin Tuyển Dụng Đang Hoạt Động
        </h1>
        <span className="text-sm text-gray-500">
          Quản lý hiệu suất và gia hạn tin đăng
        </span>
      </header>

      {/* Thanh Tìm kiếm và Bộ lọc */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề hoặc ID công việc..."
          className="flex-grow w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150"
        />

        <select className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150">
          <option value="">Lọc theo Trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="expiring">Gần hết hạn</option>
          <option value="boosted">Đã tăng tốc</option>
        </select>
      </div>

      {/* Bảng Danh sách Tin Đang Hoạt Động */}
      <div className="rounded-lg border bg-white shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Công việc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeJobsData.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <span className="block">{job.title}</span>
                  <span className="text-xs text-gray-400">ID: {job.id}</span>
                  {job.isBoosted && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <PlaceholderIcon className="mr-1 text-sm leading-none">
                        ⚡
                      </PlaceholderIcon>{" "}
                      BOOSTED
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                  {job.views.toLocaleString('en-US')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-sky-600">
                  {job.applicants}
                  <button
                    onClick={() => console.log(`Xem ứng viên ${job.id}`)}
                    className="ml-2 text-xs text-gray-500 hover:text-sky-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold 
                                        ${
                                          job.expiresIn <= 3
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                  >
                    <PlaceholderIcon className="mr-1 text-sm leading-none">
                      📅
                    </PlaceholderIcon>
                    {job.expiresIn} day left
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => console.log(`Xem thống kê ${job.id}`)}
                    className="text-gray-500 hover:text-gray-700 transition duration-150 mr-3"
                    title="Xem thống kê"
                  >
                    <PlaceholderIcon className="text-lg leading-none">
                      📊
                    </PlaceholderIcon>
                  </button>
                  <button
                    onClick={() => console.log(`Gia hạn ${job.id}`)}
                    className="text-green-600 hover:text-green-800 transition duration-150 mr-3"
                    title="Gia hạn"
                  >
                    <PlaceholderIcon className="text-lg leading-none">
                      🔄
                    </PlaceholderIcon>
                  </button>
                  <button
                    onClick={() => console.log(`Dừng/Chỉnh sửa ${job.id}`)}
                    className="text-sky-600 hover:text-sky-800 transition duration-150"
                    title="Dừng/Chỉnh sửa"
                  >
                    <PlaceholderIcon className="text-lg leading-none">
                      ✏️
                    </PlaceholderIcon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Khu vực thông báo (Gia hạn khẩn cấp) */}
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 shadow-sm">
        <PlaceholderIcon className="mr-2 text-xl leading-none">
          ⚠️
        </PlaceholderIcon>
        **Chú ý:** Tin **Marketing Digital** chỉ còn 2 ngày nữa là hết hạn. Hãy
        **gia hạn** ngay để tránh gián đoạn tuyển dụng!
      </div>
    </div>
  );
}

// export default function DraftJobsPage() {
//     return (
//         <>
//             <header className="mb-6 flex items-center justify-between">
//                 <h1 className="text-xl font-semibold text-sky-800">Draft Jobs</h1>
//             </header>
//             <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <p className="text-gray-600">Draft jobs list will be implemented here.</p>
//             </div>
//         </>
//     );
// }

"use client";

import React from "react";

// Component Placeholder Icon (Sử dụng Emoji)
interface PlaceholderIconProps {
    children: React.ReactNode;
    className?: string;
}

const PlaceholderIcon = ({ children, className = "" }: PlaceholderIconProps) => (
    <div className={`inline-block ${className}`}>{children}</div>
);
// Dữ liệu mẫu cho các tin tuyển dụng nháp
const draftJobsData = [
    {
        id: 1,
        title: "Kỹ sư Phần mềm Senior (Backend)",
        date: "2025-10-10",
        status: "Chưa Hoàn thành",
        progress: "60%",
    },
    {
        id: 2,
        title: "Chuyên viên Marketing Digital (HCM)",
        date: "2025-10-08",
        status: "Cần xem xét",
        progress: "90%",
    },
    {
        id: 3,
        title: "Thực tập sinh Thiết kế UI/UX",
        date: "2025-10-05",
        status: "Chưa Hoàn thành",
        progress: "45%",
    },
];

export default function DraftJobsPage() {
    return (
        <div className="p-4 sm:p-0">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Tin Tuyển Dụng Nháp</h1>
                <span className="text-sm text-gray-500">Quản lý tin đăng chưa hoàn thành</span>
            </header>

            {/* Thanh Tìm kiếm và CTA */}
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề..."
                    className="flex-grow w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                />
                
                {/* Nút tạo tin mới */}
                <button
                    onClick={() => console.log('Tạo tin tuyển dụng mới')}
                    className="w-full md:w-auto px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700 transition duration-300 flex items-center justify-center"
                >
                    <PlaceholderIcon className="mr-2 text-xl leading-none">+</PlaceholderIcon> Tạo Tin Đăng Mới
                </button>
            </div>

            {/* Bảng Danh sách Tin Nháp */}
            <div className="rounded-lg border bg-white shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề công việc
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái & Tiến độ
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {draftJobsData.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {job.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                    {job.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="text-gray-600 font-medium block mb-1">
                                        {job.status}
                                    </span>
                                    {/* Thanh tiến độ đơn giản */}
                                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full bg-amber-400"
                                            style={{ width: job.progress }}
                                            title={`Tiến độ: ${job.progress}`}
                                        ></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => console.log(`Chỉnh sửa nháp ${job.id}`)}
                                        className="text-sky-600 hover:text-sky-900 transition duration-150 mr-3"
                                        title="Chỉnh sửa"
                                    >
                                        <PlaceholderIcon className="text-lg leading-none">✏️</PlaceholderIcon>
                                    </button>
                                    <button
                                        onClick={() => console.log(`Đăng tin ${job.id}`)}
                                        className="text-green-600 hover:text-green-900 transition duration-150 mr-3"
                                        title="Đăng tin"
                                    >
                                        <PlaceholderIcon className="text-lg leading-none">✅</PlaceholderIcon>
                                    </button>
                                    <button
                                        onClick={() => console.log(`Xóa nháp ${job.id}`)}
                                        className="text-red-600 hover:text-red-900 transition duration-150"
                                        title="Xóa nháp"
                                    >
                                        <PlaceholderIcon className="text-lg leading-none">🗑️</PlaceholderIcon>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Trường hợp không có tin nháp */}
            {draftJobsData.length === 0 && (
                <div className="mt-8 p-10 text-center bg-white rounded-lg border border-dashed border-gray-300 shadow-inner">
                    <PlaceholderIcon className="text-5xl text-gray-400 mx-auto block mb-4">📂</PlaceholderIcon>
                    <p className="text-lg text-gray-600 font-medium">Bạn chưa có tin tuyển dụng nháp nào.</p>
                    <p className="text-sm text-gray-500 mt-2">Bấm nút "Tạo Tin Đăng Mới" để bắt đầu.</p>
                </div>
            )}
        </div>
    );
}
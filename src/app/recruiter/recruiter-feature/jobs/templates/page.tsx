// export default function JobTemplatesPage() {
//     return (
//         <>
//             <header className="mb-6 flex items-center justify-between">
//                 <h1 className="text-xl font-semibold text-sky-800">Job Templates</h1>
//             </header>
//             <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <p className="text-gray-600">Job templates will be implemented here.</p>
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

// Dữ liệu mẫu cho các Template
const templatesData = [
    {
        id: 1,
        title: "Kỹ sư Phần mềm (Full-Stack)",
        category: "Công nghệ thông tin",
        description: "Mô tả công việc chi tiết cho vị trí Full-Stack, bao gồm yêu cầu về kinh nghiệm và kỹ năng NodeJS/React.",
        uses: 45,
    },
    {
        id: 2,
        title: "Chuyên viên Marketing Digital",
        category: "Marketing",
        description: "Mẫu dành cho vị trí Marketing Digital, nhấn mạnh vào SEO, SEM và quản lý chiến dịch quảng cáo.",
        uses: 68,
    },
    {
        id: 3,
        title: "Kế toán Tổng hợp",
        category: "Tài chính/Kế toán",
        description: "Mẫu chuẩn hóa theo quy định, tập trung vào kỹ năng báo cáo thuế và quản lý sổ sách.",
        uses: 22,
    },
    {
        id: 4,
        title: "Quản lý Dự án (PM)",
        category: "Quản lý",
        description: "Mẫu chi tiết cho vị trí Quản lý Dự án sử dụng phương pháp Agile/Scrum.",
        uses: 15,
    },
];

export default function JobTemplatesPage() {
    return (
        <div className="p-4 sm:p-0">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Mẫu Tin Tuyển Dụng</h1>
                {/* Nút tạo Template tùy chỉnh */}
                <button
                    onClick={() => console.log('Mở trang tạo mẫu mới')}
                    className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700 transition duration-300 flex items-center justify-center text-sm"
                >
                    <PlaceholderIcon className="mr-2 text-xl leading-none">✨</PlaceholderIcon> Tạo Mẫu Tùy Chỉnh
                </button>
            </header>

            {/* Thanh Tìm kiếm và Bộ lọc */}
            <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <input
                    type="text"
                    placeholder="Tìm kiếm mẫu theo tiêu đề hoặc ngành nghề..."
                    className="flex-grow w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                />
                
                <select 
                    className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                >
                    <option value="">Lọc theo Ngành nghề</option>
                    <option value="it">Công nghệ thông tin</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Tài chính/Kế toán</option>
                </select>
            </div>

            {/* Danh sách Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templatesData.map((template) => (
                    <div 
                        key={template.id} 
                        className="bg-white p-6 rounded-lg border border-gray-200 shadow-md flex flex-col transition duration-300 hover:shadow-lg hover:border-sky-400"
                    >
                        <span className="text-xs font-medium text-sky-600 mb-1 uppercase tracking-wider">
                            {template.category}
                        </span>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                            {template.title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                            {template.description}
                        </p>
                        
                        <div className="flex justify-between items-center border-t pt-4 mt-auto">
                            <span className="text-xs text-gray-400 flex items-center">
                                <PlaceholderIcon className="mr-1 text-sm leading-none">🔥</PlaceholderIcon>
                                Đã dùng {template.uses} lần
                            </span>
                            <button
                                onClick={() => console.log(`Sử dụng mẫu ${template.id}`)}
                                className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Sử Dụng Ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thông báo nếu chưa có templates */}
            {templatesData.length === 0 && (
                <div className="mt-8 p-10 text-center bg-white rounded-lg border border-dashed border-gray-300 shadow-inner">
                    <PlaceholderIcon className="text-5xl text-gray-400 mx-auto block mb-4">📚</PlaceholderIcon>
                    <p className="text-lg text-gray-600 font-medium">Chưa có mẫu nào được lưu.</p>
                    <p className="text-sm text-gray-500 mt-2">Bấm nút "Tạo Mẫu Tùy Chỉnh" để lưu mẫu đầu tiên của bạn.</p>
                </div>
            )}
        </div>
    );
}
"use client";

import { Users, Briefcase, Eye, TrendingUp, Calendar, FileText, Search, BarChart3, User, Building } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecruiterDashboardPage() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/recruiter/jobs/create");
    };
    
    return (
        <>
            {/* Header with greeting and summary */}
            <div className="mb-6 bg-gradient-to-r from-[#e8f1fe] to-[#ccdff9] rounded-lg p-6">
                {/* Top section with greeting and stats */}
                <div className="flex items-start justify-between mb-6">
                    {/* Left: Greeting and intro */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-[#313131] mb-3">
                            Xin chào, <span className="text-[#ff2f2f]">Ronaldo</span> đến với CareerMate! 🎉
                        </h1>
                    </div>
                </div>

                {/* Bottom section with welcome message and illustration */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Welcome content */}
                    <div className="lg:col-span-2">
                        <p className="text-[#313131] mb-4">
                            Bạn đã đăng ký thành công! Hãy bắt đầu tuyển dụng nhân tài tốt nhất cho công ty của bạn.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleClick}
                                className="rounded-lg bg-[#24497b] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#436a9d]"
                            >
                                Đăng việc làm đầu tiên
                            </button>
                            <button className="rounded-lg border border-[#96add0] px-6 py-2.5 text-sm font-medium text-[#436a9d] transition-colors hover:bg-[#fff]">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="lg:col-span-1">
                        <div className=" flex items-center justify-center">
                            <div className="text-center">
                                <img src="/img/dashboard1.png" alt="Dashboard 1"/> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Việc làm đã đăng</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Ứng viên</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-yellow-100 p-3">
                            <Eye className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tỷ lệ phù hợp</p>
                            <p className="text-2xl font-bold text-gray-900">0%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout for Điểm khả dụng and Tất cả công việc */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Left Column - Điểm khả dụng */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Điểm khả dụng</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg bg-orange-50">
                            <div className="text-2xl font-bold text-orange-500">0</div>
                            <div className="text-sm text-gray-600">Điểm đăng tuyển</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-orange-50">
                            <div className="text-2xl font-bold text-orange-500">0</div>
                            <div className="text-sm text-gray-600">Điểm xem hồ sơ</div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Tất cả công việc */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Tất cả công việc</h3>
                    <div className="flex items-center justify-center h-20">
                        <div className="text-center">
                            <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">Không có dữ liệu cho báo cáo này</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quản lý nhanh tin đăng */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Quản lý nhanh tin đăng</h3>
                <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <img src="/img/dashboard2.png" alt="No jobs" className="h-24 w-auto mx-auto mb-3 pl-16 object-contain" />
                        <p className="text-gray-500">Không có việc làm nào</p>
                    </div>
                </div>
            </div>

            {/* Two Column Layout for Status and Candidates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Left Column - Trạng thái tin đăng */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Trạng thái tin đăng</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3">
                            <div className="text-xl font-bold text-green-500">0</div>
                            <div className="text-sm text-gray-600">Đang hiển thị</div>
                        </div>
                        <div className="p-3">
                            <div className="text-xl font-bold text-gray-500">0</div>
                            <div className="text-sm text-gray-600">Đang ẩn</div>
                        </div>
                        <div className="p-3">
                            <div className="text-xl font-bold text-gray-500">0</div>
                            <div className="text-sm text-gray-600">Nháp</div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3">
                            <div className="text-xl font-bold text-orange-500">0</div>
                            <div className="text-sm text-gray-600">Việc làm ko</div>
                        </div>
                        <div className="p-3">
                            <div className="text-xl font-bold text-red-500">0</div>
                            <div className="text-sm text-gray-600">Hết hạn</div>
                        </div>
                        <div className="p-3">
                            <div className="text-xl font-bold text-yellow-500">0</div>
                            <div className="text-sm text-gray-600">Hết hạn trong 7 ngày</div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Ứng viên vừa cập nhật */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Ứng viên vừa cập nhật</h3>
                        <div className="text-sm text-gray-500">1/5</div>
                    </div>
                    
                    {/* Sample candidate */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">Brain Victor Solomon</h4>
                                <p className="text-sm text-gray-600">Tiêu đề: Technical Specialist</p>
                                <p className="text-sm text-gray-600">Kinh nghiệm: 8 năm</p>
                                <p className="text-sm text-gray-600">Vị trí: Hà Nội, Hồ Chí Minh</p>
                                <p className="text-sm text-gray-600">Lương: $1500</p>
                            </div>
                        </div>
                        <div className="mt-3 text-right">
                            <span className="text-xs text-gray-400">Cập nhật 2 giờ trước</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Hành động nhanh</h3>
                    <div className="space-y-3">
                        <button className="w-full rounded-lg border border-sky-200 p-3 text-left transition-colors hover:bg-sky-50">
                            <p className="font-medium text-sky-800">Đăng tin tuyển dụng mới</p>
                            <p className="text-sm text-sky-600">Tạo và đăng việc làm để thu hút ứng viên</p>
                        </button>
                        <button className="w-full rounded-lg border border-sky-200 p-3 text-left transition-colors hover:bg-sky-50">
                            <p className="font-medium text-sky-800">Tìm kiếm ứng viên</p>
                            <p className="text-sm text-sky-600">Duyệt qua cơ sở dữ liệu ứng viên</p>
                        </button>
                        <button className="w-full rounded-lg border border-sky-200 p-3 text-left transition-colors hover:bg-sky-50">
                            <p className="font-medium text-sky-800">Hoàn thiện hồ sơ công ty</p>
                            <p className="text-sm text-sky-600">Cập nhật thông tin chi tiết về công ty</p>
                        </button>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                    <div className="text-center py-8">
                        <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
                            <img src="/img/dashboard3.png" alt="Dashboard 3"/>
                        </div>
                        <p className="text-gray-500">Chưa có hoạt động nào</p>
                        <p className="text-sm text-gray-400">Các hoạt động của bạn sẽ hiển thị ở đây</p>
                    </div>
                </div>
            </div>
        </>
    );
}

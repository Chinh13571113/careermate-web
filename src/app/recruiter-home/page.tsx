"use client";

import { useState } from "react";
import {
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Building2,
  Briefcase,
  Search,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

export default function RecruiterHomePage() {
  const [email, setEmail] = useState("");

  const handleConsultation = () => {
    // Handle consultation request
    console.log("Consultation requested for:", email);
  };

  const handleStartPosting = () => {
    // Handle start posting
    console.log("Start posting job");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#436a9d]">
                CareerMate
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/recruiter/dashboard"
                  className="text-gray-600 hover:text-[#436a9d]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/recruiter/profile?tab=account"
                  className="text-gray-600 hover:text-[#436a9d]"
                >
                  Account
                </Link>
                <Link
                  href="/recruiter/candidates/applications"
                  className="text-gray-600 hover:text-[#436a9d]"
                >
                  Candidates
                </Link>
                <Link
                  href="/recruiter/services"
                  className="text-gray-600 hover:text-[#436a9d]"
                >
                  Services
                </Link>
                <Link
                  href="/recruiter/blog"
                  className="text-gray-600 hover:text-[#436a9d]"
                >
                  Blog
                </Link>
                <Link
                  href="/recruiter/support"
                  className="text-gray-600 hover:text-[#436a9d]"
                >
                  Support
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/recruiter/dashboard"
                className="bg-[#24497b] text-white px-4 py-2 rounded-lg hover:bg-[#436a9d] transition-colors"
              >
                Đăng tuyển & Quản lý
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#ffff] to-[#758499] py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Post job openings,
                  <br />
                  find candidates{" "}
                  <span className="cta-highlighted text-[#6da9e9]">
                    effectively
                  </span>
                </h1>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#0ead43] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">
                    Post job openings for free, easily and quickly
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#0ead43] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">
                    Abundant candidate pool from various industries and experience levels
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#0ead43] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">
                    CareerMate AI suggests potential candidates, filters key information
                    and automatically ranks by match score
                  </span>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-[500px] mx-auto">
              <div className="relative z-10">
                {/* Laptop mockup */}
                <div className="bg-gray-900 rounded-t-xl p-4 transform rotate-12 hover:rotate-6 transition-transform duration-300">
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-emerald-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-[#466895]" />
                          <span className="text-sm font-medium">
                            Việc làm mới
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          Senior Developer - 25M
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          Marketing Manager - 20M
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          UI/UX Designer - 18M
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#6697d8] rounded-full opacity-50"></div>
              <div className="absolute top-16 -right-8 w-12 h-12 bg-[#063067] rounded-full opacity-40"></div>
              <div className="absolute -bottom-4 right-8 w-16 h-16 bg-[#6697d8] rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Platform Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Link
              href="/recruiter/services/search"
              className="block relative hover:scale-105 transition-transform duration-300"
            >
              {/* 3D illustration placeholder */}
              <div className="relative hover:-rotate-6 transition-transform duration-300 w-full max-w-[500px] mx-auto">
                <div className="bg-gradient-to-br from-[#bcd1ec] to-[#6b85a7] rounded-2xl flex items-center justify-center cursor-pointer">
                  <div className="text-center">
                    <img
                      src="/img/home3.png"
                      alt="3D Illustration"
                      className="w-full h-80 object-contain p-8"
                    />
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-8 -right-4 w-8 h-8 bg-[#6697d8] rounded-full"></div>
                <div className="absolute bottom-12 -left-6 w-6 h-6 bg-[#558dd6] rounded-full"></div>
                <div className="absolute top-1/2 left-8 w-4 h-4 bg-[#6697d8] rounded-full"></div>
              </div>
            </Link>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase">
                  Find Your Candidates
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  CareerMate Smart Recruitment Platform
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                Nền tảng công nghệ AI và Machine Learning trong lĩnh vực
                Recruitment Marketing, mang đến các giải pháp toàn diện giúp
                doanh nghiệp giải quyết bài toán nguồn nhân lực trong quá trình
                số hóa, từ việc tiếp cận CV, sàng lọc hồ sơ ứng viên cho đến
                đánh giá ứng viên và đo lường hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promotion Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase mb-3">
              Brand Promotion
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              CareerMate Vietnam
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  CareerMate Vietnam is a leading company in the HR Tech field
                  in Vietnam. Since the early days of establishment and operation,
                  our products have been trusted by many businesses.
                </p>
                <p>
                  CareerMate smart recruitment platform, TestCenter employee capacity
                  assessment platform, HappyTime employee experience management platform,
                  and Strings high-speed premium recruitment solution.
                </p>
                <p>
                  CareerMate currently has more than 6.3 million users, 190,000
                  recruiters, and 4 successful partners with millions of candidate
                  applications each year at suitable enterprises.
                </p>
                <p>
                  Through continuous research and development of core technology
                  capabilities focused on optimization, we provide more effective
                  HR solutions for the future.
                </p>
              </div>
            </div>

            <Link
              href="/recruiter/services/premium"
              className="block relative hover:scale-105 transition-transform duration-300"
            >
              <div className="relative hover:rotate-6 transition-transform duration-300 w-full max-w-[500px] mx-auto">
                {/* Team illustration */}
                <div className="relative bg-gradient-to-br from-[#0c2426] to-[#6697d8] rounded-2xl h-80">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                      src="/img/home2.png"
                      alt="Team Illustration"
                      className="w-full h-80 object-contain"
                    />
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-8 w-16 h-16 bg-[#6697d8] rounded-full opacity-60"></div>
                  <div className="absolute bottom-8 left-5 w-10 h-10 bg-[#3573c5] rounded-full opacity-50"></div>
                  <div className="absolute top-1/3 left-4 w-8 h-8 bg-[#6697d8] rounded-full opacity-40"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Platform Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Link
              href="/recruiter/jobs/create"
              className="block relative hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                {/* 3D illustration placeholder */}
                <div className="relative hover:-rotate-6 transition-transform duration-300 w-full max-w-[500px] mx-auto">
                  <div className="bg-gradient-to-br from-[#bcd1ec] to-[#6b85a7] rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <img
                        src="/img/home1.png"
                        alt="3D Illustration"
                        className="w-full h-80 object-contain p-8"
                      />
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute top-8 -right-4 w-8 h-8 bg-[#6697d8] rounded-full"></div>
                  <div className="absolute bottom-12 -left-6 w-6 h-6 bg-[#558dd6] rounded-full"></div>
                  <div className="absolute top-1/2 left-8 w-4 h-4 bg-[#6697d8] rounded-full"></div>
                </div>
              </div>
            </Link>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase">
                  Posting Recruitment
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  CareerMate Smart Recruitment Platform
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                AI and Machine Learning technology platform in the field of
                Recruitment Marketing, providing comprehensive solutions to help
                businesses solve workforce problems during the digitalization process,
                from CV access, candidate profile screening to candidate
                evaluation and effectiveness measurement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase mb-3">
              MORE FEATURES
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              CareerMate Vietnam
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  CareerMate Vietnam is a leading company in the HR Tech field
                  in Vietnam. Since the early days of establishment and operation,
                  our products have been trusted by many businesses.
                </p>
                <p>
                  CareerMate smart recruitment platform, TestCenter employee capacity
                  assessment platform, HappyTime employee experience management platform,
                  and Strings high-speed premium recruitment solution.
                </p>
                <p>
                  CareerMate currently has more than 6.3 million users, 190,000
                  recruiters, and 4 successful partners with millions of candidate
                  applications each year at suitable enterprises.
                </p>
                <p>
                  Through continuous research and development of core technology
                  capabilities focused on optimization and deep application of
                  artificial intelligence, CareerMate hopes to bring more effective
                  HR solutions in the future.
                </p>
              </div>
            </div>

            <div className="relative group transition-transform duration-500 w-full max-w-[500px] mx-auto">
              {/* Outer rotation and hover effect */}
              <div
                className="relative bg-gradient-to-br from-[#0c2426] to-[#6697d8] rounded-2xl h-80 
                      shadow-lg transform group-hover:rotate-3 group-hover:scale-105 
                      transition-all duration-500 ease-out overflow-hidden"
              >
                {/* Main grid of icons */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8 p-8">
                    {/* Users */}
                    <Link href="/recruiter/profile/account">
                      <div
                        className="w-20 h-20 bg-[#c9dffc] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <Users className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                    {/* Target */}
                    <Link href="recruiter/support/contact">
                      <div
                        className="w-20 h-20 bg-[#bed8f9] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <Target className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                    {/* TrendingUp */}
                    <Link href="/recruiter/dashboard">
                      <div
                        className="w-20 h-20 bg-[#b5ceef] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <TrendingUp className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                    {/* Star */}
                    <Link href="/recruiter/services/premium">
                      <div
                        className="w-20 h-20 bg-[#b2cef4] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <Star className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Decorative background circles */}
                <div className="absolute top-4 right-8 w-16 h-16 bg-[#6697d8] rounded-full opacity-50 blur-md"></div>
                <div className="absolute bottom-8 left-5 w-10 h-10 bg-[#3573c5] rounded-full opacity-40 blur-sm"></div>
                <div className="absolute top-1/3 left-4 w-8 h-8 bg-[#6697d8] rounded-full opacity-30 blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#e8f1fe] to-[#ccdff9]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-[#2a4669]">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">6.3M+</div>
              <div className="text-[#2a4669]">Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">190K+</div>
              <div className="text-[#2a4669]">Recruiters</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">1M+</div>
              <div className="text-[#2a4669]">Applications/year</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">99%</div>
              <div className="text-[#2a4669]">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#e8f1fe] to-[#ccdff9]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Start recruiting effectively today
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses who trust CareerMate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleConsultation}
                className="bg-white text-[#5099f8] border border-[#4691f3] px-8 py-4 rounded-lg font-medium hover:bg-[#b9d2f3] transition-colors"
              >
                Free Consultation
              </button>
              <Link
                href="/user-confirmpage"
                className="bg-[#5196f1] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#87bafd] transition-colors inline-flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Post Job Opening
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3e5570] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#85b9fe]">
                CareerMate
              </h3>
              <p className="text-gray-300">
                Leading smart recruitment platform in Vietnam
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Dịch vụ</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Đăng tin tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Tìm kiếm CV
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Đánh giá năng lực
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Báo cáo lỗi
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Công ty</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareerMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { Edit2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";

export default function ITviecProfile() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const profileCompletion = 20; // 20% completed

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px",
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cm-profile" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-semibold text-gray-600">
                      LA
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      Lê Quang Anh
                    </h1>
                    <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Update your title</span>
                    </button>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">✉️</span>
                  <span className="text-gray-700">
                    anhlqde180272@fpt.edu.vn
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">📱</span>
                  <span className="text-gray-400">Your phone number</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">📅</span>
                  <span className="text-gray-400">Your date of birth</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">⚧</span>
                  <span className="text-gray-400">Your gender</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">📍</span>
                  <span className="text-gray-400">Your current address</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">🔗</span>
                  <span className="text-gray-400">Your personal link</span>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  About Me
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Introduce your strengths and years of experience
              </p>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Education
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      FPT University
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Bachelor - Kỹ thuật phần mềm
                    </p>
                    <p className="text-sm text-gray-500">10/2022 - NOW</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Work Experience
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Highlight detailed information about your job history
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Showcase your skills and proficiencies
              </p>
            </div>

            {/* Foreign Language */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Foreign Language
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Provide your language skills and proficiencies
              </p>
            </div>

            {/* Highlight Project */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Highlight Project
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      FB
                    </h3>
                    <p className="text-sm text-gray-500">03/2022 - NOW</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Certificates
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Provides evidence of your specific expertise and skills
              </p>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Awards</h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Highlight your awards or recognitions
              </p>
            </div>
          </section>

          {/* Right Sidebar - Profile Strength */}
          <aside className="hidden xl:block space-y-6 sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Profile Strength
              </h3>
              {/* Progress Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="#fee2e2"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="#ef4444"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${64 * 2 * Math.PI * 0.2} ${
                        64 * 2 * Math.PI
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {profileCompletion}%
                      </div>
                      <div className="text-sm text-gray-500">completed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat bubble for complete profile */}
              <div className="relative mb-6 mr-10">
                <div className="bg-white border border-gray-300 shadow-sm rounded-2xl px-4 py-3 text-gray-700 text-sm leading-relaxed">
                  Complete profile to{" "}
                  <span className="text-red-500 font-semibold">70%</span> to
                  generate CV template for IT professionals.
                </div>
                {/* Đuôi bong bóng */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-gray-300 rotate-45"></div>
                {/* Icon robot */}
                <div className="absolute -right-10 top-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-xl">
                    🤖
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-2 mb-6">
                <button className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add About me</span>
                </button>
                <button className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Contact Information</span>
                </button>
                <button className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Work Experience</span>
                </button>

                <button
                  onClick={() => toggleSection("more")}
                  className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800 font-medium pt-2"
                >
                  <span>Add more information</span>
                  {expandedSections.includes("more") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedSections.includes("more") && (
                  <div className="pl-4 space-y-2 text-sm text-gray-600">
                    <p>• Add Skills</p>
                    <p>• Add Languages</p>
                    <p>• Add Projects</p>
                    <p>• Add Certificates</p>
                  </div>
                )}
              </div>

              {/* Preview & Download Button */}
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                Preview & Download CV
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

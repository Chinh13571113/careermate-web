import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface ProfileStrengthSidebarProps {
    profileCompletion: number;
    expandedSections: string[];
    onToggleSection: (section: string) => void;
}

export default function ProfileStrengthSidebar({
    profileCompletion,
    expandedSections,
    onToggleSection
}: ProfileStrengthSidebarProps) {
    const circumference = 64 * 2 * Math.PI;
    const strokeDasharray = `${circumference * (profileCompletion / 100)} ${circumference}`;

    return (
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
                                strokeDasharray={strokeDasharray}
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
                        <span className="text-gray-500 font-semibold">70%</span> to
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
                        onClick={() => onToggleSection("more")}
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
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                    Preview & Download CV
                </button>
            </div>
        </aside>
    );
}

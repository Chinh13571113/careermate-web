"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

interface Employer {
    id: string;
    name: string;
    logo: string;
    skills: string[];
    location: string;
    jobCount?: number;
    isViewCompany?: boolean;
}

const employers: Employer[] = [
    {
        id: "1",
        name: "NEXON DEV VINA",
        logo: "NEXON",
        skills: ["Games", "Unity", "Unreal Engine", "C#", "C++", "HTML5"],
        location: "Ho Chi Minh",
        jobCount: 4
    },
    {
        id: "2",
        name: "MB Bank",
        logo: "MB",
        skills: ["Python", "Java", "JavaScript", "Oracle", "AngularJS", "ReactJS"],
        location: "Ha Noi - Ho Chi Minh",
        jobCount: 27
    },
    {
        id: "3",
        name: "LG Electronics Development Vietnam (LGEDV)",
        logo: "LG",
        skills: ["C++", "Tester", "OOP", "Embedded", "Android", "C++"],
        location: "Da Nang - Others - Ha Noi",
        isViewCompany: true
    },
    {
        id: "4",
        name: "NAB Innovation Centre Vietnam",
        logo: "NAB",
        skills: ["NodeJS", "ReactJS", "Java", "Cloud", "Agile"],
        location: "Ho Chi Minh",
        jobCount: 12
    }
];

export function TopEmployers() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Top Employers</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employers.map((employer) => (
                        <div key={employer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            {/* Company Logo */}
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-sm font-bold text-gray-600">{employer.logo}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">{employer.name}</h3>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {employer.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center text-gray-600 text-sm mb-4">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{employer.location}</span>
                            </div>

                            {/* Action */}
                            <div className="flex items-center justify-between">
                                {employer.jobCount ? (
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">{employer.jobCount} Jobs</span>
                                    </div>
                                ) : (
                                    <div></div>
                                )}

                                <Link
                                    href={`/client/companies/${employer.id}`}
                                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    {employer.isViewCompany ? "View company" : "View jobs"}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Companies Button */}
                <div className="text-center mt-8">
                    <Link
                        href="/client/companies"
                        className="inline-flex items-center px-6 py-3  bg-gradient-to-r from-[#3a4660] to-gray-400 text-white rounded-lg hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors"
                    >
                        View All Companies
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default TopEmployers;

"use client";

import { TopEmployers } from "./TopEmployers";
import { FeedbackButton } from "./FeedbackButton";
import { useState, useEffect, useRef } from "react";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        const startCount = 0;
        const endCount = end;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(startCount + (endCount - startCount) * easeOutQuart);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref} className="text-4xl md:text-5xl font-bold text-blue-600">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export function ClientHomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <style jsx global>{`
        select {
          direction: ltr !important;
        }
        select option {
          direction: ltr !important;
        }
      `}</style>

            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Find Your Dream Job
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
                            AI-powered job matching for IT professionals. Discover opportunities that match your skills and career goals.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-[2]">
                                        <input
                                            type="text"
                                            placeholder="Job title, keywords, or company"
                                            className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <select className="w-full px-6 py-4 pr-12 rounded-xl text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all appearance-none cursor-pointer" style={{ direction: 'ltr' }}>
                                            <option value="">Select Location</option>
                                            <option value="remote">Remote</option>
                                            <option value="new-york">New York, NY</option>
                                            <option value="san-francisco">San Francisco, CA</option>
                                            <option value="seattle">Seattle, WA</option>
                                            <option value="austin">Austin, TX</option>
                                            <option value="boston">Boston, MA</option>
                                            <option value="chicago">Chicago, IL</option>
                                            <option value="denver">Denver, CO</option>
                                            <option value="los-angeles">Los Angeles, CA</option>
                                            <option value="miami">Miami, FL</option>
                                            <option value="phoenix">Phoenix, AZ</option>
                                            <option value="portland">Portland, OR</option>
                                            <option value="san-diego">San Diego, CA</option>
                                            <option value="washington-dc">Washington, DC</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                        Search Jobs
                                    </button>
                                </div>

                                {/* Quick Filters */}
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white/90 hover:bg-white/30 transition-colors cursor-pointer">
                                        Remote
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white/90 hover:bg-white/30 transition-colors cursor-pointer">
                                        Full-time
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white/90 hover:bg-white/30 transition-colors cursor-pointer">
                                        Senior Level
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white/90 hover:bg-white/30 transition-colors cursor-pointer">
                                        AI/ML
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div className="group">
                                <div className="mb-2">
                                    <AnimatedCounter end={10000} suffix="+" duration={2500} />
                                </div>
                                <div className="text-gray-600 text-lg font-medium">Active Jobs</div>
                            </div>
                            <div className="group">
                                <div className="mb-2">
                                    <AnimatedCounter end={500} suffix="+" duration={2000} />
                                </div>
                                <div className="text-gray-600 text-lg font-medium">Top Companies</div>
                            </div>
                            <div className="group">
                                <div className="mb-2">
                                    <AnimatedCounter end={50000} suffix="+" duration={3000} />
                                </div>
                                <div className="text-gray-600 text-lg font-medium">Candidates</div>
                            </div>
                            <div className="group">
                                <div className="mb-2">
                                    <AnimatedCounter end={95} suffix="%" duration={1500} />
                                </div>
                                <div className="text-gray-600 text-lg font-medium">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Employers Section */}
                <TopEmployers />

                {/* AI Features Section */}
                <section className="py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                AI-Powered Features
                            </h2>
                            <p className="text-xl text-gray-600">
                                Get personalized job recommendations and career insights
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
                                <p className="text-gray-600">
                                    Our AI analyzes your skills and preferences to find the perfect job matches.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Career Insights</h3>
                                <p className="text-gray-600">
                                    Get personalized career advice and market insights to advance your career.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Quick Apply</h3>
                                <p className="text-gray-600">
                                    Apply to multiple jobs with one click using our intelligent application system.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <FeedbackButton />
        </div>
    );
}

export default ClientHomePage;

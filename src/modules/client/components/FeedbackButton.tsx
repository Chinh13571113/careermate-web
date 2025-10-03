"use client";

import { MessageCircle } from "lucide-react";

export function FeedbackButton() {
    return (
        <button className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-gray-800 text-white px-4 py-3 rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <MessageCircle className="w-6 h-6" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-xs mt-1 font-medium">Feedback</span>
            </div>
        </button>
    );
}

export default FeedbackButton;

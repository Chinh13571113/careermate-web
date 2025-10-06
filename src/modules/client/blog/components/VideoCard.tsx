"use client";

import { VideoContent } from "../types";
import { Play } from "lucide-react";

interface VideoCardProps {
    video: VideoContent;
}

export function VideoCard({ video }: VideoCardProps) {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    </div>
                </div>

                {/* CareerMate Logo */}
                <div className="absolute top-3 left-3">
                    <div className="flex items-center space-x-1">
                        <span className="text-red-500 font-bold text-sm">H</span>
                        <span className="text-white font-bold text-sm">M</span>
                    </div>
                </div>
            </div>

            {/* Video Title */}
            <div className="p-4">
                <h3 className="text-white text-sm font-medium leading-relaxed">
                    {video.title}
                </h3>
            </div>
        </div>
    );
}

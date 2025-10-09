"use client";

import Link from "next/link";
import React from "react";

interface CVSidebarProps {
  activePage?:
    | "dashboard"
    | "cv-management"
    | "profile"
    | "jobs"
    | "job-invitation"
    | "email-subscriptions"
    | "notifications"
    | "settings";
}

const CVSidebar: React.FC<CVSidebarProps> = ({
  activePage = "cv-management",
}) => {
  return (
    <div className="lg:w-64 bg-white shadow-sm rounded-xl border border-gray-200 h-fit">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <span className="text-sm">LA</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Welcome</p>
            <p className="font-medium">Lê Quang Anh</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "dashboard"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "dashboard" ? "text-gray-600" : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </Link>

          <Link
            href="/cv-management"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "cv-management"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "cv-management"
                  ? "text-gray-600"
                  : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            CV Attachment
          </Link>

          <Link
            href="/profile"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "profile"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "profile" ? "text-gray-600" : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            CM Profile
          </Link>

          <Link
            href="/my-jobs"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "jobs"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "jobs" ? "text-gray-600" : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            My Jobs
          </Link>

          <Link
            href="/job-invitation"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "job-invitation"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "job-invitation"
                  ? "text-gray-600"
                  : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Job Invitation
            <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          <Link
            href="/email-subscriptions"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "email-subscriptions"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "email-subscriptions"
                  ? "text-gray-600"
                  : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Email Subscriptions
          </Link>

          <Link
            href="/notifications"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "notifications"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "notifications"
                  ? "text-gray-600"
                  : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Notifications
          </Link>

          <Link
            href="/settings"
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              activePage === "settings"
                ? "bg-gray-100 text-gray-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                activePage === "settings" ? "text-gray-600" : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default CVSidebar;

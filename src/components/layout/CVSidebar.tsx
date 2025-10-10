"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { PiHandWavingLight } from "react-icons/pi";

type Item = {
  href: string;
  label: string;
  key: string; // dùng để so khớp/aria
  icon: React.ReactNode;
  badge?: string | number;
  enabled?: boolean;
};

interface CVSidebarProps {
  activePage?: string;
}

const CVSidebar: React.FC<CVSidebarProps> = ({ activePage }) => {
  const pathname = usePathname();

  const items: Item[] = [
    // Bật nếu bạn có trang /dashboard (src/app/dashboard/page.tsx)
    {
      href: "/dashboard",
      label: "Dashboard",
      key: "dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      enabled: true, // <- đổi thành true nếu đã có trang
    },
    {
      href: "/cv-management",
      label: "CV Attachment",
      key: "cv-management",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      enabled: true,
    },
    {
      href: "/profile",
      label: "CM Profile",
      key: "profile",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      enabled: true,
    },
    {
      href: "/my-jobs",
      label: "My Jobs",
      key: "jobs", // sửa key thành "jobs" để phù hợp với activePage="jobs" trong components
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      enabled: true,
    },
    {
      href: "/job-invitation",
      label: "Job Invitation",
      key: "job-invitation",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      badge: 0,
      enabled: true,
    },
    {
      href: "/email-subscriptions",
      label: "Email Subscriptions",
      key: "email-subscriptions",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      enabled: true,
    },
    {
      href: "/notifications",
      label: "Notifications",
      key: "notifications",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      enabled: true,
    },
    {
      href: "/settings",
      label: "Settings",
      key: "settings",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.35 17l.06-.06A1.65 1.65 0 0 0 4.08 15H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9c-.22-.56-.2-1.2.33-1.82l.06-.06A2 2 0 1 1 7.82 4.3H9c.45 0 .87-.19 1-1.51V3a2 2 0 1 1 4 0v.09c.13 1.32.55 1.51 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 21 7.82l-.06.06c-.53.62-.55 1.26-.33 1.82H21a2 2 0 1 1 0 4h-.09c-.53 0-.97.38-1.51 1z" />
        </svg>
      ),
      enabled: true,
    },
  ].filter((i) => i.enabled !== false);

  const isActive = (href: string, key: string) => {
    // Sử dụng cả pathname và activePage prop
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      (activePage && key === activePage)
    );
  };

  return (
    <aside className="lg:w-64 bg-white shadow-sm rounded-xl border border-gray-200 h-fit">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-1">
          <PiHandWavingLight className="w-5 h-5 text-gray-500" />
          <p className="text-xs text-gray-500">Welcome</p>
        </div>
        <div>
          <p className="font-medium">Lê Quang Anh</p>
        </div>
      </div>

      <nav className="space-y-1 px-3 pb-4">
        {items.map((item) => {
          const active = isActive(item.href, item.key);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 py-2 px-3 rounded-md ${
                active
                  ? "bg-gray-100 text-gray-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`shrink-0 ${
                  active ? "text-gray-600" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default CVSidebar;

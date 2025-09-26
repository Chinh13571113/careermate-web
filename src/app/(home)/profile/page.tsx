"use client";

import { useState } from "react";
import {
  User,
  LayoutDashboard,
  BriefcaseBusiness,
  Inbox,
  FileText,
} from "lucide-react";
import Sidebar from "@/components/ui/sidebar";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");

  const items = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { value: "cv_attachment", label: "CV Attachment", icon: FileText },
    { value: "cv_profile", label: "CV Profile", icon: User },
    { value: "my_job", label: "My jobs", icon: BriefcaseBusiness },
    { value: "job_invitation", label: "Job Invitation", icon: Inbox },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="h-full w-64 border-r p-4">
        <Sidebar
          items={items}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Hello World</h1>
      </div>
    </div>
  );
}

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
import { TabContent, TabProvider } from "@/components/ui/tabs";
import Dashboard from "@/features/client/profile/ui/components/dashboard";
import CVAttachment from "@/features/client/profile/ui/components/cv-attachment";
import MyJob from "@/features/client/profile/ui/components/my-job";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const items = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { value: "cv_attachment", label: "CV Attachment", icon: FileText },
    { value: "profile", label: "Profile", icon: User },
    { value: "my_job", label: "My jobs", icon: BriefcaseBusiness },
    { value: "job_invitation", label: "Job Invitation", icon: Inbox },
  ];

  return (
    <div className="flex min-h-screen">
      <TabProvider>
        {/* Sidebar */}
        <div className="h-full w-64 border-r p-4">
          <Sidebar items={items} />
        </div>

        {/* Content */}
        <div className="flex-1 py-8 ps-8 pr-40 bg-gray-100">
          <TabContent value="dashboard">
            <Dashboard />
          </TabContent>

          <TabContent value="cv_attachment">
            <CVAttachment />
          </TabContent>

          <TabContent value="my_job">
            <MyJob />
          </TabContent>
        </div>
      </TabProvider>
    </div>
  );
}

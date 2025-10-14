import { RecruiterSidebar } from "@/modules/recruiter/components";
import RecruiterAuthGuard from "@/components/auth/RecruiterAuthGuard";

// Recruiter navigation items
const recruiterNavItems = [
  {
    title: "Dashboard",
    url: "/recruiter",
    icon: "LayoutDashboard",
  },
  {
    title: "Quản lý Jobs",
    url: "/recruiter/jobs",
    icon: "Briefcase",
  },
  {
    title: "Đơn ứng tuyển",
    url: "/recruiter/applications",
    icon: "FileText",
  },
  {
    title: "Ứng viên",
    url: "/recruiter/candidates",
    icon: "Users",
  },
  {
    title: "Thống kê",
    url: "/recruiter/analytics",
    icon: "TrendingUp",
  },
  {
    title: "Cài đặt",
    url: "/recruiter/settings",
    icon: "Settings",
  },
];

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecruiterAuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        <RecruiterSidebar navItems={recruiterNavItems} />
        <main className="flex-1">{children}</main>
      </div>
    </RecruiterAuthGuard>
  );
}

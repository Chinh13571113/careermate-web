"use client";

import { AdminSidebar } from "@/modules/admin/components";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { AuthProvider } from "@/store/auth-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SecurityCleanup } from "@/components/auth/SecurityCleanup";

// Admin navigation items
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: "BarChart3",
  },
  {
    title: "Blog Management",
    url: "/admin/blog",
    icon: "BookOpen",
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: "Users",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: "Settings",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutProvider>
        <SecurityCleanup />

        <AdminAuthGuard>
          <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar navItems={adminNavItems} />
            <main className="flex-1">{children}</main>
          </div>
        </AdminAuthGuard>
      </LayoutProvider>
    </AuthProvider>
  );
}

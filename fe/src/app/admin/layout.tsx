import type { ReactNode } from "react";
import { AdminLayoutWrapper } from "@/modules/admin/components";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminAuthGuard>
  );
}


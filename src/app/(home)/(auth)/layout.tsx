import AuthGuard from "@/components/auth/auth-guard";
import { ClientHeader } from "@/modules/client/components/ClientHeader";
import { ClientFooter } from "@/modules/client/components/ClientFooter";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard mode="guest" redirectTo="/">
      <main className="flex-1 mt-16">{/* Added margin-top for fixed header */}
        {children}
      </main>
    </AuthGuard>
  );
}

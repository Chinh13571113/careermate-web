import AuthGuard from "@/components/auth/auth-guard";
import { ClientHeader } from "@/modules/client/components/ClientHeader";
import { ClientFooter } from "@/modules/client/components/ClientFooter";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard mode="guest" redirectTo="/">

      <ClientHeader />
      <main className="flex-1">
        {children}
      </main>
      <ClientFooter />

    </AuthGuard>
  );
}

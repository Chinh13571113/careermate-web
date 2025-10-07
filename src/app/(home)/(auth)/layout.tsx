import AuthGuard from "@/components/auth/auth-guard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard mode="guest" redirectTo="/">
      <main className="flex-1">
        {children}
      </main>
    </AuthGuard>
  );
}

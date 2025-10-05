import { ClientFooter } from "@/modules/client/components/ClientFooter";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1">
        {children}
      </main>
      <ClientFooter />
    </>
  );
}

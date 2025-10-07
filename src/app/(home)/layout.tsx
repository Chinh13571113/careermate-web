import { ClientHeader } from "@/modules/client/components/ClientHeader";
import { ClientFooter } from "@/modules/client/components/ClientFooter";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ClientHeader />
            <main className="flex-1">
                {children}
            </main>
            <ClientFooter />
        </>
    );
}







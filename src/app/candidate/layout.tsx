"use client";

import CandidateHeader from "@/modules/client/components/CandidateHeader";
import CandidateFooter from "@/modules/client/components/CandidateFooter";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CandidateHeader />
            <main className="flex-1">
                {children}
            </main>
            <CandidateFooter />
        </>
    );
}







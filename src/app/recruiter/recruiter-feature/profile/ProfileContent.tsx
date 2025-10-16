"use client";

import { useSearchParams } from "next/navigation";
import { AccountTabs, RecruiterAccountForm, OrganizationProfileForm } from "@/modules/recruiter";

export default function ProfileContent() {
    const params = useSearchParams();
    const tab = params.get("tab") || "account";
    return (
        <>
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-sky-800">Recruiter profile</h1>
                <div />
            </header>
            <AccountTabs />
            {tab === "organization" ? <OrganizationProfileForm /> : <RecruiterAccountForm />}
        </>
    );
}



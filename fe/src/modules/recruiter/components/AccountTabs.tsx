"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type TabKey = "account" | "organization";

const TABS: { key: TabKey; label: string; href: string }[] = [
    { key: "account", label: "Recruiter account", href: "/recruiter/recruiter-feature/profile/account" },
    { key: "organization", label: "Organization profile", href: "/recruiter/recruiter-feature/profile/organization" },
];

export function AccountTabs() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active tab based on current pathname
    const active = pathname.includes("/recruiter/profile/organization") ? "organization" : "account";

    function setTab(key: TabKey) {
        const tab = TABS.find(t => t.key === key);
        if (tab) {
            router.push(tab.href);
        }
    }

    return (
        <div className="mb-4 flex items-center gap-2 border-b">
            {TABS.map((t) => (
                <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={cn(
                        "-mb-px rounded-t-md px-3 py-2 text-sm font-medium",
                        active === t.key
                            ? "border-b-2 border-sky-600 text-sky-700"
                            : "text-slate-600 hover:text-slate-800"
                    )}
                    aria-current={active === t.key ? "page" : undefined}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}

export default AccountTabs;



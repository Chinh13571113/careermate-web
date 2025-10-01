import Card from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { Briefcase } from "lucide-react";
import React, { useState } from "react";
import AppliedJob from "../../my-job/ui/components/applied-job";
import SavedJob from "../../my-job/ui/components/saved-job";
import { TabContent } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type MyJobTab = "applied_job" | "saved_job";

const MyJob = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Use the type alias
  const items: { value: MyJobTab; label: string }[] = [
    { value: "applied_job", label: "Applied Job" },
    { value: "saved_job", label: "Saved Job" },
  ];

  const currentTab =
    (searchParams.get("myJobTab") as MyJobTab) || "applied_job";

  const handleTabChange = (tabValue: MyJobTab) => {
    const params = new URLSearchParams(searchParams);

    if (tabValue === "applied_job") {
      params.delete("myJobTab");
    } else {
      params.set("myJobTab", tabValue);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <Card title="My Jobs">
        <div className="flex space-x-4">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => handleTabChange(item.value)}
              className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer ${
                currentTab === item.value
                  ? " text-blue-600 border-blue-200"
                  : "text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="text-sm font-medium">
                {item.label}{" "}
                <span
                  className={` py-1 px-2 rounded-full ${
                    currentTab === item.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  } `}
                >
                  12
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Tab Content */}
      <div>
        {currentTab === "applied_job" && <AppliedJob />}
        {currentTab === "saved_job" && <SavedJob />}
      </div>
    </div>
  );
};

export default MyJob;

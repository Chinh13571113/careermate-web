import Card from "@/components/ui/card";
import { useTab } from "@/components/ui/tabs";
import React from "react";

const MyActivity = () => {
  const { activeTab, setActiveTab } = useTab();

  return (
    <Card title="My Activities">
      <div className="grid grid-cols-3 gap-4">
        <Card
          title="Applied Jobs"
          onClick={() => setActiveTab("my_job")}
          className="bg-blue-100  cursor-pointer hover:border-blue-400 transition duration-200"
        >
          1
        </Card>
        <Card
          title="Saved Jobs"
          onClick={() => setActiveTab("my_job")}
          className="bg-red-100  cursor-pointer hover:border-red-400 transition duration-200"
        >
          2
        </Card>
        <Card
          title="Job Invitation"
          onClick={() => setActiveTab("job_invitation")}
          className="bg-green-100  cursor-pointer hover:border-green-400 transition duration-200"
        >
          3
        </Card>
      </div>
    </Card>
  );
};

export default MyActivity;

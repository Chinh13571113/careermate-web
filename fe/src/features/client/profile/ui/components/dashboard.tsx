import React from "react";
import AttachedCV from "../../dashboard/ui/components/attached-cv";
import PersonalInformation from "../../dashboard/ui/components/personal-information";
import MyActivity from "../../dashboard/ui/components/my-activity";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PersonalInformation />
      <AttachedCV />
      <MyActivity />
    </div>
  );
};

export default Dashboard;

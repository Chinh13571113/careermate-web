import React from "react";
import AttachedCV from "../../dashboard/ui/components/attached-cv";
import PersonalInformation from "../../dashboard/ui/components/personal-information";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PersonalInformation />
      <AttachedCV />
    </div>
  );
};

export default Dashboard;

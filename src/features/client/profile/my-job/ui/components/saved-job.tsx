import { Job } from "@/components/ui/JobCard";
import JobCardList from "@/components/ui/JobCardList";
import React from "react";

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Company A",
    location: "Ho Chi Minh",
    level: "Inter",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "2",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: false,
  },
];

const SavedJob = () => {
  const handleApply = (jobId: string) => {
    // TODO: call api
    console.log("Apply job", jobId);
  };

  const handleSave = (jobId: string) => {
    console.log("Save job", jobId);
    // TODO: call api
  };

  return (
    <JobCardList jobs={mockJobs} onApply={handleApply} onSave={handleSave} />
  );
};

export default SavedJob;

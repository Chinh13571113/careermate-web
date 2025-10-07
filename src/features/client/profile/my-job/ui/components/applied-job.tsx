import { Job } from "@/modules/client/job/components/JobCard";
import JobCardList from "@/modules/client/job/components/JobCardList";
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
    isSaved: true,
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "4",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "5",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "6",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "7",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "8",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "9",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "10",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
  {
    id: "11",
    title: "Backend Developer",
    company: "Tech Company B",
    location: "Ha Noi",
    level: "Fresher",
    image: "/company.png",
    expiredDate: "2024-12-31",
    isSaved: true,
  },
];

const AppliedJob = () => {
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

export default AppliedJob;

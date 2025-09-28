import React from "react";
import JobCard, { Job } from "./JobCard";

interface JobCardListProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

const JobCardList: React.FC<JobCardListProps> = ({ jobs, onApply, onSave }) => {
  return (
    <div className="mx-auto space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} />
      ))}
    </div>
  );
};

export default JobCardList;

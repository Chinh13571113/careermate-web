import React, { useEffect, useState } from "react";
import JobCard, { Job } from "./JobCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface JobCardListProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

const JobCardList: React.FC<JobCardListProps> = ({ jobs, onApply, onSave }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="mx-auto space-y-4">
      {/* List */}
      {currentJobs.map((job) => (
        <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} />
      ))}

      {/* // Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="text-blue-300 cursor-pointer hover:text-blue-500"
        >
          <ArrowLeft />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`cursor-pointer ${
              currentPage === i + 1
                ? "text-blue-300 font-bold hover:text-blue-500"
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="text-blue-300 cursor-pointer hover:text-blue-500"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default JobCardList;

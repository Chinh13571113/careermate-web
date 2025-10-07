import React from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/card";
import Image from "next/image";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  level: string;
  image: string;
  expiredDate: string;
  isSaved: boolean;
}

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onSave }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/jobs/${job.id}`);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(job.id);
  };

  return (
    <Card
      key={job.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            {job.image ? (
              <Image
                src={job.image}
                alt={job.company}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-xs">No Image</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{job.title}</h3>
          <div className="text-gray-600 mt-1">
            <p className="truncate text-sm">{job.company}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {job.location}
              </span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {job.level}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-sm text-orange-300">
            Expires in {new Date(job.expiredDate).toLocaleDateString()}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-2 border-2 text-blue-500 rounded hover:bg-blue-100 cursor-pointer transition-colors text-sm "
            >
              Apply Now
            </button>

            <button
              onClick={handleSave}
              className={`px-4 py-2 border rounded transition-colors text-sm cursor-pointer ${
                job.isSaved
                  ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {job.isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;

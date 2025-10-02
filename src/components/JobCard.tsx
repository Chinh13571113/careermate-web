import React from 'react';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  postedAgo: string;
  workMode: string;
  skills: string[];
  isHot?: boolean;
  isNegotiable?: boolean;
  isRemote?: boolean;
  companyType?: string;
  isSelected?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  postedAgo,
  workMode,
  skills,
  isHot = false,
  isNegotiable = false,
  isRemote = false,
  companyType,
  isSelected = false
}) => {
  return (
    <div className={`bg-white rounded-lg border p-4 mb-4 transition-all ${
      isSelected 
        ? 'border-blue-500 border-l-4 shadow-md bg-blue-50' 
        : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isHot && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">
                HOT
              </span>
            )}
            <h3 className="text-sm font-semibold text-gray-800 flex-1">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 bg-blue-500 rounded-sm flex-shrink-0"></span>
            <span className="text-sm font-medium text-gray-700">{company}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {isNegotiable && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm text-blue-600 font-medium">Negotiate</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>📍 {workMode}</span>
          <span>🏢 {location}</span>
        </div>
        
        {companyType && (
          <div className="text-sm text-gray-600">
            🏢 {companyType}
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Posted {postedAgo}
      </div>
    </div>
  );
};

export default JobCard;
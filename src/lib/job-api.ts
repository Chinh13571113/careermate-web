import api from '@/lib/api';

const USE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_USE_MOCK_FALLBACK === 'true';

// API Response Interfaces
export interface Skill {
  id: number;
  name: string;
  mustToHave: boolean;
}

export interface RecruiterInfo {
  recruiterId: number;
  companyName: string;
  website: string;
  logoUrl: string;
  about: string;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  address: string;
  expirationDate: string;
  postTime: string;
  skills: Skill[];
  yearsOfExperience: number;
  workModel: string;
  salaryRange: string;
  jobPackage: string;
  recruiterInfo: RecruiterInfo;
}

export interface JobPostingsResponse {
  code: number;
  message: string;
  result: {
    content: JobPosting[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface JobQueryParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Mock data generator for fallback
const generateMockJobs = (count: number = 10, keyword: string = ''): JobPosting[] => {
  const companies = ['TechCorp', 'DevSolutions', 'CodeMasters', 'InnovateLab', 'DataFlow Inc'];
  const titles = ['Senior Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer', 'UI/UX Designer'];
  const locations = ['Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Can Tho', 'Hai Phong'];
  const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL'];
  const workModels = ['Remote', 'Hybrid', 'On-site'];
  const packages = ['BASIC', 'PREMIUM', 'ENTERPRISE'];
  
  return Array.from({ length: count }, (_, i) => {
    const company = companies[i % companies.length];
    const title = titles[i % titles.length];
    
    // Filter by keyword if provided
    if (keyword && !title.toLowerCase().includes(keyword.toLowerCase()) && !company.toLowerCase().includes(keyword.toLowerCase())) {
      return null;
    }
    
    return {
      id: i + 1,
      title,
      description: `Join our team as a ${title}. We're looking for passionate developers who want to make an impact.`,
      address: locations[i % locations.length],
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      postTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      skills: [
        { id: i * 2, name: skills[i % skills.length], mustToHave: true },
        { id: i * 2 + 1, name: skills[(i + 1) % skills.length], mustToHave: false }
      ],
      yearsOfExperience: Math.floor(Math.random() * 5) + 1,
      workModel: workModels[i % workModels.length],
      salaryRange: `$${(3 + i % 5) * 1000} - $${(5 + i % 5) * 1000}`,
      jobPackage: packages[i % packages.length],
      recruiterInfo: {
        recruiterId: i + 100,
        companyName: company,
        website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
        logoUrl: `https://via.placeholder.com/100?text=${company.charAt(0)}`,
        about: `${company} is a leading technology company focused on innovation and excellence.`
      }
    };
  }).filter(Boolean) as JobPosting[];
};

const getMockJobPostings = (params: JobQueryParams = {}): JobPostingsResponse => {
  const { keyword = '', page = 0, size = 10 } = params;
  const allJobs = generateMockJobs(50, keyword);
  const start = page * size;
  const end = start + size;
  const paginatedJobs = allJobs.slice(start, end);
  
  return {
    code: 1000,
    message: 'Mock data (API unavailable)',
    result: {
      content: paginatedJobs,
      page,
      size,
      totalElements: allJobs.length,
      totalPages: Math.ceil(allJobs.length / size)
    }
  };
};

// Helper function to calculate time ago
const getTimeAgo = (postTime: string): string => {
  const posted = new Date(postTime);
  const now = new Date();
  const diffInMs = now.getTime() - posted.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
};

// Transform API data to JobListing format
export const transformJobPosting = (job: JobPosting) => {
  const mustHaveSkills = job.skills.filter(s => s.mustToHave).map(s => s.name);
  const niceToHaveSkills = job.skills.filter(s => !s.mustToHave).map(s => s.name);
  
  return {
    id: job.id,
    title: job.title,
    company: job.recruiterInfo.companyName,
    companyLogo: job.recruiterInfo.logoUrl,
    location: job.address,
    postedAgo: getTimeAgo(job.postTime),
    jobType: 'Full time', // Default since API doesn't provide this
    workMode: job.workModel,
    experience: `${job.yearsOfExperience}+ years`,
    expertise: job.title, // Using title as expertise
    skills: job.skills.map(s => s.name),
    highlights: mustHaveSkills.length > 0 ? [`Must have: ${mustHaveSkills.join(', ')}`] : [],
    description: job.description.split('\n').filter(line => line.trim() !== ''),
    salaryRange: job.salaryRange,
    benefitSummary: job.jobPackage ? [job.jobPackage] : [],
    benefits: job.jobPackage ? [job.jobPackage] : [],
    isHot: false, // API doesn't provide this
    isNegotiable: job.salaryRange.toLowerCase().includes('negotiable'),
    companyType: job.recruiterInfo.about || '',
  };
};

// Fetch job postings from API
export const fetchJobPostings = async (params: JobQueryParams = {}): Promise<JobPostingsResponse> => {
  const {
    keyword = '',
    page = 0,
    size = 10,
    sortBy = 'createAt',
    sortDir = 'desc'
  } = params;

  try {
    const response = await api.get<any>(
      '/api/job-postings',
      {
        params: {
          ...(keyword && { keyword }),
          page,
          size,
          sortBy,
          sortDir
        }
      }
    );

    console.log('✅ Job postings API response:', response.data);
    console.log('📊 Response structure:', {
      hasCode: 'code' in response.data,
      hasContent: 'content' in response.data,
      hasResult: 'result' in response.data,
      responseKeys: Object.keys(response.data)
    });
    
    const responseData = response.data;
    
    // Handle direct pagination format (Spring Boot default)
    if ('content' in responseData && Array.isArray(responseData.content)) {
      console.log('📋 Direct pagination format detected');
      return {
        code: 1000,
        message: 'Success',
        result: {
          content: responseData.content,
          page: responseData.number || responseData.page || 0,
          size: responseData.size || size,
          totalElements: responseData.totalElements || 0,
          totalPages: responseData.totalPages || 0
        }
      };
    }
    
    // Handle wrapped response format (code, message, result)
    if (responseData.code !== undefined) {
      // Check for error response (accept both 200 and 1000 as success)
      const isSuccess = responseData.code === 200 || responseData.code === 1000 || responseData.code === 0;
      
      if (!isSuccess) {
        console.error('❌ Job postings API error:', responseData);
        
        // Use mock data for authentication errors if fallback is enabled
        if (USE_MOCK_FALLBACK && (responseData.code === 1006 || responseData.code === 401)) {
          console.warn('⚠️ User not authenticated. Using mock data fallback.');
          return getMockJobPostings(params);
        }
        
        throw new Error(responseData.message || 'Failed to fetch job postings');
      }
      
      // Success! Return the wrapped response
      console.log('✅ Job postings loaded successfully:', responseData.result.totalElements, 'jobs found');
      return responseData;
    }
    
    // If we get here, return whatever we have
    console.warn('⚠️ Unexpected response format, attempting to use as-is');
    return {
      code: 1000,
      message: 'Success',
      result: responseData
    };
    
  } catch (error: any) {
    console.error('Error fetching job postings:', error);
    
    // Use mock data fallback if enabled
    if (USE_MOCK_FALLBACK) {
      console.warn('⚠️ API unavailable. Using mock data fallback.');
      return getMockJobPostings(params);
    }
    
    throw error;
  }
};

// Fetch single job posting by ID
export const fetchJobPostingById = async (id: number): Promise<JobPosting | null> => {
  try {
    const response = await fetchJobPostings({ page: 0, size: 100 });
    const job = response.result.content.find(j => j.id === id);
    return job || null;
  } catch (error) {
    console.error(`Error fetching job posting ${id}:`, error);
    return null;
  }
};

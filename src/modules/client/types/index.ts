// Client Types (Candidate)
export interface Client {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    location?: string;
    profilePicture?: string;
    bio?: string;
    skills: string[];
    experience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
    preferences: JobPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    skills: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    gpa?: number;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
}

export interface JobPreferences {
    jobTypes: string[];
    locations: string[];
    salaryRange: {
        min: number;
        max: number;
    };
    remoteWork: boolean;
    industries: string[];
}

export interface JobApplication {
    id: string;
    clientId: string;
    jobId: string;
    status: 'applied' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
    appliedAt: Date;
    coverLetter?: string;
    resumeVersion: string;
    notes?: string;
}

export interface AIRecommendation {
    id: string;
    clientId: string;
    jobId: string;
    score: number;
    reasons: string[];
    createdAt: Date;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    remote: boolean;
    description: string;
    requirements: string[];
    benefits: string[];
    salaryRange?: {
        min: number;
        max: number;
    };
    postedAt: Date;
    deadline?: Date;
    recruiterId: string;
}

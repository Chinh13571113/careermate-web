export interface Recruiter {
  recruiterId: number;
  accountId: number;
  email: string;
  username: string;
  companyName: string;
  website: string;
  logoUrl: string;
  about: string;
  rating: number;
  businessLicense: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress: string;
  accountStatus: string;
  accountRole: string;
  verificationStatus: string;
}

export interface RecruiterResponse {
  code: number;
  message: string;
  result: Recruiter[];
}recruiter.username

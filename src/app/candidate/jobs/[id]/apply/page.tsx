"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import { FiUpload, FiFile, FiEye } from "react-icons/fi";
import { submitJobApplication, uploadCV } from "@/lib/job-apply-api";
import { fetchJobPostingById, transformJobPosting } from "@/lib/job-api"; // ✅ Import API
import { useAuthStore } from "@/store/use-auth-store";
import toast from "react-hot-toast";

interface JobDetails {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  salaryRange?: string;
  location: string;
  jobType: string;
}

export default function JobApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const { user, candidateId, fetchCandidateProfile } = useAuthStore(); // ✅ Get candidateId from store

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);
  const [cvOption, setCvOption] = useState<'current' | 'upload' | 'sample'>('current');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvName, setCurrentCvName] = useState("TuanKhang_CV.pdf");
  const [currentCvDate, setCurrentCvDate] = useState("21-10-2025");

  // Sample CV path for testing
  const SAMPLE_CV_PATH = "sample/test-cv.pdf";

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    preferredLocation: "",
    coverLetter: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    preferredLocation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(true); // ✅ Loading state

  // ✅ Fetch real job details from API
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      setIsLoadingJob(true);
      try {
        console.log("📋 Fetching job details for ID:", jobId);
        const response = await fetchJobPostingById(parseInt(jobId));

        if (response) {
          const transformedJob = transformJobPosting(response);

          setJobDetails({
            id: transformedJob.id,
            title: transformedJob.title,
            company: transformedJob.company,
            companyLogo: transformedJob.companyLogo,
            salaryRange: transformedJob.salaryRange,
            location: transformedJob.location,
            jobType: transformedJob.jobType,
          });

          console.log("✅ Job details loaded:", transformedJob);
        }
      } catch (error) {
        console.error("❌ Error fetching job details:", error);
        toast.error("Failed to load job details");

        // Fallback to basic info with jobId
        setJobDetails({
          id: parseInt(jobId),
          title: "Job Position",
          company: "Company",
          location: "Location",
          jobType: "Full time",
        });
      } finally {
        setIsLoadingJob(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // ✅ Auto-fill user info when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        preferredLocation: "",
        coverLetter: "",
      });

      // ✅ Check if user has CV in profile
      if (user.cvPath && user.cvPath.trim() !== "") {
        setCurrentCvName(user.cvPath.split('/').pop() || "Your CV");
        setCvOption('current');
      } else {
        // No CV in profile, default to sample for testing
        setCvOption('sample');
      }
    }

    // ✅ Fetch candidate profile if not already loaded
    if (user && !candidateId) {
      console.log('📝 CandidateId not in store, fetching profile...');
      fetchCandidateProfile();
    }
  }, [user, candidateId, fetchCandidateProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSize) {
        alert("File size must not exceed 3MB");
        return;
      }

      const allowedTypes = [".doc", ".docx", ".pdf"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      if (!allowedTypes.includes(fileExtension.toLowerCase())) {
        alert("Please upload .doc, .docx, or .pdf file");
        return;
      }

      setCvFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      phoneNumber: "",
      preferredLocation: "",
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      isValid = false;
    }

    if (!formData.preferredLocation) {
      newErrors.preferredLocation = "Preferred work location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ✅ Validate CV is provided
    if (cvOption === 'current') {
      if (!user?.cvPath || user.cvPath.trim() === "") {
        toast.error("No CV found in your profile. Please upload a new CV or use sample CV.");
        setCvOption('sample');
        return;
      }
    } else if (cvOption === 'upload') {
      if (!cvFile) {
        toast.error("Please upload your CV");
        return;
      }
    }
    // cvOption === 'sample' doesn't need validation

    if (!user?.id) {
      toast.error("User information not found. Please login again.");
      router.push('/sign-in');
      return;
    }

    setIsSubmitting(true);

    try {
      let cvFilePath = "";

      // Handle different CV options
      if (cvOption === 'upload' && cvFile) {
        // Upload new CV file
        toast.loading("Uploading CV...", { id: 'upload-cv' });
        try {
          cvFilePath = await uploadCV(cvFile);
          toast.success("CV uploaded successfully", { id: 'upload-cv' });
        } catch (uploadError) {
          toast.error("Failed to upload CV. Please try again.", { id: 'upload-cv' });
          throw uploadError;
        }
      } else if (cvOption === 'current') {
        // Use current CV path from user profile
        cvFilePath = user.cvPath || "";

        // ✅ Validate CV path exists
        if (!cvFilePath || cvFilePath.trim() === "") {
          toast.error("No CV found in your profile. Please upload a new CV.");
          setIsSubmitting(false);
          return;
        }
      } else if (cvOption === 'sample') {
        // Use sample CV for testing
        cvFilePath = SAMPLE_CV_PATH;
        console.log('🧪 Using sample CV for testing:', cvFilePath);
      }

      // ✅ Prepare application data with explicit type and validation
      // ✅ Use candidateId from store (fetched from profile API)
      const finalCandidateId = candidateId || 1; // Fallback to 1 if not loaded

      if (!candidateId) {
        console.warn('⚠️  CandidateId not loaded from profile, using fallback value 1');
      }

      const applicationData = {
        jobPostingId: parseInt(jobId),
        candidateId: finalCandidateId, // ✅ Use real candidateId from API
        cvFilePath: cvFilePath,
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        preferredWorkLocation: formData.preferredLocation.trim(),
        coverLetter: formData.coverLetter.trim() || "", // Default to empty string
        status: "PENDING", // Initial status
      };

      // ✅ Log data before submission for debugging
      console.log('🔍 ===== PREPARING TO SUBMIT APPLICATION =====');
      console.log('🔍 Job ID:', jobId);
      console.log('🔍 User ID (from JWT):', user.id);
      console.log('🔍 Candidate ID (from profile API):', finalCandidateId);
      console.log('🔍 Application Data:', {
        ...applicationData,
        coverLetter: applicationData.coverLetter ? `${applicationData.coverLetter.substring(0, 30)}...` : 'Empty'
      });

      // ✅ Validate all required fields are present
      if (!applicationData.jobPostingId || isNaN(applicationData.jobPostingId)) {
        throw new Error('Invalid job posting ID');
      }
      if (!applicationData.candidateId) {
        throw new Error('Invalid candidate ID');
      }
      if (!applicationData.fullName) {
        throw new Error('Full name is required');
      }
      if (!applicationData.phoneNumber) {
        throw new Error('Phone number is required');
      }
      if (!applicationData.preferredWorkLocation) {
        throw new Error('Preferred work location is required');
      }
      if (!applicationData.cvFilePath) {
        throw new Error('CV file path is required');
      }

      // Submit application
      toast.loading("Submitting application...", { id: 'submit-app' });
      const response = await submitJobApplication(applicationData);

      toast.success("Application submitted successfully!", { id: 'submit-app' });

      // Navigate to success page with response data
      router.push(
        `/candidate/jobs/${jobId}/apply/success?applicationId=${response.result.id}`
      );
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob || !jobDetails) {
    return (
      <>
        <ClientHeader />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-3xl mx-auto px-4 py-8 mt-16">
        {/* Back button */}
        <button
          onClick={() => setShowConfirmQuit(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Single-card Application Form with title */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
          {/* Title and meta inside the same card */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            {/* Company Logo & Info */}
            <div className="flex items-start gap-4 mb-4">
              {jobDetails.companyLogo && (
                <img
                  src={jobDetails.companyLogo}
                  alt={jobDetails.company}
                  className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{jobDetails.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium text-gray-700">{jobDetails.company}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{jobDetails.location}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{jobDetails.jobType}</span>
                  {jobDetails.salaryRange && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                        {jobDetails.salaryRange}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* CV Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-3">
              Your CV <span className="text-gray-500">*</span>
            </label>

            {/* Use Current CV Option */}
            <div className="mb-4">
              <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${!user?.cvPath || user.cvPath.trim() === ''
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                : cvOption === 'current'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-500'
                }`}>
                <input
                  type="radio"
                  name="cvOption"
                  checked={cvOption === 'current'}
                  onChange={() => setCvOption('current')}
                  disabled={!user?.cvPath || user.cvPath.trim() === ''}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">
                    Use your current CV
                    {(!user?.cvPath || user.cvPath.trim() === '') && (
                      <span className="ml-2 text-xs text-red-600">(No CV in profile)</span>
                    )}
                  </div>
                  {user?.cvPath && user.cvPath.trim() !== '' ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <FiFile />
                        <span>{currentCvName}</span>
                        <button type="button" className="ml-2 text-gray-400 hover:text-gray-600">
                          <FiEye />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Upload date: {currentCvDate}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No CV found. Please upload your CV to your profile first or use options below.
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Use Sample CV for Testing */}
            <div className="mb-4">
              <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${cvOption === 'sample'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-500'
                }`}>
                <input
                  type="radio"
                  name="cvOption"
                  checked={cvOption === 'sample'}
                  onChange={() => setCvOption('sample')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    Use sample CV for testing
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      🧪 Test Mode
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FiFile />
                    <span>sample/test-cv.pdf</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Perfect for testing job application without uploading a real CV
                  </div>
                </div>
              </label>
            </div>

            {/* Upload New CV Option */}
            <div>
              <label className={`flex items-start gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${cvOption === 'upload'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-500'
                }`}>
                <input
                  type="radio"
                  name="cvOption"
                  checked={cvOption === 'upload'}
                  onChange={() => setCvOption('upload')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-2">Upload a new CV</div>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="cvFile"
                      accept=".doc,.docx,.pdf"
                      onChange={handleFileChange}
                      disabled={cvOption !== 'upload'}
                      className="hidden"
                    />
                    <label
                      htmlFor="cvFile"
                      className={`px-4 py-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-50 transition-colors flex items-center gap-2 ${cvOption !== 'upload' ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                    >
                      <FiUpload />
                      Choose file
                    </label>
                    <span className="text-sm text-gray-500">
                      {cvFile ? cvFile.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Please upload .doc, .docx, or .pdf file, maximum 3MB and no password protection.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.fullName ? "border-gray-500" : "border-gray-300"
                    }`}
                  placeholder="Không Tuấn"
                />
                {errors.fullName && <p className="text-sm text-gray-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number <span className="text-gray-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.phoneNumber ? "border-gray-500" : "border-gray-300"
                    }`}
                  placeholder="0123456789"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-gray-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Preferred Work Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred work location <span className="text-gray-500">*</span>
                </label>
                <select
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.preferredLocation ? "border-gray-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select location</option>
                  <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Other">Other</option>
                </select>
                {errors.preferredLocation && (
                  <p className="text-sm text-gray-500 mt-1">{errors.preferredLocation}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">1/3 locations</p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-gray-400">(Optional)</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              What skills, work projects or achievements make you a strong candidate?
            </p>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows={6}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
              placeholder="Details and specific examples will make your application stronger..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.coverLetter.length} of 500 characters remaining
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-500 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send my CV"}
          </button>
        </form>
      </div>

      <ClientFooter />

      {/* Quit applying confirm modal */}
      {showConfirmQuit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quit applying</h3>
              <button
                aria-label="Close"
                onClick={() => setShowConfirmQuit(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Changes you made so far will not be saved. Are you sure you want to quit this page?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmQuit(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Continue applying
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

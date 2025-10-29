"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import { FiUpload, FiFile, FiEye } from "react-icons/fi";

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

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);
  const [useCurrentCV, setUseCurrentCV] = useState(true);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvName, setCurrentCvName] = useState("TuanKhang_CV.pdf");
  const [currentCvDate, setCurrentCvDate] = useState("21-10-2025");

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

  // Mock job details - trong thực tế sẽ fetch từ API
  useEffect(() => {
    setJobDetails({
      id: parseInt(jobId),
      title: "FullStack Dev (NodeJS/ReactJS) - Signing Bonus UpTo 60M at FPT Software",
      company: "FPT Software",
      salaryRange: "Up to $3000",
      location: "Hồ Chí Minh",
      jobType: "Full time",
    });
  }, [jobId]);

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

    if (!useCurrentCV && !cvFile) {
      alert("Please upload your CV");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const submitData = new FormData();
      submitData.append("jobId", jobId);
      submitData.append("useCurrentCV", useCurrentCV.toString());
      submitData.append("fullName", formData.fullName);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("preferredLocation", formData.preferredLocation);
      submitData.append("coverLetter", formData.coverLetter);

      if (!useCurrentCV && cvFile) {
        submitData.append("cvFile", cvFile);
      }

      // Submit to API
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      // Navigate to success page
      router.push(`/candidate/jobs/${jobId}/apply/success`);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(error instanceof Error ? error.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{jobDetails.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="font-medium">{jobDetails.company}</span>
              {jobDetails.salaryRange && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                  {jobDetails.salaryRange}
                </span>
              )}
            </div>
          </div>
          {/* CV Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-3">
              Your CV <span className="text-gray-500">*</span>
            </label>

            {/* Use Current CV Option */}
            <div className="mb-4">
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                <input
                  type="radio"
                  name="cvOption"
                  checked={useCurrentCV}
                  onChange={() => setUseCurrentCV(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">Use your current CV</div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FiFile />
                    <span>{currentCvName}</span>
                    <button type="button" className="ml-2 text-gray-400 hover:text-gray-600">
                      <FiEye />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Upload date: {currentCvDate}</div>
                </div>
              </label>
            </div>

            {/* Upload New CV Option */}
            <div>
              <label className="flex items-start gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                <input
                  type="radio"
                  name="cvOption"
                  checked={!useCurrentCV}
                  onChange={() => setUseCurrentCV(false)}
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
                      disabled={useCurrentCV}
                      className="hidden"
                    />
                    <label
                      htmlFor="cvFile"
                      className={`px-4 py-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        useCurrentCV ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.fullName ? "border-gray-500" : "border-gray-300"
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
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.phoneNumber ? "border-gray-500" : "border-gray-300"
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
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.preferredLocation ? "border-gray-500" : "border-gray-300"
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

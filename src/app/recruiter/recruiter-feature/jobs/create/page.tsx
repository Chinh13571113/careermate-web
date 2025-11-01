"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Calendar,
  Rocket,
  Save,
  X,
  Eye,
  Trash2,
} from "lucide-react";

export default function CreateJobPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewJob, setViewJob] = useState<any | null>(null);
  const [jobs, setJobs] = useState<
    {
      id: string;
      title: string;
      jobType: string;
      description: string;
      expiryDate: string;
      isBoosted: boolean;
    }[]
  >([]);
  const [formData, setFormData] = useState({
    title: "",
    jobType: "",
    description: "",
    expiryDate: "",
    isBoosted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required.";
    if (!formData.jobType) newErrors.jobType = "Please select a job type.";
    if (!formData.description.trim())
      newErrors.description = "Job description is required.";
    if (!formData.expiryDate) newErrors.expiryDate = "Please choose an expiry date.";
    return newErrors;
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newJob = {
      id: `JOB-${jobs.length + 1}`,
      ...formData,
    };

    setJobs((prev) => [...prev, newJob]);
    setIsOpen(false);

    // Reset form
    setFormData({
      title: "",
      jobType: "",
      description: "",
      expiryDate: "",
      isBoosted: false,
    });
    setErrors({});
  };

  // Cancel form
  const handleCancel = () => {
    setIsOpen(false);
    setErrors({});
  };

  // View job details
  const handleView = (job: any) => {
    setViewJob(job);
  };

  const closeView = () => {
    setViewJob(null);
  };

  // Delete job
  const handleDelete = (job: any) => {
    setConfirmDelete(job);
  };

  const confirmDeleteJob = () => {
    setJobs((prev) => prev.filter((j) => j.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="p-4 sm:p-0 relative">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Job Posts</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition"
        >
          <PlusCircle className="w-5 h-5 mr-1" /> Create Job Post
        </button>
      </header>

      {/* Danh sách Job */}
      {jobs.length > 0 ? (
        <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Boosted
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.jobType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.expiryDate}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {job.isBoosted ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        ⚡ Boosted
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleView(job)}
                      className="text-sky-600 hover:text-sky-800 transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm text-gray-600">
          <p>No job posts yet. Click “Create Job Post” to add one.</p>
        </div>
      )}

      {/* Popup Create Job */}
      {isOpen && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-xl rounded-lg p-6 w-[90%] sm:w-[600px] z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-sky-600" /> Create Job
              Post
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Frontend Developer"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.jobType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select job type...</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              {errors.jobType && (
                <p className="text-sm text-red-600 mt-1">{errors.jobType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 border rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe the job..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" /> Expiry Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.expiryDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.expiryDate}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isBoosted"
                checked={formData.isBoosted}
                onChange={handleChange}
                className="h-4 w-4 text-sky-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700 flex items-center">
                <Rocket className="w-4 h-4 mr-1 text-amber-500" />
                Boost this job post
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
              >
                <Save className="w-4 h-4 mr-1" /> Save Job Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Popup View Job */}
      {viewJob && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-xl rounded-lg p-6 w-[90%] sm:w-[500px] z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-sky-600" /> View Job Post
            </h2>
            <button onClick={closeView} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="text-base font-medium text-gray-800">{viewJob.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="text-base text-gray-800">{viewJob.jobType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-base text-gray-700 whitespace-pre-line">{viewJob.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="text-base text-gray-800">{viewJob.expiryDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Boosted</p>
              {viewJob.isBoosted ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  ⚡ Boosted
                </span>
              ) : (
                <span className="text-gray-400 text-sm">No</span>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={closeView}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup Confirm Delete */}
      {confirmDelete && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white border border-red-200 shadow-xl rounded-lg p-6 w-[90%] sm:w-[400px] z-50"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-red-600" /> Confirm Delete
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteJob}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

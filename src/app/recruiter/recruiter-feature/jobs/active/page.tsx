"use client";

import React, { useState } from "react";
import {
  Eye,
  BarChart3,
  RefreshCw,
  Pencil,
  Zap,
  CalendarDays,
  AlertTriangle,
  X,
} from "lucide-react";

// Dữ liệu mẫu
const initialJobs = [
  {
    id: "J001",
    title: "Software Engineering (Backend)",
    applicants: 45,
    views: 1250,
    expiresIn: 7,
    isBoosted: true,
  },
  {
    id: "J002",
    title: "Bridge Software Engineer (BrSE)",
    applicants: 120,
    views: 2800,
    expiresIn: 2,
    isBoosted: false,
  },
  {
    id: "J003",
    title: "Software Engineering (Fullstack)",
    applicants: 8,
    views: 550,
    expiresIn: 20,
    isBoosted: false,
  },
];

export default function ActiveJobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [modalType, setModalType] = useState<"stats" | "extend" | "edit" | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");

  // Handler mở modal
  const openModal = (job: any, type: "stats" | "extend" | "edit") => {
    setSelectedJob(job);
    setModalType(type);
    setEditTitle(job.title);
  };

  // Gia hạn job
  const handleExtend = () => {
    if (!selectedJob) return;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === selectedJob.id ? { ...j, expiresIn: j.expiresIn + 7 } : j
      )
    );
    setModalType(null);
  };

  // Cập nhật tiêu đề job
  const handleEditSave = () => {
    if (!selectedJob) return;
    setJobs((prev) =>
      prev.map((j) => (j.id === selectedJob.id ? { ...j, title: editTitle } : j))
    );
    setModalType(null);
  };

  return (
    <div className="p-4 sm:p-0 relative">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Active Job Posts</h1>
        <span className="text-sm text-gray-500">
          Manage performance and extend job postings
        </span>
      </header>

      {/* Bảng danh sách */}
      <div className="rounded-lg border bg-white shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Công việc
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                Views
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Applicants
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Expires In
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <div>
                      <div>{job.title}</div>
                      <div className="text-xs text-gray-400">ID: {job.id}</div>
                    </div>
                    {job.isBoosted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <Zap className="h-3 w-3 mr-1" />
                        BOOSTED
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    {job.views.toLocaleString("en-US")}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-sky-600">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    {job.applicants}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm">
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      job.expiresIn <= 3
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <CalendarDays className="h-3.5 w-3.5 mr-1" />
                    {job.expiresIn} days left
                  </div>
                </td>

                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => openModal(job, "stats")}
                      className="text-gray-500 hover:text-gray-700"
                      title="View Stats"
                    >
                      <BarChart3 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => openModal(job, "extend")}
                      className="text-green-600 hover:text-green-800"
                      title="Extend"
                    >
                      <RefreshCw className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => openModal(job, "edit")}
                      className="text-sky-600 hover:text-sky-800"
                      title="Edit"
                    >
                      <Pencil className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - KHÔNG có nền đen */}
      {modalType && selectedJob && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-2xl rounded-lg p-6 w-[90%] sm:w-[400px] z-50"
        >
          <button
            onClick={() => setModalType(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* View Stats */}
          {modalType === "stats" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Job Statistics
              </h2>
              <p>
                <strong>Title:</strong> {selectedJob.title}
              </p>
              <p>
                <strong>Applicants:</strong> {selectedJob.applicants}
              </p>
              <p>
                <strong>Views:</strong> {selectedJob.views}
              </p>
              <p>
                <strong>Expires In:</strong> {selectedJob.expiresIn} days
              </p>
            </div>
          )}

          {/* Extend */}
          {modalType === "extend" && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Extend Job Post
              </h2>
              <p>
                Are you sure you want to extend{" "}
                <strong>{selectedJob.title}</strong> by 7 more days?
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={handleExtend}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit */}
          {modalType === "edit" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Edit Job Title
              </h2>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Thông báo cảnh báo */}
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 shadow-sm flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <span>
          <strong>Attention:</strong> Job{" "}
          <strong>Bridge Software Engineer</strong> is expiring in 2 days. Please{" "}
          <strong>extend</strong> it now!
        </span>
      </div>
    </div>
  );
}

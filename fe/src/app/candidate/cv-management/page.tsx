"use client";

import { useEffect, useState } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { useLayout } from "@/contexts/LayoutContext";

const CVManagementPage = () => {
  // Sử dụng context thay vì useEffect
  const { headerHeight } = useLayout();

  // Backup solution nếu context chưa hoạt động
  const [headerH, setHeaderH] = useState(headerHeight || 0);

  // Chỉ sử dụng localStorage ở client-side
  useEffect(() => {
    // Kiểm tra nếu đang ở client-side
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(
    "Please upload your CV first"
  );
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string>("No uploads yet");
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  const [personalInfo] = useState({
    fullName: "Lê Quang Anh",
    phoneNumber: "0934977826",
    prefergrayLocation: "TP Hồ Chí Minh",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setFileName(file.name);

      if (fileUrl) URL.revokeObjectURL(fileUrl);
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      const d = new Date();
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      setUploadDate(`${day}/${month}/${year}`);
    }
  };

  const handlePreviewCV = () => setShowPdfPreview(true);
  const handleClosePreview = () => setShowPdfPreview(false);

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* GRID 3 cột: sidebar | content | analyzer */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_22rem] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`, // cao header
            ["--content-pad" as any]: "24px", // vì main có py-6 = 24px
          }}
        >
          {/* Sidebar trái: sticky + ẩn mobile */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cv-management" />
          </aside>

          {/* CỘT GIỮA: 1 cột chứa 4 card */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Manage CVs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Manage CVs
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Upload your CV below to use it throughout your application
                process
              </p>

              <h2 className="text-sm font-medium text-gray-700 mb-3">
                Your CV
              </h2>
              <div className="border border-gray-200 rounded-lg p-3 mb-4 flex items-center">
                <div className="bg-gray-100 rounded-md p-1 mr-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-gray-500">
                    Last uploaded: {uploadDate}
                  </p>
                </div>
                <button
                  onClick={handlePreviewCV}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded px-3 py-1 text-sm ml-3 disabled:opacity-50"
                  disabled={!fileUrl && !uploadedFile}
                >
                  CV Preview
                </button>
              </div>

              <label
                htmlFor="cv-upload"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-500 text-gray-600 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span className="text-sm font-medium">Upload CV</span>
              </label>
              <input
                id="cv-upload"
                type="file"
                className="hidden"
                accept=".doc,.docx,.pdf"
                onChange={handleFileUpload}
              />

              <p className="text-xs text-gray-500 mt-3">
                Please upload a .doc, .docx, or .pdf file, maximum 3MB and no
                password protection
              </p>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h2>
                <button className="text-gray-500 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Full name
                  </label>
                  <p className="text-sm font-medium">{personalInfo.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Phone number
                  </label>
                  <p className="text-sm font-medium">
                    {personalInfo.phoneNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Preferred work location
                  </label>
                  <p className="text-sm font-medium">
                    {personalInfo.prefergrayLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  General Information
                </h2>
                <button className="text-gray-500 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Total years of experience
                  </label>
                  <p className="text-sm text-gray-500 italic">
                    Add your information
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Current job level
                  </label>
                  <p className="text-sm text-gray-500 italic">
                    Add your information
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Expected working model
                  </label>
                  <p className="text-sm text-gray-500 italic">
                    Add your information
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Cover Letter
                </h2>
                <button className="text-gray-500 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-700 mb-4">
                Introduce yourself and why you'd make a great hire
              </p>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <svg
                    className="w-full h-full text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <p className="text-sm text-gray-500 italic">
                  Click the edit button to add your cover letter.
                </p>
              </div>
            </div>
          </section>

          {/* Analyzer phải: sticky + ẩn mobile */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start">
            <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  CV Analysis
                </h2>
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/10">
                  <svg
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">CV Analysis</span>
                  <button className="bg-gradient-to-r from-[#3a4660] to-gray-400 text-white px-3 py-1 rounded text-xs font-medium">
                    Generate
                  </button>
                </div>
              </div>

              <div className="text-white flex items-center justify-center min-h-[260px]">
                <p className="text-white/80 text-sm">
                  Use the Generate button to analyze your CV
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Analyzer bản mobile (tùy chọn) */}
        {/* <div className="lg:hidden mt-6">...Analyzer content...</div> */}
      </main>

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">
                CV Preview: {fileName}
              </h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0"
                  title="CV Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">No file available for preview</p>
                </div>
              )}
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={handleClosePreview}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CVManagementPage;

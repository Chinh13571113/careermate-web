"use client";

import { useState } from "react";
import Image from "next/image";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import CVSidebar from "@/components/layout/CVSidebar";

const CVManagementPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Lê Quang Anh',
    phoneNumber: '0934977826',
    preferredLocation: 'TP Hồ Chí Minh'
  });

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <>
      <ClientHeader />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <CVSidebar activePage="cv-management" />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CV Upload Section */}
                <div className="md:col-span-1 space-y-6">
                  {/* CV Upload Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Manage CVs</h1>
                    <p className="text-sm text-gray-600 mb-6">
                      Upload your CV below to use it throughout your application process
                    </p>

                    {/* Current CV */}
                    <div className="mb-6">
                      <h2 className="text-sm font-medium text-gray-700 mb-3">Your CV</h2>
                      <div className="border border-gray-200 rounded-lg p-3 mb-3 flex items-center">
                        <div className="bg-red-100 rounded-md p-1 mr-3">
                          <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">LE_Quang Anh.pdf</p>
                          <p className="text-xs text-gray-500">Last uploaded: 01/09/2025</p>
                        </div>
                      </div>

                      {/* Upload Button */}
                      <label 
                        htmlFor="cv-upload" 
                        className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-md cursor-pointer hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                      {/* File format message */}
                      <p className="text-xs text-gray-500 mt-3">
                        Please upload a .doc, .docx, or .pdf file, maximum 3MB and no password protection
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information and General Info Section */}
                <div className="md:col-span-1 space-y-6">
                  {/* Personal Information Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                      <button className="text-red-500 hover:text-red-600">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Full name</label>
                        <p className="text-sm font-medium">{personalInfo.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Phone number</label>
                        <p className="text-sm font-medium">{personalInfo.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Preferred work location</label>
                        <p className="text-sm font-medium">{personalInfo.preferredLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* General Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">General Information</h2>
                      <button className="text-red-500 hover:text-red-600">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Total years of experience</label>
                        <p className="text-sm text-gray-500 italic">Add your information</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Current job level</label>
                        <p className="text-sm text-gray-500 italic">Add your information</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Expected working model</label>
                        <p className="text-sm text-gray-500 italic">Add your information</p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Cover Letter</h2>
                      <button className="text-red-500 hover:text-red-600">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">Introduce yourself and why you'd make a great hire</p>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center gap-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <svg className="w-full h-full text-red-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 italic">Click the edit button to add your cover letter.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CV Analysis Section */}
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-white">CV Analysis</h2>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/10">
                        <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                    <div className="text-white space-y-6 flex-grow">
                      {/* Content will be added after CV analysis */}
                      <div className="h-full min-h-[300px] flex items-center justify-center">
                        <p className="text-white/80 text-sm">Use the Generate button to analyze your CV</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ClientFooter />
    </>
  );
};

export default CVManagementPage;
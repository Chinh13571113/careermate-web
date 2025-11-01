"use client";

import React, { useState } from "react";

interface JobTemplate {
  id: number;
  title: string;
  category: string;
  description: string;
  details: string;
  uses: number;
}

export default function JobTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(
    null
  );

  const templatesData: JobTemplate[] = [
    {
      id: 1,
      title: "Software Engineer (Full-Stack)",
      category: "Information Technology",
      description:
        "Design and maintain scalable full-stack applications using React, Node.js, and AWS.",
      details: `
**Responsibilities:**
- Build and maintain web applications end-to-end
- Collaborate with design, backend, and DevOps teams
- Write clean, maintainable, and testable code

**Requirements:**
- Proficient in JavaScript/TypeScript, React, Node.js
- Familiar with RESTful APIs and cloud platforms (AWS)
- Strong problem-solving and communication skills
      `,
      uses: 86,
    },
    {
      id: 2,
      title: "Software Engineer (Backend)",
      category: "Information Technology",
      description:
        "Develop and maintain backend APIs and services using Java Spring Boot or Node.js.",
      details: `
**Responsibilities:**
- Design and implement scalable backend services
- Manage databases and optimize query performance
- Collaborate with frontend engineers and DevOps

**Requirements:**
- Solid understanding of backend frameworks (Spring Boot, Express)
- Knowledge of SQL/NoSQL databases
- Experience with CI/CD and containerization
      `,
      uses: 73,
    },
    {
      id: 3,
      title: "Software Engineer (Frontend)",
      category: "Information Technology",
      description:
        "Create and optimize user interfaces with React, Next.js, and Tailwind CSS.",
      details: `
**Responsibilities:**
- Develop responsive, accessible UIs
- Integrate frontend with backend APIs
- Ensure cross-browser compatibility and performance

**Requirements:**
- Strong skills in React, Next.js, TypeScript
- Understanding of design systems and UX principles
- Experience with testing frameworks like Jest or Cypress
      `,
      uses: 54,
    },
    {
      id: 4,
      title: "Mobile Engineer (iOS/Android)",
      category: "Information Technology",
      description:
        "Develop and maintain mobile applications using Flutter or React Native.",
      details: `
**Responsibilities:**
- Build cross-platform mobile applications
- Integrate APIs and handle mobile data storage
- Optimize app performance and user experience

**Requirements:**
- Experience with Flutter or React Native
- Knowledge of mobile UI/UX guidelines
- Familiarity with Firebase or mobile CI/CD tools
      `,
      uses: 41,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      category: "Information Technology",
      description:
        "Automate deployments and ensure system reliability across environments.",
      details: `
**Responsibilities:**
- Implement CI/CD pipelines
- Monitor system performance and uptime
- Manage cloud infrastructure (AWS, Azure, or GCP)

**Requirements:**
- Experience with Docker, Kubernetes, Jenkins
- Strong scripting skills (Bash, Python)
- Knowledge of infrastructure as code (Terraform)
      `,
      uses: 37,
    },
    {
      id: 6,
      title: "AI / Machine Learning Engineer",
      category: "Information Technology",
      description:
        "Build and deploy machine learning models for production-grade applications.",
      details: `
**Responsibilities:**
- Develop ML pipelines for prediction and analysis
- Train, test, and deploy models efficiently
- Collaborate with data engineers and product teams

**Requirements:**
- Proficient in Python, TensorFlow, or PyTorch
- Understanding of data preprocessing and ML algorithms
- Familiar with cloud ML tools (SageMaker, Vertex AI)
      `,
      uses: 29,
    },
  ];

  return (
    <div className="p-4 sm:p-0">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Software Engineer Templates</h1>
        <button
          onClick={() => alert("Feature: Create a new custom template")}
          className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700 transition duration-300 flex items-center justify-center text-sm"
        >
          ✨ Create Custom Template
        </button>
      </header>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search template by title or category..."
          className="flex-grow w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150"
        />
        <select className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150">
          <option value="">Filter by Category</option>
          <option value="it">Information Technology</option>
          <option value="marketing">Marketing</option>
          <option value="finance">Finance / Accounting</option>
        </select>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesData.map((template) => (
          <div
            key={template.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-md flex flex-col transition duration-300 hover:shadow-lg hover:border-sky-400"
          >
            <span className="text-xs font-medium text-sky-600 mb-1 uppercase tracking-wider">
              {template.category}
            </span>
            <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
              {template.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
              {template.description}
            </p>

            <div className="flex justify-between items-center border-t pt-4 mt-auto">
              <span className="text-xs text-gray-400 flex items-center">
                🔥 Used {template.uses} times
              </span>
              <button
                onClick={() => setSelectedTemplate(template)}
                className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
              >
                Use Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup – light modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Popup box (no dark overlay) */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
              title="Close"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {selectedTemplate.title}
            </h2>
            <p className="text-sm text-sky-600 mb-4">
              {selectedTemplate.category}
            </p>
            <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-md mb-4">
              {selectedTemplate.details}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(
                    `Template "${selectedTemplate.title}" loaded into Create Job Post form!`
                  );
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md transition"
              >
                Create Job Post from Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

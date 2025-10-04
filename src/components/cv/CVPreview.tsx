"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SAMPLE_CV_DATA, CV_TEMPLATES } from "@/types/cv";
import "./zoom-slider.css";

interface Props {
  templateId?: string;
  zoomLevel?: number;
  cvData?: typeof SAMPLE_CV_DATA;
  onEditClick?: () => void;
  onBackClick?: () => void;
}

export default function CVPreview({
  templateId = "minimalist",
  zoomLevel = 100,
  cvData = SAMPLE_CV_DATA,
  onEditClick,
  onBackClick
}: Props) {
  const [zoom, setZoom] = useState(zoomLevel);
  const router = useRouter();

  const currentTemplate =
    CV_TEMPLATES.find((t) => t.id === templateId) || CV_TEMPLATES[3];

  const handleZoomChange = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(50, Math.min(100, newZoom));
    setZoom(clampedZoom);
  }, []);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          handleZoomChange(zoom + 10);
        } else if (e.key === "-") {
          e.preventDefault();
          handleZoomChange(zoom - 10);
        } else if (e.key === "0") {
          e.preventDefault();
          handleZoomChange(100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoom, handleZoomChange]);

  // Mouse wheel zoom support
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        handleZoomChange(zoom + delta);
      }
    },
    [zoom, handleZoomChange]
  );

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Sticky Header Controls */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#3a4660] to-white dark:from-teal-300 dark:to-blue-400 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-3 py-2 text-base text-gray-800 hover:text-gray-800 hover:bg-gray-300 rounded-md transition-colors"
            title="Back to previous page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-bold">Back</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 font-semibold text-base text-gray-600">
              <span>Zoom:</span>

              {/* Zoom Buttons */}
              <div className="flex items-center text-base space-x-2">
                <button
                  onClick={() => handleZoomChange(50)}
                  className={`px-2 py-1 rounded text-xs ${
                    zoom === 50 ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  50%
                </button>
                <button
                  onClick={() => handleZoomChange(75)}
                  className={`px-2 py-1 rounded text-xs ${
                    zoom === 75 ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  75%
                </button>
                <button
                  onClick={() => handleZoomChange(100)}
                  className={`px-2 py-1 rounded text-xs ${
                    zoom === 100
                      ? "bg-gray-100 text-gray-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  100%
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleZoomChange(zoom - 10)}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoom <= 50}
                  title="Zoom out (Ctrl+-)"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span className="text-base text-gray-500">50%</span>

                {/* Custom Zoom Slider */}
                <div className="relative w-24 h-6 flex items-center">
                  {/* Track - gray */}
                  <div className="w-full h-1 bg-gray-400 rounded-full">
                    {/* Progress - gray 600 */}
                    <div
                      className="h-1 bg-gray-600 rounded-full transition-all duration-100"
                      style={{ width: `${((zoom - 50) / (100 - 50)) * 100}%` }}
                    ></div>
                  </div>

                  {/* Input range*/}
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={zoom}
                    onChange={(e) => handleZoomChange(Number(e.target.value))}
                    onInput={(e) =>
                      handleZoomChange(
                        Number((e.target as HTMLInputElement).value)
                      )
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 slider-input"
                    title="Zoom level"
                    style={{
                      background: "transparent",
                      WebkitAppearance: "none",
                      appearance: "none",
                    }}
                  />

                  {/* Thumb - hình tròn trượt */}
                  <div
                    className="absolute w-4 h-4 bg-white border-2 border-gray-500 rounded-full shadow-sm transition-all duration-100 hover:scale-110 pointer-events-none"
                    style={{
                      left: `calc(${((zoom - 50) / (100 - 50)) * 100}% - 8px)`,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  ></div>
                </div>

                <span className="text-base text-gray-500">100%</span>

                <button
                  onClick={() => handleZoomChange(zoom + 10)}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoom >= 100}
                  title="Zoom in (Ctrl++)"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleZoomChange(100)}
                  className="flex items-center space-x-2 px-3 py-2 text-base text-gray-800 hover:text-gray-800 hover:bg-gray-400 rounded-md transition-colors"
                  title="Reset zoom (Ctrl+0)"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable CV Preview Content */}
      <div
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
        onWheel={handleWheel}
      >
        <div
          className="mx-auto bg-white shadow-lg"
          style={{
            width: "210mm",
            minHeight: "297mm",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
          {/* Minimalist Template */}
          {templateId === "minimalist" && (
            <div className="p-12">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
                  {cvData.personalInfo.fullName}
                </h1>
                <p className="text-sm text-gray-600 uppercase tracking-widest mb-4">
                  {cvData.personalInfo.position}
                </p>
                <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                  <span>{cvData.personalInfo.email}</span>
                  <span>•</span>
                  <span>{cvData.personalInfo.phone}</span>
                  <span>•</span>
                  <span>{cvData.personalInfo.location}</span>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed text-center">
                  {cvData.personalInfo.summary}
                </p>
              </div>

              {/* Experience Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4 uppercase tracking-wide">
                  EXPERIENCE
                </h2>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 pl-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">
                          {exp.position}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 italic mb-2">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {exp.description}
                      </p>
                      {exp.achievements && (
                        <ul className="text-sm text-gray-700 space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4 uppercase tracking-wide">
                  SKILLS
                </h2>
                <div className="space-y-4">
                  {cvData.skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-800 mb-2">
                        {skillGroup.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill, i) => (
                          <span
                            key={i}
                            className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4 uppercase tracking-wide">
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 pl-4"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-800">
                          {edu.degree}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 italic">
                        {edu.school}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modern Template */}
          {templateId === "modern" && (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
              {/* Header with Blue Accent */}
              <div className="bg-blue-600 text-white p-8 -m-8 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      {cvData.personalInfo.fullName}
                    </h1>
                    <p className="text-xl text-blue-100 mb-4">
                      {cvData.personalInfo.position}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-100">
                      <div>📧 {cvData.personalInfo.email}</div>
                      <div>📱 {cvData.personalInfo.phone}</div>
                      <div>📍 {cvData.personalInfo.location}</div>
                      {cvData.personalInfo.website && (
                        <div>🌐 {cvData.personalInfo.website}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="col-span-2 space-y-8">
                  {/* About */}
                  <div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">
                      About
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {cvData.personalInfo.summary}
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">
                      Experiences
                    </h2>
                    <div className="space-y-6">
                      {cvData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-gray-800">
                              {exp.position}
                            </h3>
                            <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                              {exp.period}
                            </span>
                          </div>
                          <p className="text-blue-600 font-semibold mb-2">
                            {exp.company}
                          </p>
                          <p className="text-gray-700 mb-3">
                            {exp.description}
                          </p>
                          {exp.achievements && (
                            <ul className="space-y-2">
                              {exp.achievements.map((achievement, i) => (
                                <li
                                  key={i}
                                  className="flex items-start text-gray-700"
                                >
                                  <span className="text-blue-600 mr-2">▸</span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Skills */}
                  <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-4">
                      Skills
                    </h2>
                    <div className="space-y-4">
                      {cvData.skills.map((skillGroup, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <h3 className="font-semibold text-gray-800 mb-3">
                            {skillGroup.category}
                          </h3>
                          <div className="space-y-2">
                            {skillGroup.items.map((skill, i) => (
                              <div key={i} className="flex items-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">
                                  {skill}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-4">
                      Education
                    </h2>
                    <div className="space-y-4">
                      {cvData.education.map((edu, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {edu.degree}
                          </h3>
                          <p className="text-blue-600 text-sm">{edu.school}</p>
                          <p className="text-gray-500 text-sm">{edu.period}</p>
                          {edu.gpa && (
                            <p className="text-gray-600 text-sm">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-4">
                      Languages
                    </h2>
                    <div className="space-y-3">
                      {cvData.languages.map((lang, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">
                              {lang.language}
                            </span>
                            <span className="text-sm text-blue-600">
                              {lang.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classic Template */}
          {templateId === "classic" && (
            <div className="p-12 bg-white">
              {/* Header */}
              <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
                  {cvData.personalInfo.fullName}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {cvData.personalInfo.position}
                </p>
                <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
                  <span>{cvData.personalInfo.email}</span>
                  <span>{cvData.personalInfo.phone}</span>
                  <span>{cvData.personalInfo.location}</span>
                </div>
              </div>

              {/* Career Objective */}
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 uppercase">
                  Career Objective
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {cvData.personalInfo.summary}
                </p>
              </div>

              {/*Work Experience */}
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 uppercase">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {exp.position}
                          </h3>
                          <p className="text-gray-600 italic">{exp.company}</p>
                        </div>
                        <span className="text-gray-600 text-sm">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{exp.description}</p>
                      {exp.achievements && (
                        <ul className="text-gray-700 ml-4">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="list-disc mb-1">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 uppercase">
                  Education
                </h2>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {edu.degree}
                          </h3>
                          <p className="text-gray-600 italic">{edu.school}</p>
                          {edu.gpa && (
                            <p className="text-gray-600 text-sm">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 uppercase">
                  Skills
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {cvData.skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800 mb-2">
                        {skillGroup.category}:
                      </h3>
                      <p className="text-gray-700">
                        {skillGroup.items.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 uppercase">
                  Languages
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {cvData.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-800">{lang.language}</span>
                      <span className="text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Creative Template */}
          {templateId === "creative" && (
            <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
              {/* Header with Creative Design */}
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-8 -m-8 mb-8 rounded-br-3xl">
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-white opacity-20 rounded-full"></div>
                <h1 className="text-4xl font-bold mb-2 relative z-10">
                  {cvData.personalInfo.fullName}
                </h1>
                <p className="text-xl opacity-90 mb-4">
                  {cvData.personalInfo.position}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
                  <div className="flex items-center">
                    <span className="mr-2">✉</span> {cvData.personalInfo.email}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📞</span> {cvData.personalInfo.phone}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>{" "}
                    {cvData.personalInfo.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-8 space-y-6">
                  {/* About */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      ✨ Introduction
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {cvData.personalInfo.summary}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-pink-500">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
                      💼 Experiences
                    </h2>
                    <div className="space-y-6">
                      {cvData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="relative pl-8 border-l-2 border-purple-200"
                        >
                          <div className="absolute w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full -left-2 top-2"></div>
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg text-gray-800">
                                {exp.position}
                              </h3>
                              <span className="text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-purple-600 font-semibold mb-2">
                              {exp.company}
                            </p>
                            <p className="text-gray-700 mb-3">
                              {exp.description}
                            </p>
                            {exp.achievements && (
                              <ul className="space-y-1">
                                {exp.achievements.map((achievement, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start text-gray-700"
                                  >
                                    <span className="text-pink-500 mr-2">
                                      🚀
                                    </span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-span-4 space-y-6">
                  {/* Skills */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                      🎯 Skills
                    </h2>
                    <div className="space-y-4">
                      {cvData.skills.map((skillGroup, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-gray-800 mb-3">
                            {skillGroup.category}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.items.map((skill, i) => (
                              <span
                                key={i}
                                className="text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
                      🎓 Education
                    </h2>
                    <div className="space-y-4">
                      {cvData.education.map((edu, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {edu.degree}
                          </h3>
                          <p className="text-green-600 text-sm">{edu.school}</p>
                          <p className="text-gray-500 text-sm">{edu.period}</p>
                          {edu.gpa && (
                            <p className="text-gray-600 text-sm">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      🌍 Languages
                    </h2>
                    <div className="space-y-3">
                      {cvData.languages.map((lang, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">
                              {lang.language}
                            </span>
                            <span className="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full">
                              {lang.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Template */}
          {templateId === "professional" && (
            <div className="p-10 bg-gray-50">
              <div className="bg-white p-8">
                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-6 mb-8">
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {cvData.personalInfo.fullName}
                      </h1>
                      <p className="text-xl text-gray-600 mb-4">
                        {cvData.personalInfo.position}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {cvData.personalInfo.summary}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-4">Liên hệ</h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div>
                          <strong>Email:</strong> {cvData.personalInfo.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {cvData.personalInfo.phone}
                        </div>
                        <div>
                          <strong>Location:</strong>{" "}
                          {cvData.personalInfo.location}
                        </div>
                        {cvData.personalInfo.website && (
                          <div>
                            <strong>Website:</strong>{" "}
                            {cvData.personalInfo.website}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="col-span-2 space-y-8">
                    {/* Experience */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
                        PROFESSIONAL EXPERIENCE
                      </h2>
                      <div className="space-y-8">
                        {cvData.experience.map((exp, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  {exp.position}
                                </h3>
                                <p className="text-gray-600 font-semibold">
                                  {exp.company}
                                </p>
                              </div>
                              <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {exp.description}
                            </p>
                            {exp.achievements && (
                              <ul className="text-gray-700 space-y-1">
                                {exp.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
                        EDUCATION
                      </h2>
                      <div className="space-y-6">
                        {cvData.education.map((edu, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  {edu.degree}
                                </h3>
                                <p className="text-gray-600 font-semibold">
                                  {edu.school}
                                </p>
                                {edu.gpa && (
                                  <p className="text-gray-600 text-sm">
                                    GPA: {edu.gpa}
                                  </p>
                                )}
                              </div>
                              <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded">
                                {edu.period}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Skills */}
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        CORE COMPETENCIES
                      </h2>
                      <div className="space-y-4">
                        {cvData.skills.map((skillGroup, index) => (
                          <div key={index}>
                            <h3 className="font-bold text-gray-800 mb-2">
                              {skillGroup.category}
                            </h3>
                            <div className="space-y-1">
                              {skillGroup.items.map((skill, i) => (
                                <div
                                  key={i}
                                  className="text-sm text-gray-700 bg-white px-2 py-1 rounded"
                                >
                                  {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        LANGUAGES
                      </h2>
                      <div className="space-y-3">
                        {cvData.languages.map((lang, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium text-gray-800">
                              {lang.language}
                            </span>
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                              {lang.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    {cvData.certifications.length > 0 && (
                      <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          CERTIFICATIONS
                        </h2>
                        <div className="space-y-3">
                          {cvData.certifications.map((cert, index) => (
                            <div key={index} className="bg-white p-3 rounded">
                              <h3 className="font-semibold text-gray-800 text-sm">
                                {cert.name}
                              </h3>
                              <p className="text-gray-600 text-xs">
                                {cert.issuer}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {cert.date}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-600"></div>
          <div className="flex space-x-3">
            <button
              onClick={onEditClick}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Update your profile
            </button>
            <button className="px-4 py-2 border border-gray-300 bg-gradient-to-r from-[#3a4660] to-gray-300 text-white rounded-md hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors">
              Download CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

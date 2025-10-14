'use client';

import { useState } from 'react';
import { SAMPLE_CV_DATA, type CVData } from '@/types/cv';

interface Props {
  initialData?: CVData;
  onDataChange?: (data: CVData) => void;
  onClose?: () => void;
}

export default function CVEditForm({ initialData = SAMPLE_CV_DATA, onDataChange, onClose }: Props) {
  const [cvData, setCVData] = useState<CVData>(initialData);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');

  const handlePersonalInfoChange = (field: string, value: string) => {
    const updatedData = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value
      }
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...cvData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    const updatedData = {
      ...cvData,
      experience: updatedExperience
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const addExperience = () => {
    const updatedData = {
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          position: '',
          company: '',
          period: '',
          description: '',
          achievements: []
        }
      ]
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const removeExperience = (index: number) => {
    const updatedData = {
      ...cvData,
      experience: cvData.experience.filter((_, i) => i !== index)
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...cvData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    const updatedData = {
      ...cvData,
      education: updatedEducation
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const addEducation = () => {
    const updatedData = {
      ...cvData,
      education: [
        ...cvData.education,
        {
          degree: '',
          school: '',
          period: '',
          gpa: '',
          description: ''
        }
      ]
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const removeEducation = (index: number) => {
    const updatedData = {
      ...cvData,
      education: cvData.education.filter((_, i) => i !== index)
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleSkillsChange = (index: number, field: string, value: string | string[]) => {
    const updatedSkills = [...cvData.skills];
    if (field === 'items' && Array.isArray(value)) {
      updatedSkills[index] = {
        ...updatedSkills[index],
        items: value
      };
    } else {
      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: value
      };
    }
    const updatedData = {
      ...cvData,
      skills: updatedSkills
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const addSkillCategory = () => {
    const updatedData = {
      ...cvData,
      skills: [
        ...cvData.skills,
        {
          category: '',
          items: []
        }
      ]
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const removeSkillCategory = (index: number) => {
    const updatedData = {
      ...cvData,
      skills: cvData.skills.filter((_, i) => i !== index)
    };
    setCVData(updatedData);
    onDataChange?.(updatedData);
  };

  const addSkillItem = (categoryIndex: number, skill: string) => {
    if (skill.trim()) {
      const updatedSkills = [...cvData.skills];
      updatedSkills[categoryIndex].items.push(skill.trim());
      handleSkillsChange(categoryIndex, 'items', updatedSkills[categoryIndex].items);
    }
  };

  const removeSkillItem = (categoryIndex: number, skillIndex: number) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills[categoryIndex].items.splice(skillIndex, 1);
    handleSkillsChange(categoryIndex, 'items', updatedSkills[categoryIndex].items);
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'skills', name: 'Skills', icon: '⚡' }
  ] as const;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[95vh] flex flex-col transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#3a4660] to-white dark:from-teal-300 dark:to-blue-400 border-b border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-200 flex items-center gap-3">
            Edit CV Information
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-80 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Tabs Sidebar */}
          <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'border border-gray-300 bg-gradient-to-r from-[#3a4660] to-gray-300 text-white rounded-md transition-colors shadow-lg'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-semibold">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mt-6 pl-6 pr-6 pb-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.position}
                      onChange={(e) => handlePersonalInfoChange('position', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g: Frontend Developer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Hanoi, Vietnam"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website (optional)</label>
                    <input
                      type="url"
                      value={cvData.personalInfo.website || ''}
                      onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                  <textarea
                    value={cvData.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write a brief introduction about yourself, experience and career goals..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between sticky top-0 bg-white pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 border border-gray-300 bg-gradient-to-r from-[#3a4660] to-gray-300 text-white rounded-md hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors"
                  >
                    + Add Experience
                  </button>
                </div>

                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">Experience #{index + 1}</h4>
                        {cvData.experience.length > 1 && (
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g: Frontend Developer"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Company name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g: 2022 - Present"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe your job responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between sticky top-0 bg-white pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 border border-gray-300 bg-gradient-to-r from-[#3a4660] to-gray-300 text-white rounded-md hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors"
                  >
                    + Add Education
                  </button>
                </div>

                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">Education #{index + 1}</h4>
                        {cvData.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g: Bachelor of Computer Science"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School/University</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="University name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                          <input
                            type="text"
                            value={edu.period}
                            onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g: 2017 - 2021"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GPA (optional)</label>
                          <input
                            type="text"
                            value={edu.gpa || ''}
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g: 3.5/4.0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Relevant coursework, achievements, or additional information..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between sticky top-0 bg-white pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                  <button
                    onClick={addSkillCategory}
                    className="px-4 py-2 border border-gray-300 bg-gradient-to-r from-[#3a4660] to-gray-300 text-white rounded-md hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors"
                  >
                    + Add Category
                  </button>
                </div>

                <div className="space-y-6">
                  {cvData.skills.map((skillGroup, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">Category #{index + 1}</h4>
                        {cvData.skills.length > 1 && (
                          <button
                            onClick={() => removeSkillCategory(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                        <input
                          type="text"
                          value={skillGroup.category}
                          onChange={(e) => handleSkillsChange(index, 'category', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g: Programming Languages, Frontend Technologies"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {skillGroup.items.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={skill}
                                onChange={(e) => {
                                  const updatedItems = [...skillGroup.items];
                                  updatedItems[skillIndex] = e.target.value;
                                  handleSkillsChange(index, 'items', updatedItems);
                                }}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Skill name"
                              />
                              <button
                                onClick={() => removeSkillItem(index, skillIndex)}
                                className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const updatedItems = [...skillGroup.items, ''];
                              handleSkillsChange(index, 'items', updatedItems);
                            }}
                            className="w-full px-3 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
                          >
                            + Add Skill
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-gradient-to-r from-[#3a4660] to-gray-300 text-white rounded-md hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
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

  const tabs = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: '👤' },
    { id: 'experience', name: 'Kinh nghiệm', icon: '💼' },
    { id: 'education', name: 'Học vấn', icon: '🎓' },
    { id: 'skills', name: 'Kỹ năng', icon: '⚡' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa thông tin CV</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-full">
          {/* Tabs Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-blue-200 border'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí ứng tuyển</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.position}
                      onChange={(e) => handlePersonalInfoChange('position', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ví dụ: Frontend Developer"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Hà Nội, Việt Nam"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website (tùy chọn)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu bản thân</label>
                  <textarea
                    value={cvData.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Viết một đoạn giới thiệu ngắn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Kinh nghiệm làm việc</h3>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Thêm kinh nghiệm
                  </button>
                </div>

                {cvData.experience.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">Kinh nghiệm #{index + 1}</h4>
                      {cvData.experience.length > 1 && (
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Xóa
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí công việc</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ví dụ: Frontend Developer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Công ty</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tên công ty"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ví dụ: 2022 - Hiện tại"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mô tả chi tiết công việc và trách nhiệm..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'education' || activeTab === 'skills') && (
              <div className="text-center text-gray-600 py-12">
                <p className="text-lg mb-2">Phần này đang được phát triển</p>
                <p className="text-sm">Vui lòng quay lại sau để cập nhật thông tin {activeTab === 'education' ? 'học vấn' : 'kỹ năng'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
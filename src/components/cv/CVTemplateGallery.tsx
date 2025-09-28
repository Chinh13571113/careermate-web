'use client';

import { useState } from 'react';
import { CV_TEMPLATES } from '@/types/cv';
import { Check } from 'lucide-react';

interface Props {
  onTemplateSelect?: (templateId: string) => void;
}

export default function CVTemplateGallery({ onTemplateSelect }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onTemplateSelect?.(templateId);
  };

  const getTemplatePreview = (templateId: string) => {
    switch (templateId) {
      case 'minimalist':
        return (
          <div className="w-full h-48 bg-white border border-gray-200 rounded-lg overflow-hidden p-4 text-[8px] leading-tight">
            <div className="text-center border-b border-gray-200 pb-2 mb-2">
              <div className="font-bold text-gray-800 mb-1">NGUYỄN VĂN A</div>
              <div className="text-gray-600 text-[6px] uppercase tracking-widest">FRONTEND DEVELOPER</div>
              <div className="text-gray-500 text-[6px] mt-1">email • phone • location</div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="font-medium text-gray-800 text-[6px] uppercase mb-1">EXPERIENCE</div>
                <div className="border-l border-gray-200 pl-2">
                  <div className="font-medium text-[6px]">Frontend Developer</div>
                  <div className="text-gray-600 text-[5px] italic">TechCorp Vietnam</div>
                  <div className="text-gray-700 text-[5px]">Phát triển ứng dụng web...</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-800 text-[6px] uppercase mb-1">SKILLS</div>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-gray-100 text-[5px] px-1 rounded">React</span>
                  <span className="bg-gray-100 text-[5px] px-1 rounded">JS</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'modern':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-3 text-[8px]">
              <div className="font-bold mb-1">NGUYỄN VĂN A</div>
              <div className="text-blue-100 text-[6px]">FRONTEND DEVELOPER</div>
              <div className="text-blue-100 text-[5px] mt-1">📧 email 📱 phone</div>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <div className="font-bold text-blue-600 text-[6px] border-b border-blue-600 pb-1">About me</div>
                <div className="text-[5px] text-gray-700">Kinh nghiệm phát triển...</div>
              </div>
              <div className="bg-white border-l-2 border-blue-600 p-2">
                <div className="font-bold text-[6px]">Frontend Developer</div>
                <div className="text-blue-600 text-[5px]">TechCorp</div>
              </div>
            </div>
          </div>
        );
      
      case 'classic':
        return (
          <div className="w-full h-48 bg-white border border-gray-200 rounded-lg overflow-hidden p-4 text-[8px]">
            <div className="text-center border-b-2 border-gray-800 pb-2 mb-2">
              <div className="font-serif font-bold text-gray-800 mb-1">NGUYỄN VĂN A</div>
              <div className="text-gray-600 text-[6px]">Frontend Developer</div>
              <div className="text-gray-600 text-[5px] mt-1">email • phone • location</div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="font-serif font-bold text-gray-800 text-[6px] uppercase">Mục tiêu</div>
                <div className="text-[5px] text-gray-700">Phát triển sự nghiệp...</div>
              </div>
              <div>
                <div className="font-serif font-bold text-gray-800 text-[6px] uppercase">Kinh nghiệm</div>
                <div className="text-[6px]">
                  <div className="font-bold">Frontend Developer</div>
                  <div className="text-gray-600 italic text-[5px]">TechCorp Vietnam</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'creative':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 text-[8px] rounded-br-xl relative">
              <div className="absolute top-1 right-1 w-3 h-3 border border-white rounded-full opacity-20"></div>
              <div className="font-bold mb-1">NGUYỄN VĂN B</div>
              <div className="text-[6px] opacity-90">FRONTEND DEVELOPER</div>
              <div className="text-[5px] opacity-80 mt-1">✉ email 📞 phone</div>
            </div>
            <div className="p-3 space-y-2">
              <div className="bg-white p-2 rounded-lg border-l-2 border-purple-500">
                <div className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-[6px]">
                  ✨ Giới thiệu
                </div>
                <div className="text-[5px] text-gray-700">Creative developer...</div>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <div className="text-[5px]">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1 rounded-full text-[4px]">React</span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1 rounded-full text-[4px] ml-1">Design</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'professional':
        return (
          <div className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white p-3">
              <div className="border-b-2 border-gray-800 pb-2 mb-2">
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <div>
                    <div className="font-bold text-gray-800 mb-1">NGUYỄN VĂN A</div>
                    <div className="text-gray-600 text-[6px]">Frontend Developer</div>
                    <div className="text-[5px] text-gray-700">Professional summary...</div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-[5px]">
                    <div className="font-bold">Liên hệ</div>
                    <div>Email: email</div>
                    <div>Phone: phone</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[6px]">
                <div>
                  <div className="font-bold border-b border-gray-300 pb-1 mb-1">EXPERIENCE</div>
                  <div className="text-[5px]">
                    <div className="font-bold">Frontend Developer</div>
                    <div className="text-gray-600">TechCorp</div>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <div className="font-bold text-[5px] mb-1">SKILLS</div>
                  <div className="space-y-1">
                    <div className="text-[4px] bg-white px-1 rounded">React</div>
                    <div className="text-[4px] bg-white px-1 rounded">JavaScript</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Preview</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Chọn Template CV</h2>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        {CV_TEMPLATES.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={`
              relative border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg
              ${selectedTemplate === template.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {/* Selection Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Template Preview */}
                <div className="col-span-1">
                  {getTemplatePreview(template.id)}
                </div>
                
                {/* Template Info */}
                <div className="col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        template.id === 'minimalist' ? 'bg-gray-100' :
                        template.id === 'modern' ? 'bg-blue-100' :
                        template.id === 'classic' ? 'bg-amber-100' :
                        template.id === 'creative' ? 'bg-purple-100' :
                        'bg-slate-100'
                      }`}>
                        <span>{template.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{template.name}</h3>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {template.features.map((feature, index) => (
                        <span 
                          key={index}
                          className={`text-xs px-3 py-1 rounded-full ${
                            template.id === 'minimalist' ? 'bg-gray-200 text-gray-700' :
                            template.id === 'modern' ? 'bg-blue-200 text-blue-700' :
                            template.id === 'classic' ? 'bg-amber-200 text-amber-700' :
                            template.id === 'creative' ? 'bg-purple-200 text-purple-700' :
                            'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template.id);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTemplate === template.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedTemplate === template.id ? 'Đã chọn' : 'Chọn template'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-100">
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Tạo CV với template đã chọn
        </button>
      </div>
    </div>
  );
}
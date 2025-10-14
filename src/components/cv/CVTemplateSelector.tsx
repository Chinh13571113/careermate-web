'use client';

import { useState } from 'react';
import { CV_TEMPLATES, type CVTemplate } from '@/types/cv';
import { Check, Image } from 'lucide-react';

interface Props {
  onTemplateSelect?: (templateId: string) => void;
}

export default function CVTemplateSelector({ onTemplateSelect }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onTemplateSelect?.(templateId);
  };

  // Tạo preview cho mỗi template (placeholder cho hình ảnh)
  const getTemplatePreview = (template: CVTemplate) => {
    return (
      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-200">
        {/* Placeholder cho hình ảnh template - có thể thay thế bằng <img> */}
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">{template.icon}</div>
          <div className="text-center px-4">
            <h4 className="font-semibold text-gray-700 text-sm mb-1">{template.name}</h4>
            <p className="text-xs text-[#6B7280] line-clamp-2">{template.description}</p>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-3 shadow-lg">
              {selectedTemplate === template.id ? (
                <Check className="w-6 h-6 text-blue-500" />
              ) : (
                <Image className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Selection indicator */}
        {selectedTemplate === template.id && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Sticky Header */}
      
      
      {/* Scrollable Content */}
      <div className="flex-1 mt overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {CV_TEMPLATES.map((template) => (
            <div key={template.id} className="space-y-3">
              {/* Template Preview Card */}
              <div
                onClick={() => handleSelectTemplate(template.id)}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105
                  ${selectedTemplate === template.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''}
                `}
              >
                {getTemplatePreview(template)}
              </div>
              
              {/* Template Info */}
              <div className="space-y-2">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 text-sm">{template.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
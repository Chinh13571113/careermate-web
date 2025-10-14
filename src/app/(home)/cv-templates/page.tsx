'use client';

import { useState } from 'react';
import CVTemplateSelector from '@/components/cv/CVTemplateSelector';
import CVPreview from '@/components/cv/CVPreview';
import CVEditForm from '@/components/cv/CVEditForm';
import { SAMPLE_CV_DATA, type CVData } from '@/types/cv';

export default function CVTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [cvData, setCVData] = useState<CVData>(SAMPLE_CV_DATA);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleDataChange = (newData: CVData) => {
    setCVData(newData);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Full width without container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Template Selector - Full height */}
        <div className="lg:col-span-1 h-full overflow-y-auto bg-white">
          <CVTemplateSelector onTemplateSelect={handleTemplateSelect} />
        </div>

        {/* CV Preview - Full height */}
        <div className="lg:col-span-2 h-full overflow-y-auto bg-gray-100">
          <CVPreview 
            templateId={selectedTemplate} 
            cvData={cvData}
            onEditClick={handleEditClick}
          />
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditFormOpen && (
        <CVEditForm
          initialData={cvData}
          onDataChange={handleDataChange}
          onClose={handleCloseEditForm}
        />
      )}
    </div>
  );
}
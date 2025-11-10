import Card from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import React, { useState } from "react";

const AttachedCV = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Card title="Your Attached CV">
      {/* Button upload */}
      <label
        htmlFor="pdf-upload"
        className="flex items-center w-35 space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
      >
        <Upload className="w-4 h-4" />
        <span>Upload CV</span>
      </label>

      {/* Input file*/}
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        className="hidden "
        onChange={handleFileChange}
      />

      {/* Display file */}
      {file && (
        <div className="flex items-center space-x-2 p-2">
          {/* icon pdf */}
          <FileText className="w-6 h-6 text-blue-600" />
          {/* File Name*/}
          <span className="text-sm font-normal">{file.name}</span>
        </div>
      )}
    </Card>
  );
};

export default AttachedCV;

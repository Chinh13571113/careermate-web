"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Search, Sparkles } from "lucide-react";
import { analyzeCVATS } from "@/lib/cv-ats-api";
import toast from "react-hot-toast";
import CVSidebar from "@/components/layout/CVSidebar";

export default function AICVChecker() {
  const router = useRouter();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith('.doc')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB
          setCvFile(file);
        } else {
          toast.error("File quá lớn. Vui lòng chọn file dưới 5MB");
        }
      } else {
        toast.error("Chỉ hỗ trợ file PDF hoặc DOCX");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB
        setCvFile(file);
      } else {
        toast.error("File quá lớn. Vui lòng chọn file dưới 5MB");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) {
      toast.error("Vui lòng tải lên file CV");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeCVATS(jobDescription, cvFile);
      
      // Store result in sessionStorage to pass to result page
      sessionStorage.setItem('cv_ats_result', JSON.stringify(result));
      
      toast.success("Phân tích CV thành công!");
      router.push('/candidate/ai-cv-result');
    } catch (error: any) {
      console.error('Error analyzing CV:', error);
      toast.error(error.message || "Có lỗi xảy ra khi phân tích CV");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <CVSidebar activePage="cm-profile" />
          </aside>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Điều chỉnh CV để tăng cơ hội phỏng vấn</h1>
              </div>
              <p className="text-green-50 text-lg">
                Tăng cơ hội phỏng vấn nhờ dễ xuất cải thiện CV, chấm điểm theo ATS và tự động tạo Cover Letter - tùy chỉnh theo từng vị trí.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Step 1: Upload CV */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Tải lên CV<span className="text-red-500">*</span>
                  </h2>
                </div>

                {/* Upload Options */}
                <div className="flex gap-3 mb-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 font-medium">
                      <Upload className="w-4 h-4" />
                      Tải lên tệp
                    </div>
                  </label>
                  
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("Chức năng đang phát triển")}
                  >
                    <FileText className="w-4 h-4" />
                    Sử dụng CV tạo bởi Cake
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("Chức năng đang phát triển")}
                  >
                    <FileText className="w-4 h-4" />
                    Dán văn bản
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{cvFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setCvFile(null)}
                        className="ml-4 text-red-500 hover:text-red-600 font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-green-600 font-semibold text-lg mb-2">
                        Upload new files
                      </p>
                      <p className="text-gray-600 mb-1">
                        Drop files here or click to upload.
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-gray-400">ℹ️</span>
                    Định dạng được hỗ trợ: .pdf, .doc, .docx. Dung lượng tối đa: 5 MB.
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-gray-400">ℹ️</span>
                    Hỗ trợ tất cả các ngôn ngữ.
                  </p>
                </div>
              </div>

              {/* Step 2: Job Description */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Thêm mô tả công việc<span className="text-red-500">*</span>
                  </h2>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Dán văn bản
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("Chức năng đang phát triển")}
                  >
                    <Search className="w-4 h-4" />
                    Tìm kiếm việc làm trên Cake
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("Chức năng đang phát triển")}
                  >
                    <Upload className="w-4 h-4" />
                    Tải lên tệp
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Mô tả công việc càng chi tiết thì Cake AI có thể check CV của bạn tốt hơn."
                  className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none resize-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !cvFile || !jobDescription.trim()}
                  className="px-8 py-3 bg-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Đang phân tích...
                    </span>
                  ) : (
                    "Bắt đầu quét"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import toast from "react-hot-toast";
import { CV } from "@/services/cvService";
import { useCVStore } from "@/stores/cvStore";
import { syncCVWithUpdates } from "@/utils/syncCV";

interface UseCVActionsReturn {
  showPreview: boolean;
  previewUrl: string | null;
  selectedCV: CV | null;
  handleSetDefault: (cv: CV) => void;
  handleSyncToProfile: (cv: CV) => Promise<void>;
  handlePreview: (cv: CV) => void;
  handleClosePreview: () => void;
  handleDelete: (cvId: string) => void;
}

export const useCVActions = (
  uploadedCVs: CV[],
  setUploadedCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  builtCVs: CV[],
  setBuiltCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  draftCVs: CV[],
  setDraftCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  defaultCV: CV | null,
  setDefaultCV: React.Dispatch<React.SetStateAction<CV | null>>
): UseCVActionsReturn => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  // Extract Zustand store action
  const setDefaultCvInStore = useCVStore((state) => state.setDefaultCv);

  const handleSetDefault = (cv: CV) => {
    // Update all local state CVs
    setUploadedCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setBuiltCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setDraftCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setDefaultCV(cv);

    // Sync to Zustand store
    setDefaultCvInStore(cv.id);
    console.log('⭐ Set default synced to Zustand:', cv.id);

    toast.success(`"${cv.name}" set as default CV`);
  };

  const handleSyncToProfile = async (cv: CV) => {
    console.log("🔄 handleSyncToProfile called for CV:", cv.name);
    console.log("📋 CV download URL:", cv.downloadUrl);

    if (!cv.downloadUrl) {
      console.error("❌ Missing CV download URL");
      toast.error("Cannot sync: No download URL available");
      return;
    }

    try {
      toast.loading("Syncing CV with Python parser...", { id: "sync-cv" });
      console.log("📤 Starting Python API sync...");

      // Call the syncCV utility which handles:
      // 1. POST to /api/v1/cv/analyze_cv/ (upload CV)
      // 2. GET polling to /api/v1/cv/task-status/{task_id}/ (get results)
      const parsedData = await syncCVWithUpdates(
        cv.downloadUrl,
        cv.name,
        (update) => {
          console.log("📥 Python sync update:", update);
          
          if (update.taskId) {
            toast.loading(`Processing (Task: ${update.taskId.slice(0, 8)}...)`, { id: "sync-cv" });
          }
          
          if (update.status === "processing") {
            toast.loading("Python is parsing your CV...", { id: "sync-cv" });
          }
        }
      );

      console.log("✅ Python parsing completed:", parsedData);
      console.log("� Full data structure:", JSON.stringify(parsedData, null, 2));
      
      // Top-level fields (flat structure)
      if (parsedData.name || parsedData.email) {
        console.log("👤 Top-level Personal Data:");
        console.log("  - Name:", parsedData.name);
        console.log("  - Email:", parsedData.email);
        console.log("  - Phone:", parsedData.phone);
        console.log("  - Title:", parsedData.title);
      }
      
      // Nested personal_info
      if (parsedData.personal_info) {
        console.log("�👤 Personal Info (nested):", parsedData.personal_info);
        console.log("  - Name:", parsedData.personal_info.name);
        console.log("  - Email:", parsedData.personal_info.email);
        console.log("  - Phone:", parsedData.personal_info.phone);
        console.log("  - Title:", parsedData.personal_info.title);
        console.log("  - Address:", parsedData.personal_info.address);
      }
      
      console.log("🎓 Education count:", parsedData.education?.length || 0);
      if (parsedData.education && parsedData.education.length > 0) {
        console.log("🎓 Education:", parsedData.education);
      }
      
      console.log("💼 Experience count:", parsedData.experience?.length || 0);
      if (parsedData.experience && parsedData.experience.length > 0) {
        console.log("💼 Experience:", parsedData.experience);
      }
      
      console.log("📁 Projects count:", parsedData.projects?.length || 0);
      if (parsedData.projects && parsedData.projects.length > 0) {
        console.log("📁 Projects:", parsedData.projects);
      }
      
      console.log("🛠️ Skills type:", typeof parsedData.skills);
      console.log("🛠️ Skills:", parsedData.skills);
      
      console.log("📜 Certificates/Certifications:", parsedData.certificates || parsedData.certifications);
      
      console.log("🌐 Languages:", parsedData.languages);
      
      console.log("💬 Feedback:", parsedData.feedback);
      if (parsedData.feedback) {
        console.log("  - Overall Score:", parsedData.feedback.overall_score);
        console.log("  - Strengths:", parsedData.feedback.strengths);
        console.log("  - Improvements:", parsedData.feedback.improvements);
      }

      const displayName = parsedData.name || parsedData.personal_info?.name || 'Profile updated';
      toast.success(
        `CV parsed successfully! ${displayName}`, 
        { id: "sync-cv" }
      );

    } catch (err: any) {
      console.error("❌ Python sync error:", err);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error stack:", err.stack);
      toast.error(err.message || "Failed to sync CV with Python", { id: "sync-cv" });
    }
  };

  const handlePreview = (cv: CV) => {
    console.log('🔍 Preview CV:', {
      id: cv.id,
      name: cv.name,
      downloadUrl: cv.downloadUrl,
      fileUrl: cv.fileUrl,
      storagePath: cv.storagePath,
    });

    setSelectedCV(cv);
    // Use downloadUrl as primary, fallback to fileUrl for backward compatibility
    const url = cv.downloadUrl || cv.fileUrl || null;

    if (!url) {
      console.error('❌ No URL available for preview:', cv);
      toast.error('Cannot preview: No file URL available');
      return;
    }

    console.log('✅ Setting preview URL:', url);
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedCV(null);
    setPreviewUrl(null);
  };

  const handleDelete = (cvId: string) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      setUploadedCVs(prev => prev.filter(cv => cv.id !== cvId));
      setBuiltCVs(prev => prev.filter(cv => cv.id !== cvId));
      setDraftCVs(prev => prev.filter(cv => cv.id !== cvId));

      // Update default if deleted CV was default
      if (defaultCV?.id === cvId) {
        const remaining = [...uploadedCVs, ...builtCVs, ...draftCVs].filter(cv => cv.id !== cvId);
        setDefaultCV(remaining[0] || null);
      }

      toast.success("CV deleted");
    }
  };

  return {
    showPreview,
    previewUrl,
    selectedCV,
    handleSetDefault,
    handleSyncToProfile,
    handlePreview,
    handleClosePreview,
    handleDelete
  };
};

import { useState } from "react";
import toast from "react-hot-toast";
import { CV } from "@/services/cvService";
import { useCVStore } from "@/stores/cvStore";
import { syncCVWithUpdates } from "@/utils/syncCV";
import { 
  setResumeStatus, 
  updateResumeType,
  addEducation,
  addWorkExperience,
  addCertificate,
  addHighlightProject,
  addSkill,
  addForeignLanguage,
  addAward,
} from "@/lib/resume-api";
import { ParsedCV } from "@/types/parsedCV";
import { normalizeParsedCVData, NormalizedCVData } from "@/lib/cv-parse-normalizer";

interface UseCVActionsReturn {
  showPreview: boolean;
  previewUrl: string | null;
  selectedCV: CV | null;
  // Sync dialog states
  showSyncSummaryDialog: boolean;
  showSyncConfirmDialog: boolean;
  parsedCVData: ParsedCV | null;
  syncingCV: CV | null;
  isSyncing: boolean;
  // Actions
  handleSetDefault: (cv: CV) => Promise<void>;
  handleSyncToProfile: (cv: CV) => Promise<void>;
  handlePreview: (cv: CV) => void;
  handleClosePreview: () => void;
  handleDelete: (cvId: string) => void;
  // Sync dialog handlers
  handleCloseSyncSummaryDialog: () => void;
  handleCloseSyncConfirmDialog: () => void;
  handleConfirmSync: (editedData: ParsedCV) => Promise<void>;
  handleConfirmDraftConversion: () => Promise<void>;
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
  
  // Sync dialog states
  const [showSyncSummaryDialog, setShowSyncSummaryDialog] = useState(false);
  const [showSyncConfirmDialog, setShowSyncConfirmDialog] = useState(false);
  const [parsedCVData, setParsedCVData] = useState<ParsedCV | null>(null);
  const [syncingCV, setSyncingCV] = useState<CV | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Extract Zustand store action
  const setDefaultCvInStore = useCVStore((state) => state.setDefaultCv);

  const handleSetDefault = async (cv: CV) => {
    console.log('⭐ handleSetDefault called for CV:', cv.id, cv.name);
    
    // Get resumeId from CV (id should be the resumeId)
    const resumeId = parseInt(cv.id, 10);
    
    if (isNaN(resumeId)) {
      console.error('❌ Invalid resume ID:', cv.id);
      toast.error('Invalid CV ID');
      return;
    }

    try {
      toast.loading('Setting as default CV...', { id: 'set-default' });

      // Call API to set resume as active
      const response = await setResumeStatus(resumeId, true);
      console.log('✅ API response:', response);

      // Update all local state CVs
      setUploadedCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
      setBuiltCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
      setDraftCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
      setDefaultCV(cv);

      // Sync to Zustand store
      setDefaultCvInStore(cv.id);
      console.log('⭐ Set default synced to Zustand:', cv.id);

      toast.success(`"${cv.name}" set as default CV`, { id: 'set-default' });
    } catch (error: any) {
      console.error('❌ Failed to set default CV:', error);
      toast.error(
        error.response?.data?.message || 'Failed to set default CV',
        { id: 'set-default' }
      );
    }
  };

  const handleSyncToProfile = async (cv: CV) => {
    console.log("🔄 handleSyncToProfile called for CV:", cv.name);
    console.log("📋 CV source:", cv.source);
    console.log("📋 CV type:", cv.type);
    console.log("📋 CV download URL:", cv.downloadUrl);

    // Store the CV being synced
    setSyncingCV(cv);

    // For Created CVs (source = "builder") - Show confirmation dialog to convert to draft
    if (cv.source === "builder") {
      console.log("📋 Builder CV detected - showing confirmation dialog");
      setShowSyncConfirmDialog(true);
      return;
    }

    // For Draft CVs (source = "draft") - no action needed, already a draft
    if (cv.source === "draft") {
      toast("This CV is already a draft", { icon: "ℹ️" });
      setSyncingCV(null);
      return;
    }

    // For Uploaded CVs (source = "upload") - parse and show summary dialog
    if (!cv.downloadUrl) {
      console.error("❌ Missing CV download URL");
      toast.error("Cannot sync: No download URL available");
      setSyncingCV(null);
      return;
    }

    try {
      setIsSyncing(true);
      toast.loading("Parsing CV with AI...", { id: "sync-cv" });
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
            toast.loading("AI is parsing your CV...", { id: "sync-cv" });
          }
        }
      );

      console.log("✅ Python parsing completed:", parsedData);
      toast.dismiss("sync-cv");
      
      // Store parsed data and show summary dialog for review/edit
      setParsedCVData(parsedData);
      setShowSyncSummaryDialog(true);
      setIsSyncing(false);

    } catch (err: any) {
      console.error("❌ Python sync error:", err);
      setIsSyncing(false);
      toast.error(err.message || "Failed to parse CV", { id: "sync-cv" });
    }
  };

  // Close sync summary dialog
  const handleCloseSyncSummaryDialog = () => {
    setShowSyncSummaryDialog(false);
    setParsedCVData(null);
    setSyncingCV(null);
  };

  // Close sync confirm dialog
  const handleCloseSyncConfirmDialog = () => {
    setShowSyncConfirmDialog(false);
    setSyncingCV(null);
  };

  // Confirm sync after reviewing/editing parsed data
  const handleConfirmSync = async (editedData: ParsedCV) => {
    console.log("✅ User confirmed sync with edited data:", editedData);
    
    if (!syncingCV) {
      toast.error("No CV selected for sync");
      return;
    }

    // Get resumeId from syncing CV
    const resumeId = parseInt(syncingCV.id, 10);
    if (isNaN(resumeId)) {
      toast.error("Invalid CV ID");
      return;
    }

    try {
      setIsSyncing(true);
      toast.loading("Saving profile data...", { id: "save-profile" });

      // Normalize ParsedCV data to Java backend format
      const normalizedData: NormalizedCVData = normalizeParsedCVData(editedData);
      console.log("📤 Normalized data for backend:", normalizedData);

      // Track success/failure counts
      const results = {
        education: { success: 0, failed: 0 },
        experience: { success: 0, failed: 0 },
        projects: { success: 0, failed: 0 },
        skills: { success: 0, failed: 0 },
        certificates: { success: 0, failed: 0 },
        languages: { success: 0, failed: 0 },
        awards: { success: 0, failed: 0 },
      };

      // Save Education items
      for (const edu of normalizedData.educations) {
        try {
          await addEducation({
            resumeId,
            school: edu.school,
            major: edu.major,
            degree: edu.degree,
            startDate: edu.startDate,
            endDate: edu.endDate,
          });
          results.education.success++;
        } catch (err) {
          console.error("Failed to save education:", edu, err);
          results.education.failed++;
        }
      }

      // Save Work Experience items
      for (const exp of normalizedData.workExperiences) {
        try {
          await addWorkExperience({
            resumeId,
            jobTitle: exp.jobTitle,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
            project: exp.project,
          });
          results.experience.success++;
        } catch (err) {
          console.error("Failed to save work experience:", exp, err);
          results.experience.failed++;
        }
      }

      // Save Highlight Projects
      for (const proj of normalizedData.highlightProjects) {
        try {
          await addHighlightProject({
            resumeId,
            name: proj.name,
            startDate: proj.startDate,
            endDate: proj.endDate || proj.startDate, // Backend requires endDate
            description: proj.description,
            projectUrl: proj.projectUrl,
          });
          results.projects.success++;
        } catch (err) {
          console.error("Failed to save project:", proj, err);
          results.projects.failed++;
        }
      }

      // Save Skills
      for (const skill of normalizedData.skills) {
        try {
          await addSkill({
            resumeId,
            skillType: skill.skillType,
            skillName: skill.skillName,
            yearOfExperience: skill.yearOfExperience,
          });
          results.skills.success++;
        } catch (err) {
          console.error("Failed to save skill:", skill, err);
          results.skills.failed++;
        }
      }

      // Save Certificates
      for (const cert of normalizedData.certificates) {
        try {
          await addCertificate({
            resumeId,
            name: cert.name,
            organization: cert.organization,
            getDate: cert.getDate,
            certificateUrl: cert.certificateUrl,
            description: cert.description,
          });
          results.certificates.success++;
        } catch (err) {
          console.error("Failed to save certificate:", cert, err);
          results.certificates.failed++;
        }
      }

      // Save Foreign Languages
      for (const lang of normalizedData.foreignLanguages) {
        try {
          await addForeignLanguage({
            resumeId,
            language: lang.language,
            level: lang.level,
          });
          results.languages.success++;
        } catch (err) {
          console.error("Failed to save language:", lang, err);
          results.languages.failed++;
        }
      }

      // Save Awards
      for (const award of normalizedData.awards) {
        try {
          await addAward({
            resumeId,
            name: award.name,
            organization: award.organization,
            getDate: award.getDate,
            description: award.description,
          });
          results.awards.success++;
        } catch (err) {
          console.error("Failed to save award:", award, err);
          results.awards.failed++;
        }
      }

      // Log results
      console.log("📊 Sync results:", results);

      // Calculate total success and failures
      const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
      const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);

      if (totalFailed === 0) {
        toast.success(`Profile updated successfully! (${totalSuccess} items synced)`, { id: "save-profile" });
      } else if (totalSuccess > 0) {
        toast.success(`Profile partially updated: ${totalSuccess} items synced, ${totalFailed} failed`, { id: "save-profile" });
      } else {
        toast.error("Failed to sync any data to profile", { id: "save-profile" });
      }

      setShowSyncSummaryDialog(false);
      setParsedCVData(null);
      setSyncingCV(null);
      setIsSyncing(false);

    } catch (err: any) {
      console.error("❌ Save profile error:", err);
      setIsSyncing(false);
      toast.error(err.message || "Failed to save profile", { id: "save-profile" });
    }
  };

  // Confirm draft conversion (WEB → DRAFT)
  const handleConfirmDraftConversion = async () => {
    console.log("✅ User confirmed draft conversion");
    
    if (!syncingCV) {
      toast.error("No CV selected");
      return;
    }

    const resumeId = parseInt(syncingCV.id, 10);
    if (isNaN(resumeId)) {
      toast.error("Invalid CV ID");
      return;
    }

    try {
      setIsSyncing(true);
      toast.loading("Converting to draft...", { id: "convert-draft" });

      // Call API to change type from WEB to DRAFT
      await updateResumeType(resumeId, "DRAFT");

      // Update local state
      const updatedCV = { ...syncingCV, type: "DRAFT" };
      
      // Move from builtCVs to draftCVs
      setBuiltCVs(prev => prev.filter(cv => cv.id !== syncingCV.id));
      setDraftCVs(prev => [...prev, updatedCV as CV]);

      toast.success("CV converted to draft successfully!", { id: "convert-draft" });
      setShowSyncConfirmDialog(false);
      setSyncingCV(null);
      setIsSyncing(false);

    } catch (err: any) {
      console.error("❌ Convert draft error:", err);
      setIsSyncing(false);
      toast.error(err.message || "Failed to convert to draft", { id: "convert-draft" });
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
    // Sync dialog states
    showSyncSummaryDialog,
    showSyncConfirmDialog,
    parsedCVData,
    syncingCV,
    isSyncing,
    // Actions
    handleSetDefault,
    handleSyncToProfile,
    handlePreview,
    handleClosePreview,
    handleDelete,
    // Sync dialog handlers
    handleCloseSyncSummaryDialog,
    handleCloseSyncConfirmDialog,
    handleConfirmSync,
    handleConfirmDraftConversion
  };
};

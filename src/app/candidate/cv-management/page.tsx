"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CVSidebar from "@/components/layout/CVSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import { CV } from "@/services/cvService";
import { useCVUpload } from "@/hooks/useCVUpload";
import { useCVActions } from "@/hooks/useCVActions";
import { useResumeData } from "@/hooks/useResumeData";
import { resumesToCVsSync } from "@/utils/resumeConverter";
import { useAuthStore } from "@/store/use-auth-store";
import { useCVStore } from "@/stores/cvStore"; // Import CV Store for Redux DevTools
import { checkCVBuilderAccess } from "@/lib/entitlement-api";
import { getMyInvoice, type Invoice } from "@/lib/invoice-api";
import { Lock, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import {
  CVCard,
  CVCardHorizontal,
  CVTabs,
  CVGrid,
  EmptyState,
  PreviewModal,
  NoActiveCV,
  CVPageSkeleton
} from "@/components/cv-management";

type TabType = "built" | "uploaded" | "draft";

const CVManagementPage = () => {
  const router = useRouter();
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  const [activeTab, setActiveTab] = useState<TabType>("built");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [currentPackage, setCurrentPackage] = useState<string>("FREE");
  
  // Initialize CV Store (for Redux DevTools visibility)
  const cvStore = useCVStore();
  const { setCVs, setDefaultCv: setDefaultCvInStore } = cvStore;
  
  // Get user info and profile fetcher
  const { candidateId, user, fetchCandidateProfile } = useAuthStore();
  const userId = candidateId || user?.id;

  // Ensure candidateId is loaded on mount
  useEffect(() => {
    if (!candidateId && user) {
      fetchCandidateProfile();
    }
  }, [candidateId, user, fetchCandidateProfile]);

  // Fetch invoice to check package
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const invoiceData = await getMyInvoice();
        setInvoice(invoiceData);
        setCurrentPackage(invoiceData.packageName || "FREE");
      } catch (error: any) {
        if (error.message === 'NO_INVOICE_FOUND') {
          setCurrentPackage("FREE");
        }
      }
    };
    fetchInvoice();
  }, []);

  // Fetch resumes from API
  const {
    webResumes,
    uploadedResumes,
    draftResumes,
    activeResume,
    loading,
    error,
    refresh
  } = useResumeData();

  // CV States - converted from API
  const [uploadedCVs, setUploadedCVs] = useState<CV[]>([]);
  const [builtCVs, setBuiltCVs] = useState<CV[]>([]);
  const [draftCVs, setDraftCVs] = useState<CV[]>([]);
  const [defaultCV, setDefaultCV] = useState<CV | null>(null);

  // Convert API data to CV format AND sync to Zustand store
  useEffect(() => {
    if (!loading && !error) {
      const uploadedCVsConverted = resumesToCVsSync(uploadedResumes, userId);
      const builtCVsConverted = resumesToCVsSync(webResumes, userId);
      const draftCVsConverted = resumesToCVsSync(draftResumes, userId);

      setUploadedCVs(uploadedCVsConverted);
      setBuiltCVs(builtCVsConverted);
      setDraftCVs(draftCVsConverted);

      // ✅ Sync ALL CVs to Zustand store
      const allCVs = [
        ...uploadedCVsConverted,
        ...builtCVsConverted,
        ...draftCVsConverted,
      ];
      
      console.log('🔄 Syncing CVs to Zustand store:', allCVs);
      setCVs(allCVs);

      // Set default CV if there's an active resume
      if (activeResume) {
        const activeCV = allCVs.find((cv) => cv.id === activeResume.resumeId.toString());
        if (activeCV) {
          setDefaultCV(activeCV);
          // ✅ Also sync to Zustand store
          setDefaultCvInStore(activeCV.id);
          console.log('⭐ Active CV set as default:', activeCV.id);
        }
      } else {
        setDefaultCV(null);
      }
    }
  }, [webResumes, uploadedResumes, draftResumes, activeResume, loading, error, userId, setCVs, setDefaultCvInStore]);

  // Custom Hooks
  const uploadHook = useCVUpload(uploadedCVs, setUploadedCVs, defaultCV, setDefaultCV);
  const actionsHook = useCVActions(
    uploadedCVs,
    setUploadedCVs,
    builtCVs,
    setBuiltCVs,
    draftCVs,
    setDraftCVs,
    defaultCV,
    setDefaultCV
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  const currentCVs = activeTab === "uploaded" ? uploadedCVs : activeTab === "built" ? builtCVs : draftCVs;
  const hasAnyResumes = uploadedCVs.length > 0 || builtCVs.length > 0 || draftCVs.length > 0;

  // Handler for Create CV button
  const handleCreateCV = async () => {
    // Check package limits
    const builtCVCount = builtCVs.length;
    
    // Determine limits based on package
    let canCreate = false;
    let limitMessage = '';
    
    if (currentPackage === 'PREMIUM') {
      // PREMIUM: Unlimited
      canCreate = true;
    } else if (currentPackage === 'PLUS') {
      // PLUS: Max 5 CV builders
      if (builtCVCount < 5) {
        canCreate = true;
      } else {
        limitMessage = `Bạn đã tạo đủ 5 CV (giới hạn của gói PLUS). Nâng cấp lên PREMIUM để tạo không giới hạn!`;
      }
    } else {
      // FREE: Max 1 CV builder
      if (builtCVCount < 1) {
        canCreate = true;
      } else {
        limitMessage = `Bạn đã tạo đủ 1 CV (giới hạn của gói FREE). Nâng cấp lên PLUS hoặc PREMIUM để tạo thêm!`;
      }
    }

    if (!canCreate) {
      setShowUpgradeModal(true);
      toast.error(limitMessage, {
        duration: 4500,
        icon: '🔒',
      });
      return;
    }

    // If can create, navigate to CV builder
    const cvBuilderUrl = `/cv-templates?data=%7B%22template%22%3A%22modern%22%2C%22cvData%22%3A%7B%22personalInfo%22%3A%7B%22fullName%22%3A%22Nhat%22%2C%22position%22%3A%22Frontend%20Developer%22%2C%22email%22%3A%22htqnhat1%40gmail.com%22%2C%22phone%22%3A%2209290987432%22%2C%22location%22%3A%22HCM%22%2C%22website%22%3A%22no%22%2C%22photoUrl%22%3A%22https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fcm-storage-86d7d.firebasestorage.app%2Fo%2Fcareermate-files%252Fcandidates%252Fhtqnhat1%2540gmail.com%252Fprofile%252F1763976168166_FPT_logo_new.svg%3Falt%3Dmedia%26token%3D7ea6ed01-285e-4f57-aa47-11b1e2aa2b58%22%2C%22summary%22%3A%22abc%22%7D%2C%22experience%22%3A%5B%5D%2C%22education%22%3A%5B%7B%22id%22%3A%221%22%2C%22school%22%3A%22FPT%22%2C%22degree%22%3A%22Bachelor%20of%20Science%22%2C%22major%22%3A%22IT%22%2C%22startMonth%22%3A%2202%22%2C%22startYear%22%3A%222021%22%2C%22endMonth%22%3A%2207%22%2C%22endYear%22%3A%222025%22%7D%5D%2C%22skills%22%3A%5B%7B%22id%22%3A%22core-group-1%22%2C%22name%22%3A%22Core%20Skills%22%2C%22items%22%3A%5B%7B%22id%22%3A%221%22%2C%22skill%22%3A%22Java%22%2C%22experience%22%3A%222%22%7D%2C%7B%22id%22%3A%222%22%2C%22skill%22%3A%22HTML%22%2C%22experience%22%3A%226%22%7D%2C%7B%22id%22%3A%224%22%2C%22skill%22%3A%22Ruby%22%2C%22experience%22%3A%229%22%7D%2C%7B%22id%22%3A%225%22%2C%22skill%22%3A%22Css%22%2C%22experience%22%3A%2210%22%7D%5D%7D%5D%2C%22languages%22%3A%5B%7B%22id%22%3A%221%22%2C%22language%22%3A%22English%22%2C%22level%22%3A%22Beginner%22%7D%2C%7B%22id%22%3A%222%22%2C%22language%22%3A%22Japanese%22%2C%22level%22%3A%22Elementary%22%7D%5D%2C%22certifications%22%3A%5B%7B%22id%22%3A%221%22%2C%22name%22%3A%22No%22%2C%22org%22%3A%22No%22%2C%22month%22%3A%2202%22%2C%22year%22%3A%222020%22%2C%22url%22%3A%22No%22%2C%22desc%22%3A%22%20No%20have%20anything%22%7D%5D%2C%22projects%22%3A%5B%7B%22id%22%3A%221%22%2C%22name%22%3A%22NO%22%2C%22startMonth%22%3A%2202%22%2C%22startYear%22%3A%222023%22%2C%22endMonth%22%3A%2202%22%2C%22endYear%22%3A%222025%22%2C%22description%22%3A%22No%20have%22%2C%22url%22%3A%22No%20have%22%2C%22working%22%3Afalse%7D%5D%2C%22awards%22%3A%5B%7B%22id%22%3A%221%22%2C%22name%22%3A%22No%20have%22%2C%22organization%22%3A%22no%20have%22%2C%22month%22%3A%2202%22%2C%22year%22%3A%222023%22%2C%22description%22%3A%22no%20have%20anything%22%7D%5D%7D%2C%22profile%22%3A%7B%22fullName%22%3A%22Nhat%22%2C%22title%22%3A%22Frontend%20Developer%22%2C%22phone%22%3A%2209290987432%22%2C%22dob%22%3A%222002-11-23%22%2C%22gender%22%3A%22Male%22%2C%22address%22%3A%22HCM%22%2C%22link%22%3A%22no%22%2C%22image%22%3A%22https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fcm-storage-86d7d.firebasestorage.app%2Fo%2Fcareermate-files%252Fcandidates%252Fhtqnhat1%2540gmail.com%252Fprofile%252F1763976168166_FPT_logo_new.svg%3Falt%3Dmedia%26token%3D7ea6ed01-285e-4f57-aa47-11b1e2aa2b58%22%7D%7D`;
    router.push(cvBuilderUrl);
  };

  // Loading state - use skeleton
  if (loading) {
    return <CVPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold mb-2">Failed to load CVs</p>
            <p className="text-gray-600 text-sm mb-4">{error.message}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-[#3a4660] text-white rounded-lg hover:bg-[#2d3750] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px"
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cv-management" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">CV Management</h1>
              <p className="text-gray-600">Upload or create CVs to use during job applications</p>
            </div>

            {/* Default CV Card or No Active CV */}
            {defaultCV ? (
            <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    Active CV
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                    </h2>
                    <p className="text-sm text-white/90">
                      This CV will be used automatically when applying for jobs
                    </p>
                  </div>
                </div>

                <CVCardHorizontal
                  cv={defaultCV}
                  isDefault
                  onSetDefault={() => {}}
                  onPreview={() => actionsHook.handlePreview(defaultCV)}
                  onSync={() => actionsHook.handleSyncToProfile(defaultCV)}
                  onDelete={() => actionsHook.handleDelete(defaultCV.id)}
                />
              </div>
            ) : (
              <NoActiveCV
                hasResumes={hasAnyResumes}
                onUploadClick={() => {
                  // Scroll to upload tab
                  setActiveTab("uploaded");
                  document.getElementById("cv-upload-input")?.click();
                }}
                onBuildClick={() => {
                  // Navigate to CV builder or show modal
                  setActiveTab("built");
                }}
              />
            )}

            {/* Tabs */}
            <CVTabs
              activeTab={activeTab}
              builtCount={builtCVs.length}
              uploadedCount={uploadedCVs.length}
              draftCount={draftCVs.length}
              isUploading={uploadHook.isUploading}
              onTabChange={setActiveTab}
              onUploadClick={uploadHook.handleFileInput}
              onCreateCVClick={handleCreateCV}
            />

            {/* CV Grid or Empty State */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              {currentCVs.length > 0 ? (
                <CVGrid
                  cvs={currentCVs}
                  onSetDefault={actionsHook.handleSetDefault}
                  onSync={actionsHook.handleSyncToProfile}
                  onPreview={actionsHook.handlePreview}
                  onDelete={actionsHook.handleDelete}
                />
              ) : (
                <EmptyState activeTab={activeTab} onFileInput={uploadHook.handleFileInput} />
              )}
            </div>
          </section>
        </div>

        {/* Hidden file input for upload */}
        <input
          id="cv-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={uploadHook.handleFileInput}
        />
      </main>

      {/* Preview Modal */}
      {actionsHook.showPreview && actionsHook.selectedCV && (
        <PreviewModal
          cv={actionsHook.selectedCV}
          previewUrl={actionsHook.previewUrl}
          onClose={actionsHook.handleClosePreview}
        />
      )}

      {/* Upgrade Modal for CV Builder Limit */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">CV Builder Limit Reached</h3>
                  <p className="text-sm text-gray-500">Upgrade to create more CVs</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-medium mb-2">
                      Bạn đã đạt giới hạn tạo CV Builder
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Nâng cấp gói của bạn để tạo thêm CV và sử dụng nhiều tính năng hơn!
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-3">Package Limits:</p>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        <span>FREE Package</span>
                      </span>
                      <span className="font-semibold">1 CV Builder</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <span>PLUS Package</span>
                      </span>
                      <span className="font-semibold">5 CV Builders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                        <span>PREMIUM Package</span>
                      </span>
                      <span className="font-semibold">Unlimited</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Để sau
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    router.push('/candidate/pricing');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
                >
                  Nâng cấp ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CVManagementPage;

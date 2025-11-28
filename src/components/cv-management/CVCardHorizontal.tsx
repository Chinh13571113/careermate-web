import { CV } from "@/services/cvService";
import { useState, useEffect, useRef } from "react";
import { syncCVWithUpdates } from "@/utils/syncCV";
import { ParsedCV, TaskStatusResponse } from "@/types/parsedCV";
import { CVSyncStatusModal } from "./CVSyncStatusModal";
import toast from "react-hot-toast";

// ========== DEBUG FLAG ==========
const DEBUG_SYNC_CLICK = true;

interface CVCardHorizontalProps {
  cv: CV;
  isDefault?: boolean;
  onSetDefault?: () => void;
  onPreview?: () => void;
  onSync?: () => void;
  onDelete?: () => void;
}

export const CVCardHorizontal = ({
  cv,
  isDefault = false,
  onSetDefault,
  onPreview,
  onSync,
  onDelete
}: CVCardHorizontalProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"processing" | "completed" | "failed">("processing");
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [rawResponse, setRawResponse] = useState<TaskStatusResponse | null>(null);
  const [taskId, setTaskId] = useState<string>("");

  // ========== DEBUG: Track if handleSync was called ==========
  const handleSyncCalledRef = useRef(false);
  const syncButtonClickedRef = useRef(false);

  // ========== DEBUG: Global click listener ==========
  useEffect(() => {
    if (!DEBUG_SYNC_CLICK) return;

    const globalClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log("🌍 GLOBAL CLICK TARGET:", target);
      console.log("🌍 GLOBAL CLICK TARGET tagName:", target.tagName);
      console.log("🌍 GLOBAL CLICK TARGET className:", target.className);
      console.log("🌍 GLOBAL CLICK TARGET id:", target.id);
      
      // Check if click was on or near sync button
      const syncBtn = document.getElementById(`sync-btn-${cv.id}`);
      if (syncBtn) {
        const rect = syncBtn.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;
        const isInsideSyncBtn = (
          clickX >= rect.left &&
          clickX <= rect.right &&
          clickY >= rect.top &&
          clickY <= rect.bottom
        );
        console.log("🎯 Click position:", { clickX, clickY });
        console.log("🎯 Sync button rect:", rect);
        console.log("🎯 Click was inside Sync button bounds:", isInsideSyncBtn);
        
        if (isInsideSyncBtn && target !== syncBtn && !syncBtn.contains(target)) {
          console.error("❌ CLICK WAS INSIDE SYNC BUTTON BOUNDS BUT HIT DIFFERENT ELEMENT:", target);
        }
      }
    };

    window.addEventListener("click", globalClickHandler, true); // capture phase
    console.log("🔧 DEBUG: Global click listener attached for CV:", cv.id);

    return () => {
      window.removeEventListener("click", globalClickHandler, true);
    };
  }, [cv.id]);

  // ========== DEBUG: Log Sync button position, z-index, and overlap detection ==========
  useEffect(() => {
    if (!DEBUG_SYNC_CLICK) return;

    const checkSyncButton = () => {
      const syncBtn = document.getElementById(`sync-btn-${cv.id}`);
      if (!syncBtn) {
        console.warn("⚠️ Sync button not found in DOM for CV:", cv.id);
        return;
      }

      const rect = syncBtn.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(syncBtn);
      
      console.log("📐 ========== SYNC BUTTON DEBUG INFO ==========");
      console.log("📐 CV ID:", cv.id);
      console.log("📐 CV Name:", cv.name);
      console.log("📐 Sync button bounds:", {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      });
      console.log("📐 Computed z-index:", computedStyle.zIndex);
      console.log("📐 Computed position:", computedStyle.position);
      console.log("📐 Computed pointer-events:", computedStyle.pointerEvents);
      console.log("📐 Computed visibility:", computedStyle.visibility);
      console.log("📐 Computed display:", computedStyle.display);
      console.log("📐 Computed opacity:", computedStyle.opacity);

      // Check what element is at the top of the sync button
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const topElement = document.elementFromPoint(centerX, centerY);
      
      console.log("🔍 TOP ELEMENT AT SYNC BUTTON CENTER:", topElement);
      console.log("🔍 Top element tagName:", topElement?.tagName);
      console.log("🔍 Top element className:", topElement?.className);
      console.log("🔍 Top element id:", topElement?.id);
      
      if (topElement !== syncBtn && !syncBtn.contains(topElement as Node)) {
        console.error("❌ OVERLAP DETECTED! Another element is covering the Sync button:", topElement);
        
        // Log the overlapping element's info
        if (topElement) {
          const topElStyle = window.getComputedStyle(topElement);
          console.error("❌ Overlapping element z-index:", topElStyle.zIndex);
          console.error("❌ Overlapping element position:", topElStyle.position);
          console.error("❌ Overlapping element bounds:", topElement.getBoundingClientRect());
        }
      } else {
        console.log("✅ No overlap detected - Sync button is accessible");
      }

      // Check parent containers pointer-events
      console.log("📐 ========== PARENT CONTAINER DEBUG ==========");
      let parent = syncBtn.parentElement;
      let depth = 0;
      while (parent && depth < 10) {
        const parentStyle = window.getComputedStyle(parent);
        console.log(`📐 Parent[${depth}] - tagName: ${parent.tagName}, className: ${parent.className?.slice(0, 50)}...`);
        console.log(`📐 Parent[${depth}] - pointer-events: ${parentStyle.pointerEvents}, z-index: ${parentStyle.zIndex}, position: ${parentStyle.position}`);
        parent = parent.parentElement;
        depth++;
      }
      console.log("📐 ========== END DEBUG INFO ==========");
    };

    // Run check after a short delay to ensure DOM is rendered
    const timeoutId = setTimeout(checkSyncButton, 500);

    return () => clearTimeout(timeoutId);
  }, [cv.id, cv.name, showMenu]); // Re-run when menu state changes

  // Handle sync button click
  const handleSync = async () => {
    console.log("🚀🚀🚀 ENTER → handleSync fired for CV:", cv.name);
    console.log("🚀🚀🚀 handleSync() ACTUALLY ENTERED - THIS IS THE REAL FUNCTION");
    handleSyncCalledRef.current = true;
    
    console.log("🚀 handleSync called for CV:", cv.name);
    console.log("📋 CV data:", {
      id: cv.id,
      name: cv.name,
      downloadUrl: cv.downloadUrl,
      source: cv.source
    });

    if (!cv.downloadUrl) {
      console.error("❌ No download URL available");
      toast.error("Cannot sync: No download URL available");
      return;
    }

    console.log("✅ Starting sync process...");
    setIsSyncing(true);
    setSyncStatus("processing");
    setParsedData(null);
    setRawResponse(null);
    setTaskId("");
    setShowStatusModal(true); // Show modal immediately
    console.log("🎬 Modal opened, isSyncing:", true);

    try {
      toast.loading("Syncing CV... This may take a moment", { id: "sync-cv" });
      console.log("📤 Calling syncCVWithUpdates...");

      // Call syncCV utility with real-time updates
      await syncCVWithUpdates(
        cv.downloadUrl,
        cv.name,
        (update) => {
          // Real-time updates from polling
          console.log("📥 Sync update:", update);

          if (update.taskId) {
            console.log("🆔 Task ID received:", update.taskId);
            setTaskId(update.taskId);
          }

          if (update.status) {
            console.log("📊 Status update:", update.status);
            setSyncStatus(update.status);
          }

          if (update.data) {
            console.log("📄 Data received:", Object.keys(update.data));
            setParsedData(update.data);
          }

          if (update.rawResponse) {
            console.log("🔧 Raw response received");
            setRawResponse(update.rawResponse);
          }
        }
      );

      console.log("✅ Sync completed successfully!");
      toast.success("CV synced successfully!", { id: "sync-cv" });

      // Call parent onSync callback if provided
      if (onSync) {
        console.log("🔄 Calling parent onSync callback");
        onSync();
      }

    } catch (error: any) {
      console.error("❌ Sync failed:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack
      });
      setSyncStatus("failed");
      toast.error(error.message || "Failed to sync CV", { id: "sync-cv" });
    } finally {
      console.log("🏁 Sync process finished, setting isSyncing to false");
      setIsSyncing(false);
    }
  };

  const getSourceBadge = () => {
    const sources = {
      upload: { label: "Uploaded", color: "bg-blue-100 text-blue-700" },
      builder: { label: "Builder", color: "bg-purple-100 text-purple-700" },
      draft: { label: "Draft", color: "bg-orange-100 text-orange-700" }
    };
    return sources[cv.source ?? "upload"];
  };

  const source = getSourceBadge();

  return (
    <div
      className={`
        relative z-[1] isolate
        w-full rounded-xl bg-white transition-all duration-300
        border shadow-sm hover:shadow-md hover:border-[#3a4660]
        mb-4
        ${isDefault ? "ring-2 ring-[#3a4660] border-[#3a4660]" : "border-gray-200"}
      `}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 h-auto">
        {/* Left: Thumbnail/Icon */}
        <div
          className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center cursor-pointer group hover:from-gray-100 hover:to-gray-200 transition-colors"
          onClick={onPreview}
        >
          {cv.parsedStatus === "processing" ? (
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a4660] rounded-full animate-spin mx-auto mb-1"></div>
              <p className="text-[10px] text-gray-500">Processing...</p>
            </div>
          ) : (
            <svg
              className="w-12 h-12 text-gray-400 group-hover:text-[#3a4660] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>

        {/* Right: Info Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0 gap-3">
          {/* Top Row: Badges */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${source.color}`}>
              {source.label}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 flex items-center gap-1">
              {cv.privacy === "private" ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Private</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Public</span>
                </>
              )}
            </span>
          </div>

          {/* Middle Row: CV Name & Default Badge */}
          <div className="flex items-center gap-2">
            <h3
              className="font-semibold text-sm text-gray-900 truncate cursor-pointer hover:text-[#3a4660] transition-colors"
              title={cv.name}
              onClick={onPreview}
            >
              {cv.name}
            </h3>
            {isDefault && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-[#3a4660] text-white text-xs font-semibold rounded-full">
                Default
              </span>
            )}
          </div>

          {/* Bottom Row: Date, Size & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(cv.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
              {cv.fileSize && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{cv.fileSize}</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="relative z-[10] flex flex-wrap items-center gap-2 isolate">
              {!isDefault && onSetDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("🟢 Set Default clicked!", cv.name);
                    onSetDefault();
                  }}
                  className="relative z-[11] px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Set Default
                </button>
              )}

              {/* Sync Button */}
              <button
                id={`sync-btn-${cv.id}`}
                onClick={(e) => {
                  console.log("🔵🔵🔵 CLICK → Sync button: event reached");
                  console.log("🔵🔵🔵 Event object:", e);
                  console.log("🔵🔵🔵 Event target:", e.target);
                  console.log("🔵🔵🔵 Event currentTarget:", e.currentTarget);
                  console.log("🔵🔵🔵 Event type:", e.type);
                  console.log("🔵🔵🔵 Event bubbles:", e.bubbles);
                  console.log("🔵🔵🔵 Event defaultPrevented:", e.defaultPrevented);
                  
                  syncButtonClickedRef.current = true;
                  handleSyncCalledRef.current = false; // Reset before calling
                  
                  e.stopPropagation();
                  e.preventDefault();
                  
                  console.log("🔵 Sync button clicked!", cv.name);
                  console.log("📍 CV URL:", cv.downloadUrl);
                  console.log("📍 Is Syncing:", isSyncing);
                  console.log("📍 Is Disabled:", isSyncing || !cv.downloadUrl);
                  
                  // Check if button is disabled
                  if (isSyncing) {
                    console.warn("⚠️ Button is disabled - isSyncing is true");
                    return;
                  }
                  if (!cv.downloadUrl) {
                    console.warn("⚠️ Button is disabled - no downloadUrl");
                    return;
                  }
                  
                  console.log("🔵 About to call handleSync()...");
                  
                  // Set a timeout to check if handleSync was called
                  setTimeout(() => {
                    if (!handleSyncCalledRef.current) {
                      console.error("❌❌❌ handleSync NEVER FIRED — click was intercepted or function failed silently");
                      alert("❌ Sync click intercepted! handleSync() was never called. Check console for details.");
                    }
                  }, 300);
                  
                  handleSync();
                  
                  console.log("🔵 handleSync() call completed (returned)");
                }}
                onMouseDown={(e) => {
                  console.log("🖱️ MOUSEDOWN on Sync button", cv.name);
                }}
                onMouseUp={(e) => {
                  console.log("🖱️ MOUSEUP on Sync button", cv.name);
                }}
                onPointerDown={(e) => {
                  console.log("👆 POINTERDOWN on Sync button", cv.name);
                }}
                disabled={isSyncing || !cv.downloadUrl}
                className="relative z-[12] px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#3a4660] to-gray-400 hover:from-[#3a4660] hover:to-[#3a4660] rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  // DEBUG: Visual highlight
                  outline: DEBUG_SYNC_CLICK ? "3px solid red" : undefined,
                  outlineOffset: "2px"
                }}
                title={!cv.downloadUrl ? "No download URL available" : "Sync CV with Python parser"}
              >
                {isSyncing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Sync</span>
                  </>
                )}
              </button>

              {/* More Menu */}
              <div className="relative z-[11] isolate">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("🔧 More menu clicked, current state:", showMenu);
                    setShowMenu(!showMenu);
                  }}
                  className="relative z-[11] p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {showMenu && (
                  <>
                    {/* Overlay - only visible when menu is open */}
                    <div
                      className="fixed inset-0 z-[8] pointer-events-auto bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("🔴 Overlay clicked - closing menu");
                        setShowMenu(false);
                      }}
                    ></div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[50] pointer-events-auto">
                      {onPreview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Preview
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download logic
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Rename logic
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Rename
                      </button>

                      <hr className="my-1 border-gray-200" />

                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status Modal */}
      <CVSyncStatusModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        taskId={taskId}
        status={syncStatus}
        data={parsedData}
        rawResponse={rawResponse}
      />
    </div>
  );
};

export default CVCardHorizontal;

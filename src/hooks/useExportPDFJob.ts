/**
 * useExportPDFJob Hook
 * 
 * React hook for managing PDF export jobs with polling.
 * Replaces the old retry-based downloadCVWithRetry approach.
 * 
 * Features:
 * - Creates export job via POST /api/export-pdf/job
 * - Polls for status every 3 seconds
 * - Stops polling on completion or error
 * - 90 second maximum polling timeout
 * - Provides progress messages for UI feedback
 * 
 * @example
 * ```tsx
 * const { isExporting, status, progressMessage, error, fileUrl, startExport, reset } = useExportPDFJob();
 * 
 * const handleExport = async () => {
 *   const url = await startExport({
 *     resumeId: 123,
 *     templateId: "modern",
 *     cvData: { ... },
 *     userPackage: "BASIC",
 *   });
 *   
 *   if (url) {
 *     // Trigger download or show success
 *   }
 * };
 * ```
 */

import { useState, useCallback, useRef } from "react";
import type {
  CreateExportJobRequest,
  CreateExportJobResponse,
  GetExportJobResponse,
  ExportJobStatus,
  UseExportPDFJobReturn,
} from "@/types/export-job";

// =============================================================================
// Configuration
// =============================================================================

/** Polling interval in milliseconds */
const POLL_INTERVAL_MS = 2000;

/** Maximum polling duration in milliseconds (180 seconds for production/serverless) */
const MAX_POLL_DURATION_MS = 180000;

/** API endpoints */
const CREATE_JOB_URL = "/api/export-pdf/job";
const getJobStatusUrl = (jobId: string) => `/api/export-pdf/job/${jobId}`;

// =============================================================================
// Progress Messages
// =============================================================================

const PROGRESS_MESSAGES = {
  creating: "Starting export...",
  processing: "Generating PDF... This may take up to a minute.",
  uploading: "Uploading to cloud storage...",
  done: "Export complete!",
  error: "Export failed",
  timeout: "Export timed out after 3 minutes. The server may be overloaded or there's an issue with PDF generation. Please check server logs and try again.",
};

// =============================================================================
// Hook Implementation
// =============================================================================

export function useExportPDFJob(): UseExportPDFJobReturn {
  // State
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<ExportJobStatus | null>(null);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Refs for cleanup
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Clean up polling resources
   */
  const cleanup = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    cleanup();
    setIsExporting(false);
    setStatus(null);
    setProgressMessage("");
    setError(null);
    setFileUrl(null);
  }, [cleanup]);

  /**
   * Create export job via API
   * NOW: Returns immediate response with jobId OR fileUrl (if completed sync)
   */
  const createJob = async (
    request: CreateExportJobRequest,
    signal: AbortSignal
  ): Promise<CreateExportJobResponse> => {
    const response = await fetch(CREATE_JOB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.details || `Failed to create job: ${response.status}`);
    }

    const data: CreateExportJobResponse = await response.json();
    return data;
  };

  /**
   * Poll job status via API
   */
  const pollJobStatus = async (
    jobId: string,
    signal: AbortSignal
  ): Promise<GetExportJobResponse> => {
    const response = await fetch(getJobStatusUrl(jobId), { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to get job status: ${response.status}`);
    }

    return response.json();
  };

  /**
   * Start export job and poll for completion
   */
  const startExport = useCallback(
    async (request: CreateExportJobRequest): Promise<string | null> => {
      // Clean up any previous export
      cleanup();

      // Initialize state
      setIsExporting(true);
      setStatus(null);
      setProgressMessage(PROGRESS_MESSAGES.creating);
      setError(null);
      setFileUrl(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        // Step 1: Create job (NOW: may complete immediately)
        console.log("[useExportPDFJob] Creating export job...");
        const jobResponse = await createJob(request, signal);

        if (!jobResponse || !jobResponse.jobId) {
          throw new Error("No job ID returned from server");
        }

        const { jobId, status: initialStatus, fileUrl: immediateUrl } = jobResponse;
        console.log(`[useExportPDFJob] Job created: ${jobId}, status: ${initialStatus}`);

        // NEW: Check if job completed immediately (synchronous processing)
        if (initialStatus === "done" && immediateUrl) {
          console.log("[useExportPDFJob] ✅ Job completed immediately (sync mode)");
          cleanup();
          setStatus("done");
          setProgressMessage(PROGRESS_MESSAGES.done);
          setFileUrl(immediateUrl);
          setIsExporting(false);
          return immediateUrl;
        }

        // OLD: Job still processing, need to poll
        setStatus("processing");
        setProgressMessage(PROGRESS_MESSAGES.processing);

        // Step 2: Poll for completion
        return new Promise<string | null>((resolve) => {
          const startTime = Date.now();

          // Set up timeout
          pollTimeoutRef.current = setTimeout(() => {
            cleanup();
            console.error(`[useExportPDFJob] ⏱️ Job ${jobId} timed out after ${MAX_POLL_DURATION_MS / 1000}s`);
            console.error(`[useExportPDFJob] ⏱️ Last known status:`, status);
            console.error(`[useExportPDFJob] ⏱️ This usually means:`);
            console.error(`  1. Server function was killed (Vercel free tier = 10s max)`);
            console.error(`  2. Puppeteer failed to launch`);
            console.error(`  3. PDF generation is stuck`);
            console.error(`  4. Check server logs for details`);
            setError(PROGRESS_MESSAGES.timeout);
            setProgressMessage(PROGRESS_MESSAGES.timeout);
            setIsExporting(false);
            resolve(null);
          }, MAX_POLL_DURATION_MS);

          // Set up polling interval
          pollIntervalRef.current = setInterval(async () => {
            try {
              // Check if aborted
              if (signal.aborted) {
                cleanup();
                resolve(null);
                return;
              }

              // Poll status
              const jobStatus = await pollJobStatus(jobId, signal);
              const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
              console.log(`[useExportPDFJob] Poll result (${elapsedTime}s):`, jobStatus.status, jobStatus);

              if (jobStatus.status === "done" && jobStatus.fileUrl) {
                // Success!
                cleanup();
                setStatus("done");
                setProgressMessage(PROGRESS_MESSAGES.done);
                setFileUrl(jobStatus.fileUrl);
                setIsExporting(false);
                resolve(jobStatus.fileUrl);
                return;
              }

              if (jobStatus.status === "error") {
                // Error
                cleanup();
                const errorMsg = jobStatus.error || "Unknown error occurred";
                console.error("[useExportPDFJob] Job failed with error:", errorMsg);
                console.error("[useExportPDFJob] Full job status:", jobStatus);
                setStatus("error");
                setProgressMessage(PROGRESS_MESSAGES.error);
                setError(errorMsg);
                setIsExporting(false);
                resolve(null);
                return;
              }

              // Still processing - update progress message with elapsed time
              const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
              let progressMsg = `Generating PDF... (${elapsedSeconds}s)`;

              // Add helpful messages at different time intervals
              if (elapsedSeconds > 60 && elapsedSeconds <= 90) {
                progressMsg += " - This is taking longer than usual...";
              } else if (elapsedSeconds > 90 && elapsedSeconds <= 120) {
                progressMsg += " - Still processing, please wait...";
              } else if (elapsedSeconds > 120) {
                progressMsg += " - Almost there, this might be a cold start...";
              }

              setProgressMessage(progressMsg);

            } catch (pollError: unknown) {
              // Handle poll error (but don't stop polling unless it's a hard failure)
              if (pollError instanceof Error && pollError.name === "AbortError") {
                cleanup();
                resolve(null);
                return;
              }
              console.warn("[useExportPDFJob] Poll error:", pollError instanceof Error ? pollError.message : String(pollError));
              // Continue polling - might be a temporary network issue
            }
          }, POLL_INTERVAL_MS);
        });

      } catch (error: unknown) {
        console.error("[useExportPDFJob] Export failed:", error);
        cleanup();

        const errorMsg = error instanceof Error
          ? (error.name === "AbortError" ? "Export cancelled" : error.message)
          : "Unknown error occurred";

        setError(errorMsg);
        setProgressMessage(PROGRESS_MESSAGES.error);
        setStatus("error");
        setIsExporting(false);
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cleanup]
  );

  return {
    // State
    isExporting,
    status,
    progressMessage,
    error,
    fileUrl,
    // Actions
    startExport,
    reset,
  };
}

export default useExportPDFJob;

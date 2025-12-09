/**
 * POST /api/export-pdf/job
 * 
 * Creates a new PDF export job and immediately returns the job ID.
 * The actual PDF generation runs in the background using setImmediate.
 * 
 * This replaces the old retry-based approach with a job-based polling system
 * that handles Puppeteer cold-start times gracefully.
 */

import { NextRequest, NextResponse } from "next/server";
import { exportJobStore } from "@/lib/export-job-store";
import { generatePDF } from "@/lib/pdf-export-worker";
import { uploadCVPDF } from "@/lib/firebase-upload";
import type { CreateExportJobRequest, CreateExportJobResponse } from "@/types/export-job";

// =============================================================================
// Runtime Configuration
// =============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes max for background processing

// =============================================================================
// POST Handler - Create Export Job
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: CreateExportJobRequest = await req.json();
    const { resumeId, templateId, cvData, fileName, userPackage, candidateId } = body;

    // Validate required fields
    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId is required" },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 }
      );
    }

    if (!cvData) {
      return NextResponse.json(
        { error: "cvData is required" },
        { status: 400 }
      );
    }

    // Create job in store (now async for KV support)
    const job = await exportJobStore.createJob(resumeId, templateId);
    const { jobId } = job;

    console.log(`[ExportJob] Created job ${jobId} for resume ${resumeId}`);

    // =======================================================================
    // IMPORTANT: Process synchronously for Vercel/serverless compatibility
    // setImmediate() doesn't work on Vercel - background tasks are killed
    // when the response is sent. We must process before responding.
    // =======================================================================

    console.log(`[ExportJob] Starting PDF processing for job ${jobId}`);
    const startTime = Date.now();

    try {
      // Step 1: Generate PDF
      console.log(`[ExportJob] Generating PDF for job ${jobId}...`);
      const result = await generatePDF({
        templateId,
        cvData,
        fileName,
        userPackage,
      });

      if (!result.success) {
        console.error(`[ExportJob] PDF generation failed for job ${jobId}:`, result.error);
        console.error(`[ExportJob] Error details:`, result.details || 'No additional details');
        await exportJobStore.failJob(jobId, result.error);

        return NextResponse.json(
          {
            error: "PDF generation failed",
            details: result.error,
            jobId,
          },
          { status: 500 }
        );
      }

      console.log(`[ExportJob] PDF generated for job ${jobId} (${result.sizeKB.toFixed(2)} KB)`);

      // Step 2: Upload to Firebase
      console.log(`[ExportJob] Uploading to Firebase for job ${jobId}...`);

      try {
        // Convert Buffer to Blob for uploadCVPDF
        const pdfBlob = new Blob([new Uint8Array(result.pdfBuffer)], { type: "application/pdf" });
        const cleanFileName = fileName || `cv-${resumeId}`;

        // Use candidateId for Firebase path (NOT email)
        // Path: careermate-files/candidates/{candidateId}/cv/{fileName}
        const uploadCandidateId = candidateId || "anonymous";

        const downloadURL = await uploadCVPDF(uploadCandidateId, pdfBlob, cleanFileName);

        console.log(`[ExportJob] Upload complete for job ${jobId}: ${downloadURL.substring(0, 60)}...`);

        // Step 3: Mark job as complete
        await exportJobStore.completeJob(jobId, downloadURL);

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[ExportJob] Job ${jobId} completed successfully in ${duration}s`);

        // Return success response with file URL
        const response: CreateExportJobResponse = {
          jobId,
          status: "done",
          message: "Export completed successfully",
          fileUrl: downloadURL,
        };

        return NextResponse.json(response, { status: 200 });

      } catch (uploadError: any) {
        console.error(`[ExportJob] Firebase upload failed for job ${jobId}:`, uploadError);
        console.error(`[ExportJob] Upload error details:`, uploadError.message, uploadError.stack);
        await exportJobStore.failJob(jobId, `Upload failed: ${uploadError.message}`);

        return NextResponse.json(
          {
            error: "Upload failed",
            details: uploadError.message,
            jobId,
          },
          { status: 500 }
        );
      }

    } catch (error: any) {
      console.error(`[ExportJob] Processing failed for job ${jobId}:`, error);
      await exportJobStore.failJob(jobId, error.message || "Unknown error during export");

      return NextResponse.json(
        {
          error: "Export failed",
          details: error.message,
          jobId,
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("[ExportJob] Failed to create export job:", error);
    return NextResponse.json(
      {
        error: "Failed to create export job",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET Handler - Store Statistics (for debugging/monitoring)
// =============================================================================

export async function GET() {
  const stats = exportJobStore.getStoreStats();

  return NextResponse.json({
    service: "PDF Export Job API",
    stats,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Export Job Store - Redis Implementation
 *
 * Persistent job store for managing PDF export jobs using Redis (Railway).
 * This replaces the in-memory Map/globalThis approach to work properly
 * on Vercel's serverless infrastructure where functions don't share memory.
 *
 * Features:
 * - ✅ Works across multiple serverless function instances
 * - ✅ Automatic job expiration after 10 minutes (TTL)
 * - ✅ No cleanup intervals needed (Redis handles it)
 * - ✅ Production-ready for Vercel deployment
 *
 * Environment Variables:
 * - REDIS_URL (from Railway)
 */

import { ExportJobState } from "@/types/export-job";
import Redis from "ioredis";

// =============================================================================
// Configuration
// =============================================================================

/** How long to keep jobs in Redis before automatic expiration (10 minutes) */
const JOB_TTL_SECONDS = 10 * 60;

/** Redis key prefix for export jobs */
const KEY_PREFIX = "export-pdf-job:";

/** Check if Redis is properly configured */
const isRedisConfigured = Boolean(process.env.REDIS_URL);

/** In-memory fallback store for development */
const memoryStore = new Map<string, ExportJobState>();

console.log(`[ExportJobStore:Redis] Redis Configured: ${isRedisConfigured}`);

// =============================================================================
// Redis Client
// =============================================================================

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!isRedisConfigured) {
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });
      console.log("[ExportJobStore:Redis] Redis client initialized");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[ExportJobStore:Redis] Failed to initialize Redis client:", errorMessage);
      return null;
    }
  }

  return redisClient;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate a Redis key for a job ID
 */
function getJobKey(jobId: string): string {
  return `${KEY_PREFIX}${jobId}`;
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// =============================================================================
// Store Operations
// =============================================================================

/**
 * Create a new export job in Redis
 *
 * @param resumeId - The resume ID to export
 * @param templateId - The template ID to use
 * @returns The created job state with a unique job ID
 */
export async function createJob(
  resumeId: number,
  templateId: string
): Promise<ExportJobState> {
  const jobId = generateUUID();
  const now = Date.now();

  const job: ExportJobState = {
    jobId,
    status: "processing",
    resumeId,
    templateId,
    createdAt: now,
    updatedAt: now,
  };

  // Use Redis if configured, otherwise fall back to memory store
  if (isRedisConfigured) {
    const client = getRedisClient();
    if (client) {
      try {
        await client.setex(getJobKey(jobId), JOB_TTL_SECONDS, JSON.stringify(job));
        console.log(`[ExportJobStore:Redis] Created job ${jobId} for resume ${resumeId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[ExportJobStore:Redis] Redis storage failed, using memory fallback:`, errorMessage);
        memoryStore.set(jobId, job);
        console.log(`[ExportJobStore:Memory] Created job ${jobId} for resume ${resumeId}`);
      }
    } else {
      memoryStore.set(jobId, job);
      console.log(`[ExportJobStore:Memory] Created job ${jobId} for resume ${resumeId} (Redis client not available)`);
    }
  } else {
    memoryStore.set(jobId, job);
    console.log(`[ExportJobStore:Memory] Created job ${jobId} for resume ${resumeId} (Redis not configured)`);
  }

  return job;
}

/**
 * Get a job by ID from Redis
 *
 * @param jobId - The job ID to retrieve
 * @returns The job state or null if not found
 */
export async function getJob(jobId: string): Promise<ExportJobState | null> {
  let job: ExportJobState | null = null;

  // Use Redis if configured, otherwise fall back to memory store
  if (isRedisConfigured) {
    const client = getRedisClient();
    if (client) {
      try {
        const data = await client.get(getJobKey(jobId));
        if (data) {
          job = JSON.parse(data);
          console.log(`[ExportJobStore:Redis] Retrieved job ${jobId}: ${job?.status}`);
        } else {
          console.log(`[ExportJobStore:Redis] Job ${jobId} not found (may have expired)`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[ExportJobStore:Redis] Redis retrieval failed, using memory fallback:`, errorMessage);
        job = memoryStore.get(jobId) || null;
      }
    } else {
      job = memoryStore.get(jobId) || null;
    }
  } else {
    job = memoryStore.get(jobId) || null;
    if (job) {
      console.log(`[ExportJobStore:Memory] Retrieved job ${jobId}: ${job.status}`);
    } else {
      console.log(`[ExportJobStore:Memory] Job ${jobId} not found`);
    }
  }

  return job;
}

/**
 * Update a job in Redis
 *
 * @param jobId - The job ID to update
 * @param updates - Partial updates to apply to the job
 */
export async function updateJob(
  jobId: string,
  updates: Partial<Omit<ExportJobState, "jobId" | "createdAt">>
): Promise<void> {
  const job = await getJob(jobId);
  if (!job) {
    console.warn(`[ExportJobStore] Attempted to update non-existent job: ${jobId}`);
    return;
  }

  const updated: ExportJobState = {
    ...job,
    ...updates,
    updatedAt: Date.now(),
  };

  // Use Redis if configured, otherwise fall back to memory store
  if (isRedisConfigured) {
    const client = getRedisClient();
    if (client) {
      try {
        await client.setex(getJobKey(jobId), JOB_TTL_SECONDS, JSON.stringify(updated));
        console.log(`[ExportJobStore:Redis] Updated job ${jobId}:`, {
          status: updated.status,
          hasFileUrl: !!updated.fileUrl,
          hasError: !!updated.error,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[ExportJobStore:Redis] Redis update failed, using memory fallback:`, errorMessage);
        memoryStore.set(jobId, updated);
        console.log(`[ExportJobStore:Memory] Updated job ${jobId}`);
      }
    } else {
      memoryStore.set(jobId, updated);
    }
  } else {
    memoryStore.set(jobId, updated);
    console.log(`[ExportJobStore:Memory] Updated job ${jobId}:`, {
      status: updated.status,
      hasFileUrl: !!updated.fileUrl,
      hasError: !!updated.error,
    });
  }
}

/**
 * Mark a job as complete with a file URL
 *
 * @param jobId - The job ID to complete
 * @param fileUrl - The Firebase download URL for the generated PDF
 */
export async function completeJob(jobId: string, fileUrl: string): Promise<void> {
  await updateJob(jobId, {
    status: "done",
    fileUrl,
  });

  console.log(`[ExportJobStore] Job ${jobId} completed with URL: ${fileUrl.substring(0, 50)}...`);
}

/**
 * Mark a job as failed with an error message
 *
 * @param jobId - The job ID to fail
 * @param error - The error message
 */
export async function failJob(jobId: string, error: string): Promise<void> {
  await updateJob(jobId, {
    status: "error",
    error,
  });

  console.error(`[ExportJobStore] Job ${jobId} failed: ${error}`);
}

/**
 * Delete a job from Redis
 *
 * @param jobId - The job ID to delete
 */
export async function deleteJob(jobId: string): Promise<void> {
  // Use Redis if configured, otherwise fall back to memory store
  if (isRedisConfigured) {
    const client = getRedisClient();
    if (client) {
      try {
        await client.del(getJobKey(jobId));
        console.log(`[ExportJobStore:Redis] Deleted job ${jobId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[ExportJobStore:Redis] Redis delete failed, using memory fallback:`, errorMessage);
        memoryStore.delete(jobId);
        console.log(`[ExportJobStore:Memory] Deleted job ${jobId}`);
      }
    } else {
      memoryStore.delete(jobId);
    }
  } else {
    memoryStore.delete(jobId);
    console.log(`[ExportJobStore:Memory] Deleted job ${jobId}`);
  }
}

// =============================================================================
// Export Default Object (for backward compatibility)
// =============================================================================

export const exportJobStore = {
  createJob,
  getJob,
  updateJob,
  completeJob,
  failJob,
  deleteJob,
};

export default exportJobStore;


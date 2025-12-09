# PDF Export Production Debugging Guide

## Overview
This guide helps debug PDF export issues that work locally but fail in production deployment.

---

## Common Issues & Solutions

### 🔴 Issue 1: "PDF export failed. Please try again."

**Symptoms:**
- Works perfectly in local development (`localhost:3001`)
- Fails in production (Vercel/Railway deployment)
- Error message: `❌ Error exporting and saving PDF: Error: PDF export failed. Please try again.`

**Root Causes:**

#### A. CORS/Fetch Restrictions
- **Problem:** Production browsers may block `fetch()` requests to Firebase URLs due to CORS policies
- **Solution:** Implemented multi-fallback download approach:
  1. Try CORS-safe fetch (for local dev)
  2. Direct link download (production)
  3. Open in new tab as last resort

#### B. Cold-Start Timeouts
- **Problem:** Puppeteer browser initialization takes 30-60 seconds on first invocation in serverless
- **Solution:** Increased polling timeout from 90s to 120s
- **Location:** `src/hooks/useExportPDFJob.ts` → `MAX_POLL_DURATION_MS = 120000`

#### C. Redis/Job Store Not Found
- **Problem:** Job created but not found during polling due to multi-instance serverless
- **Solution:** Using Railway Redis for cross-instance persistence
- **Check:** Verify `REDIS_URL` environment variable is set in deployment

---

## 🛠️ Diagnostic Checklist

### Step 1: Check Browser Console Logs

Look for these key log entries:

```javascript
// ✅ Success flow:
🚀 Starting job-based PDF export...
[useExportPDFJob] Creating export job...
[useExportPDFJob] Job created: <jobId>
[useExportPDFJob] Poll result: processing
[useExportPDFJob] Poll result: done
✅ PDF exported and uploaded: https://firebasestorage.googleapis.com/...
📥 Starting PDF download...
✅ PDF download triggered successfully (direct link method)
```

```javascript
// ❌ Error indicators:
[useExportPDFJob] Job failed with error: <error>
[useExportPDFJob] Job timed out after 120s
❌ Export failed: <error message>
```

### Step 2: Check Server Logs (Railway/Vercel)

Look for these patterns:

```bash
# Job creation
[ExportJob] Created job <jobId> for resume <resumeId>
[ExportJob] Starting background processing for job <jobId>

# PDF generation
[ExportJob] Generating PDF for job <jobId>...
✅ PDF generated (<size> KB)

# Firebase upload
[ExportJob] Uploading to Firebase for job <jobId>...
[uploadCVPDF] Starting upload for user <userId>
[uploadCVPDF] Blob size: <size> KB
✅ CV PDF uploaded successfully: <url>

# Job completion
[ExportJob] Job <jobId> completed successfully in <duration>s
```

### Step 3: Verify Environment Variables

Production deployment must have:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=<key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<id>
NEXT_PUBLIC_FIREBASE_APP_ID=<id>

# Redis (for job persistence)
REDIS_URL=<redis-connection-url>

# API Base URL
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### Step 4: Test Job API Endpoints Manually

```bash
# Create job
curl -X POST https://your-domain.com/api/export-pdf/job \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": 123,
    "templateId": "modern",
    "cvData": {...},
    "fileName": "test-cv",
    "candidateId": "3"
  }'

# Response should be:
{
  "jobId": "<uuid>",
  "status": "processing",
  "message": "Export job created..."
}

# Poll job status
curl https://your-domain.com/api/export-pdf/job/<jobId>

# Final response should be:
{
  "jobId": "<uuid>",
  "status": "done",
  "fileUrl": "https://firebasestorage.googleapis.com/..."
}
```

---

## 🔧 Recent Fixes Applied

### 1. Download Method Improvements (`CVPreview.tsx`)
**Before:**
```typescript
const response = await fetch(downloadURL);
const blob = await response.blob();
// ... trigger download
```

**After:**
```typescript
// Method 1: Try CORS-safe fetch
try {
  const response = await fetch(downloadURL, { mode: 'cors' });
  // ... download
} catch {
  // Method 2: Direct link
  link.href = downloadURL;
  link.download = fileName;
  link.click();
  
  // Method 3: Open in new tab
  window.open(downloadURL, '_blank');
}
```

### 2. Polling Timeout Extension (`useExportPDFJob.ts`)
```typescript
// Before: 90 seconds
const MAX_POLL_DURATION_MS = 90000;

// After: 120 seconds (handles cold-starts)
const MAX_POLL_DURATION_MS = 120000;
```

### 3. Enhanced Error Logging
- Added detailed error messages at every step
- Include error codes, stack traces, and context
- Better error propagation from server to client

### 4. Firebase Upload Error Details (`firebase-upload.ts`)
```typescript
catch (error: any) {
  console.error("❌ Error uploading CV PDF:", error);
  console.error("❌ Error code:", error.code);
  console.error("❌ Error message:", error.message);
  console.error("❌ Error stack:", error.stack);
  throw new Error(`Failed to upload CV PDF: ${error.message}`);
}
```

---

## 🚨 Troubleshooting Production Issues

### Issue: Job Times Out After 120s

**Possible Causes:**
1. Chromium binary not available in production
2. Puppeteer dependency missing from deployment
3. Memory/CPU limits too restrictive

**Solutions:**
```bash
# Verify dependencies in package.json
"dependencies": {
  "puppeteer": "^21.0.0",           # For dev
  "puppeteer-core": "^21.0.0",      # For production
  "@sparticuz/chromium": "^119.0.0" # Serverless Chromium
}

# Check Railway/Vercel resource limits
# Recommended: At least 512MB RAM, 1 CPU core
```

### Issue: Firebase Upload Fails

**Error:** `Failed to upload CV PDF to Firebase: <error>`

**Solutions:**
1. Verify Firebase Storage Rules allow writes:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /careermate-files/candidates/{candidateId}/cv/{fileName} {
      allow read, write: if request.auth != null;
      // Or for admin/server access:
      allow read, write: if true;
    }
  }
}
```

2. Check Firebase quota limits in Firebase Console

3. Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` environment variable

### Issue: Redis Connection Errors

**Error:** `Job not found` or `Redis connection failed`

**Solutions:**
```bash
# Verify REDIS_URL is set correctly
echo $REDIS_URL

# Test Redis connection
redis-cli -u $REDIS_URL ping
# Should return: PONG

# In code, check fallback to in-memory store:
# Look for: "[ExportJobStore] ⚠️ No REDIS_URL found, using in-memory fallback"
```

---

## 📊 Performance Benchmarks

### Local Development
- Job creation: ~50ms
- PDF generation: 3-8 seconds
- Firebase upload: 1-3 seconds
- **Total:** 5-12 seconds

### Production (First Request - Cold Start)
- Job creation: ~100ms
- PDF generation: 30-60 seconds (Chromium initialization)
- Firebase upload: 2-5 seconds
- **Total:** 35-65 seconds

### Production (Warm Requests)
- Job creation: ~100ms
- PDF generation: 5-10 seconds
- Firebase upload: 2-5 seconds
- **Total:** 8-15 seconds

---

## 📝 Testing Procedure

### 1. Local Testing
```bash
npm run dev
# Navigate to CV editor
# Click "Download CV"
# Verify: PDF downloads successfully
```

### 2. Production Testing
```bash
# Deploy to production
npm run build
# Or push to deploy branch

# Test in production:
# 1. Open production URL
# 2. Navigate to CV editor
# 3. Click "Download CV"
# 4. Check browser console for errors
# 5. Check server logs for job processing
# 6. Verify PDF downloads or opens in new tab
```

---

## 🔗 Related Files

### Frontend
- `src/components/cv/CVPreview.tsx` - Download logic
- `src/hooks/useExportPDFJob.ts` - Job polling
- `src/lib/firebase-upload.ts` - Firebase upload

### Backend
- `src/app/api/export-pdf/job/route.ts` - Job creation
- `src/app/api/export-pdf/job/[jobId]/route.ts` - Job polling
- `src/lib/pdf-export-worker.ts` - PDF generation
- `src/lib/export-job-store.ts` - Job persistence

### Configuration
- `package.json` - Dependencies
- `.env.local` - Environment variables
- `docs/PUPPETEER_PDF_FIREBASE_GUIDE.md` - PDF generation guide

---

## ✅ Success Indicators

After applying fixes, you should see:

1. ✅ Job completes within 120 seconds
2. ✅ PDF downloads automatically (or opens in new tab)
3. ✅ No CORS errors in browser console
4. ✅ Firebase URL accessible and downloadable
5. ✅ Consistent behavior between local and production

---

## 🆘 Getting Help

If issues persist:

1. Collect full error logs (browser + server)
2. Test job API endpoints manually
3. Verify all environment variables
4. Check Firebase Storage rules and quotas
5. Review Railway/Vercel deployment logs
6. Test with different browsers (Chrome, Firefox, Safari)

**Last Updated:** December 10, 2025

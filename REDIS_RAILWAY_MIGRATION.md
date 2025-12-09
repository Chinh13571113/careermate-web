# Redis Railway Migration

## Overview
Migrated PDF export job store from Vercel KV to Redis (Railway deployment).

## Changes Made

### 1. Package Updates
- ✅ Removed: `@vercel/kv`
- ✅ Added: `ioredis`

### 2. File Updates
- **File**: `src/lib/export-job-store.kv.ts`
- Replaced all Vercel KV references with Redis (ioredis)
- Updated connection client to use `ioredis` instead of `@vercel/kv`
- Changed environment variable from `KV_REST_API_URL` to `REDIS_URL`

### 3. Environment Variables

#### Old (Vercel KV):
```env
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

#### New (Redis Railway):
```env
REDIS_URL=redis://default:password@host:port
```

### 4. Code Changes Summary

#### Connection Client
```typescript
// Before: Vercel KV
import { kv } from "@vercel/kv";

// After: Redis
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL, {...});
```

#### Store Operations
All CRUD operations updated:
- `createJob()` - Uses `client.setex()` with JSON.stringify
- `getJob()` - Uses `client.get()` with JSON.parse
- `updateJob()` - Uses `client.setex()` with JSON.stringify
- `deleteJob()` - Uses `client.del()`

### 5. Features Preserved
- ✅ Automatic job expiration (10 minutes TTL)
- ✅ Memory fallback for development
- ✅ Error handling with graceful degradation
- ✅ Detailed logging for debugging

### 6. Redis Configuration
```typescript
{
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  lazyConnect: false,
  enableOfflineQueue: true,
}
```

## Setup Instructions

### 1. Install Redis on Railway
1. Create a new Redis service in Railway dashboard
2. Copy the `REDIS_URL` connection string
3. Add to environment variables

### 2. Update Environment Variables
```bash
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT
```

### 3. Deploy
```bash
npm install
git add .
git commit -m "refactor: migrate from Vercel KV to Railway Redis"
git push
```

## Testing
Test the PDF export functionality to ensure:
- [ ] Jobs are created successfully
- [ ] Jobs can be retrieved by ID
- [ ] Jobs are updated correctly
- [ ] Jobs expire after 10 minutes
- [ ] Memory fallback works without Redis

## Rollback Plan
If issues occur:
1. Revert commit
2. Reinstall `@vercel/kv`: `npm install @vercel/kv`
3. Restore environment variables
4. Redeploy

## Notes
- Redis connection uses singleton pattern (one client instance)
- Error handling includes automatic fallback to in-memory store
- All operations are logged for debugging
- TTL automatically expires old jobs (no manual cleanup needed)


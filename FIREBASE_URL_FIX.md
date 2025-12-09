# Firebase URL Invalid Error - Root Cause & Fix

## 🐛 Problem

Error message:
```
⚠️ Invalid Firebase URL detected, re-resolving: https://firebasestorage.googleapis.com/v0/b/cm-storage-86d7d.firebasestorage.app/o/careermate-files/candidates/3/avatar/1765163131863_z7199308560818_868c707eaf61f5310
```

### Root Causes

1. **Missing file extension** - URL ends without `.jpg`, `.png`, etc.
2. **Unencoded path** - Firebase requires `%2F` instead of `/` after `/o/`
3. **Invalid filename generation** - Using `Date.now()_${file.name}` directly without sanitization

### Example Bad Filename
```typescript
const fileName = `${Date.now()}_${file.name}`;
// Result: 1765163131863_z7199308560818_868c707eaf61f5310
// ❌ Lost extension, special chars not handled
```

## ✅ Solution

### 1. Proper Filename Sanitization

**Before:**
```typescript
const fileName = `${Date.now()}_${file.name}`;
```

**After:**
```typescript
// Extract extension properly
const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

// Sanitize filename
const sanitizedName = file.name
  .replace(/\.[^/.]+$/, '')        // Remove extension
  .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special chars
  .substring(0, 50);                // Limit length

const fileName = `${Date.now()}_${sanitizedName}.${ext}`;
// Result: 1765163131863_filename.jpg ✅
```

### 2. Return Storage Path (Not URL)

**Before:**
```typescript
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // ...
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL; // ❌ Returns URL
}
```

**After:**
```typescript
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // ...
  await uploadBytes(fileRef, file);
  return storagePath; // ✅ Returns path
}
```

**Why?**
- URLs expire (tokens change)
- Database should store **paths**, not URLs
- Frontend calls `getFileUrl(path)` when displaying

### 3. URL Resolution System

The existing `firebase-file.ts` already has detection logic:

```typescript
// Detects invalid Firebase URLs
export function isInvalidFirebaseUrl(url: string): boolean {
  // Check if path after /o/ contains unencoded slashes
  const match = url.match(/\/o\/([^?]+)/);
  const pathPart = match[1];
  return pathPart.includes("/") && !pathPart.includes("%2F");
}

// Re-resolves invalid URLs
export async function resolveFileUrl(pathOrUrl: string): Promise<string> {
  if (isInvalidFirebaseUrl(pathOrUrl)) {
    console.warn("⚠️ Invalid Firebase URL detected, re-resolving:", pathOrUrl);
    const storagePath = extractPathFromInvalidUrl(pathOrUrl);
    return await getFileUrl(storagePath);
  }
  // ...
}
```

## 📝 Files Changed

### 1. `src/lib/firebase-upload.ts`
- ✅ Fixed `uploadAvatar()` - Proper sanitization & extension
- ✅ Fixed `uploadCV()` - Returns path instead of URL
- ✅ Added filename length limit (50 chars)

### 2. `src/services/cvFirebaseService.ts`
- ✅ Fixed `uploadAvatar()` - Proper sanitization & extension
- ✅ Returns `storagePath` instead of `downloadURL`
- ✅ Added JSDoc comment about return value

## 🔧 How It Works Now

### Upload Flow
```typescript
// 1. User uploads avatar
const file = new File(['...'], 'photo z123.jpg');

// 2. Upload function sanitizes filename
const ext = 'jpg';
const sanitizedName = 'photo_z123'; // Special chars replaced
const fileName = '1733789123456_photo_z123.jpg';
const storagePath = 'careermate-files/candidates/3/avatar/1733789123456_photo_z123.jpg';

// 3. Save storagePath to database (NOT download URL)
await updateProfile({ avatar: storagePath });

// 4. Frontend displays avatar
const url = await getFileUrl(storagePath); // Fresh download URL
<img src={url} />
```

### Display Flow
```typescript
// Component receives storagePath from API
const avatarPath = 'careermate-files/candidates/3/avatar/photo.jpg';

// Hook resolves to download URL
const avatarUrl = useFileUrl(avatarPath);

// Or if it's an invalid URL (old data), it re-resolves
const invalidUrl = 'https://.../.../o/path/without/encoding';
const validUrl = useFileUrl(invalidUrl); // Re-resolves automatically
```

## 🎯 Benefits

1. ✅ **No more invalid URLs** - All files have proper extensions
2. ✅ **Clean filenames** - Special characters sanitized
3. ✅ **Consistent storage** - Always save paths, not URLs
4. ✅ **Backward compatible** - Old invalid URLs auto-resolve
5. ✅ **Future proof** - URLs refresh automatically via `getFileUrl()`

## 🧪 Testing Checklist

- [ ] Upload avatar with special characters in filename
- [ ] Upload avatar with Unicode characters (e.g., Vietnamese)
- [ ] Upload avatar without extension
- [ ] Upload CV file
- [ ] Verify storagePath is saved in database (not URL)
- [ ] Verify display works with old invalid URLs (backward compat)
- [ ] Verify display works with new storagePaths

## 📋 Migration Notes

### For Existing Invalid URLs in Database

**Option 1: Keep as-is** (Recommended)
- The `useFileUrl` hook already detects and re-resolves invalid URLs
- No database migration needed
- Gradual fix as users re-upload files

**Option 2: Database Migration Script**
```typescript
// Find all invalid URLs
const users = await db.users.findMany({
  where: {
    avatar: { contains: 'firebasestorage.googleapis.com/v0/b' }
  }
});

// Extract storage paths
for (const user of users) {
  if (isInvalidFirebaseUrl(user.avatar)) {
    const storagePath = extractPathFromInvalidUrl(user.avatar);
    await db.users.update({
      where: { id: user.id },
      data: { avatar: storagePath }
    });
  }
}
```

**Option 3: API Endpoint**
```typescript
// POST /api/fix-avatar-urls
// Batch process invalid URLs for all users
```

## 🚀 Deployment

```bash
# Test locally first
npm run dev

# Deploy
git add .
git commit -m "fix: sanitize Firebase upload filenames and return storage paths"
git push
```

## 📚 Related Files

- `src/lib/firebase-file.ts` - URL detection & resolution
- `src/lib/firebase-upload.ts` - Upload functions (FIXED)
- `src/services/cvFirebaseService.ts` - CV upload functions (FIXED)
- `src/hooks/useFileUrl.ts` - React hook for resolving URLs

## 🔗 References

- [Firebase Storage URL Structure](https://firebase.google.com/docs/storage/web/download-files)
- [URL Encoding for Firebase](https://stackoverflow.com/questions/firebase-storage-url-encoding)


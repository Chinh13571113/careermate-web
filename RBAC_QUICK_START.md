# 🚀 Quick Start Guide - RBAC System

## Tổng quan

Hệ thống phân quyền mới hỗ trợ 3 loại người dùng:
- **ADMIN** (Quản trị viên) - Full access
- **RECRUITER** (Nhà tuyển dụng) - Post jobs, view applications
- **CANDIDATE** (Ứng viên) - Browse & apply to jobs

## ✅ Hoàn thành

### 1. Core Files
- ✅ `src/types/roles.ts` - Role constants & utilities
- ✅ `src/lib/role-utils.ts` - Helper functions
- ✅ `src/hooks/useRoleCheck.ts` - React hooks

### 2. Auth Guards
- ✅ `src/components/auth/AdminAuthGuard.tsx` - Admin only
- ✅ `src/components/auth/RecruiterAuthGuard.tsx` - Recruiter + Admin
- ✅ `src/components/auth/CandidateAuthGuard.tsx` - All authenticated users

### 3. Updates
- ✅ `PostLoginRedirect.tsx` - Role-based redirect after login

## 📝 Cách sử dụng

### Tạo trang Admin (chỉ Admin)

```tsx
// app/admin/dashboard/page.tsx
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Chỉ admin mới thấy được trang này</p>
      </div>
    </AdminAuthGuard>
  );
}
```

### Tạo trang Recruiter (Recruiter + Admin)

```tsx
// app/recruiter/dashboard/page.tsx
import RecruiterAuthGuard from '@/components/auth/RecruiterAuthGuard';

export default function RecruiterDashboardPage() {
  return (
    <RecruiterAuthGuard>
      <div>
        <h1>Recruiter Dashboard</h1>
        <p>Nhà tuyển dụng và Admin có thể xem</p>
      </div>
    </RecruiterAuthGuard>
  );
}
```

### Tạo trang Candidate (Tất cả user đã đăng nhập)

```tsx
// app/profile/page.tsx
import CandidateAuthGuard from '@/components/auth/CandidateAuthGuard';

export default function ProfilePage() {
  return (
    <CandidateAuthGuard>
      <div>
        <h1>My Profile</h1>
        <p>Tất cả user đã đăng nhập đều xem được</p>
      </div>
    </CandidateAuthGuard>
  );
}
```

### Sử dụng Hooks để check role

```tsx
import { useIsAdmin, useIsRecruiter, useIsCandidate } from '@/hooks/useRoleCheck';

export function Navigation() {
  const isAdmin = useIsAdmin();
  const isRecruiter = useIsRecruiter();
  const isCandidate = useIsCandidate();
  
  return (
    <nav>
      {isAdmin && <Link href="/admin">Admin Panel</Link>}
      {isRecruiter && <Link href="/recruiter">Recruiter Dashboard</Link>}
      {isCandidate && <Link href="/jobs">Browse Jobs</Link>}
    </nav>
  );
}
```

### Conditional rendering theo role

```tsx
import { useRoleInfo } from '@/hooks/useRoleCheck';

export function JobCard({ job }) {
  const { isAdmin, isRecruiter } = useRoleInfo();
  const canEdit = isAdmin || isRecruiter;
  
  return (
    <div>
      <h3>{job.title}</h3>
      
      {canEdit && (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
      
      <button>Apply</button>
    </div>
  );
}
```

## 🔄 Auto Redirect sau khi đăng nhập

Hệ thống tự động redirect user đến trang phù hợp:

- **ADMIN** → `/admin`
- **RECRUITER** → `/recruiter/dashboard`
- **CANDIDATE** → `/jobs`

```tsx
// Đã tích hợp sẵn trong PostLoginRedirect.tsx
// Không cần code thêm gì
```

## 🎯 Cấu trúc thư mục đề xuất

```
app/
├── admin/                    # AdminAuthGuard
│   ├── layout.tsx           
│   ├── page.tsx             # Admin dashboard
│   ├── users/               # User management
│   └── settings/            # System settings
│
├── recruiter/               # RecruiterAuthGuard
│   ├── layout.tsx
│   ├── dashboard/           # Recruiter dashboard
│   ├── jobs/                # Job management
│   │   ├── new/            # Post new job
│   │   └── [id]/           # Edit job
│   └── applications/        # View applications
│
├── (home)/                  # CandidateAuthGuard cho protected pages
│   ├── profile/            # User profile
│   ├── my-jobs/            # Applied jobs
│   ├── cv-management/      # CV management
│   └── settings/           # User settings
│
└── jobs/                    # Public (no guard)
    ├── page.tsx            # Browse jobs
    └── [id]/               # Job details
```

## 📋 Checklist để áp dụng

### Phase 1: Tạo folder structure
- [ ] Tạo folder `app/recruiter/`
- [ ] Tạo folder `app/recruiter/dashboard/`
- [ ] Tạo folder `app/recruiter/jobs/`
- [ ] Tạo folder `app/recruiter/applications/`

### Phase 2: Tạo pages
- [ ] `app/recruiter/page.tsx` - Recruiter landing
- [ ] `app/recruiter/dashboard/page.tsx` - Dashboard
- [ ] `app/recruiter/jobs/page.tsx` - Job list
- [ ] `app/recruiter/jobs/new/page.tsx` - Create job
- [ ] `app/recruiter/applications/page.tsx` - Applications

### Phase 3: Update existing pages
- [ ] Wrap admin pages với `AdminAuthGuard`
- [ ] Wrap profile pages với `CandidateAuthGuard`
- [ ] Update navigation components
- [ ] Update header/footer

### Phase 4: Testing
- [ ] Test login as ADMIN → redirect to /admin
- [ ] Test login as RECRUITER → redirect to /recruiter/dashboard
- [ ] Test login as CANDIDATE → redirect to /jobs
- [ ] Test access control for each role
- [ ] Test unauthorized access attempts

## 🔧 Ví dụ hoàn chỉnh

### Recruiter Dashboard

```tsx
// app/recruiter/dashboard/page.tsx
import RecruiterAuthGuard from '@/components/auth/RecruiterAuthGuard';
import { useRoleInfo } from '@/hooks/useRoleCheck';

export default function RecruiterDashboard() {
  const { isAdmin, isRecruiter } = useRoleInfo();
  
  return (
    <RecruiterAuthGuard>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Recruiter Dashboard
        </h1>
        
        {isAdmin && (
          <div className="bg-yellow-100 p-4 rounded mb-4">
            ⚠️ Admin Mode: You have full access
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <StatsCard title="Active Jobs" value={12} />
          <StatsCard title="Applications" value={45} />
          <StatsCard title="Hired" value={8} />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
          <ApplicationList />
        </div>
      </div>
    </RecruiterAuthGuard>
  );
}
```

### Job Management Page

```tsx
// app/recruiter/jobs/page.tsx
import RecruiterAuthGuard from '@/components/auth/RecruiterAuthGuard';
import Link from 'next/link';

export default function JobsManagement() {
  return (
    <RecruiterAuthGuard>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <Link 
            href="/recruiter/jobs/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Post New Job
          </Link>
        </div>
        
        <JobList />
      </div>
    </RecruiterAuthGuard>
  );
}
```

### Navigation Component

```tsx
// components/Navigation.tsx
import { useRoleInfo } from '@/hooks/useRoleCheck';
import Link from 'next/link';

export function Navigation() {
  const { isAdmin, isRecruiter, isCandidate, roleCategory } = useRoleInfo();
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/jobs">Jobs</Link>
        
        {isCandidate && (
          <>
            <Link href="/profile">Profile</Link>
            <Link href="/my-jobs">My Applications</Link>
          </>
        )}
        
        {isRecruiter && (
          <>
            <Link href="/recruiter">Recruiter</Link>
            <Link href="/recruiter/dashboard">Dashboard</Link>
            <Link href="/recruiter/jobs">Manage Jobs</Link>
          </>
        )}
        
        {isAdmin && (
          <Link href="/admin" className="bg-red-600 px-3 py-1 rounded">
            Admin Panel
          </Link>
        )}
        
        <div className="ml-auto">
          Role: {roleCategory}
        </div>
      </div>
    </nav>
  );
}
```

## 🎨 UI Components

### Role Badge

```tsx
import { useRoleInfo } from '@/hooks/useRoleCheck';
import { getRoleDisplayName } from '@/lib/role-utils';

export function RoleBadge() {
  const { role, roleCategory } = useRoleInfo();
  
  const colors = {
    ADMIN: 'bg-red-500',
    RECRUITER: 'bg-blue-500',
    CANDIDATE: 'bg-green-500',
  };
  
  return (
    <span className={`${colors[roleCategory]} text-white px-3 py-1 rounded-full text-sm`}>
      {getRoleDisplayName(role)}
    </span>
  );
}
```

## 🚨 Lưu ý quan trọng

1. **Security**: Guards chỉ để UX, phải verify trên server
2. **JWT**: Role được decode từ JWT, không lưu localStorage
3. **Backward Compatible**: Hỗ trợ nhiều tên role (ADMIN, ROLE_ADMIN, etc.)
4. **Hierarchy**: ADMIN > RECRUITER > CANDIDATE
5. **Testing**: Test tất cả role scenarios trước khi deploy

## 📚 Documentation

Chi tiết đầy đủ: `RBAC_DOCUMENTATION.md`

## ✅ Status

- ✅ Core system implemented
- ✅ All guards created
- ✅ Hooks available
- ✅ PostLoginRedirect updated
- ⏳ Need to create recruiter pages
- ⏳ Need to update existing pages
- ⏳ Need to add tests

---

**Next Steps**: Tạo các trang cho Recruiter và áp dụng guards cho các trang hiện có.

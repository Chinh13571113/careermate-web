# 🔐 Security Implementation Guide

## 📖 Overview

This guide explains the security measures implemented in the CareerMate frontend application to protect user data and prevent common web vulnerabilities.

---

## 🎯 Key Security Principles

### 1. **Least Privilege**

- Store minimum data in localStorage
- Only expose necessary information to client

### 2. **Defense in Depth**

- Multiple security layers (client, API, middleware, backend)
- If one layer fails, others still protect

### 3. **Secure by Default**

- Safe logging enabled by default
- Production logs disabled automatically
- Sensitive data auto-redacted

---

## 🔒 What We Protect

### Critical Data (NEVER in localStorage):

- ❌ User email
- ❌ User full name
- ❌ Refresh tokens
- ❌ Passwords
- ❌ Session IDs

### Acceptable in localStorage:

- ✅ Access token (JWT) - short-lived, needed for API
- ✅ Token expiration time
- ✅ User role (verified server-side)

### Secure Storage (HTTP-only cookies):

- ✅ Refresh token - inaccessible to JavaScript

---

## 🛠️ How to Use Safe Logging

### Import the helper:

```typescript
import { safeLog, DEBUG } from "@/lib/debug-config";
```

### Log auth state (safe):

```typescript
// ✅ GOOD - No sensitive data
safeLog.authState("Login successful", {
  isAuthenticated: true,
  hasToken: !!accessToken,
  role: "ROLE_ADMIN",
});
```

### Log token info (safe):

```typescript
// ✅ GOOD - Only metadata
safeLog.token("Access token", accessToken);
// Outputs: { length: 150, prefix: 'eyJhbGci...' }
```

### Log JWT claims (safe):

```typescript
// ✅ GOOD - Redacted sensitive fields
safeLog.jwtClaims("Token claims", decoded);
// Outputs: { hasEmail: true, role: 'ROLE_ADMIN', exp: '2025-...' }
// NOT logged: actual email (sub field)
```

### ❌ NEVER DO THIS:

```typescript
// ❌ BAD - Leaks full token
console.log("Token:", accessToken);

// ❌ BAD - Leaks email in 'sub' field
console.log("Decoded JWT:", decoded);

// ❌ BAD - Leaks user email
console.log("User:", user);

// ❌ BAD - Leaks email
console.log("Login data:", { email: data.email });
```

---

## 🔧 Debug Configuration

### Development Mode

```typescript
// All debug logs enabled
DEBUG.AUTH = true;
DEBUG.LOGIN = true;
DEBUG.MIDDLEWARE = true;
```

### Production Mode

```typescript
// All debug logs disabled automatically
DEBUG.AUTH = false;
DEBUG.LOGIN = false;
DEBUG.MIDDLEWARE = false;

// Only security warnings enabled
DEBUG.SECURITY = true;
```

### Conditional Logging

```typescript
if (DEBUG.LOGIN) {
  safeLog.authState("Login flow", state);
}
// This log only shows in development
```

---

## 🚨 Common Security Mistakes

### 1. Logging Sensitive Data

```typescript
// ❌ DON'T
console.log("User logged in:", user.email);

// ✅ DO
safeLog.authState("User logged in", { hasUser: !!user });
```

### 2. Storing Sensitive Data

```typescript
// ❌ DON'T
localStorage.setItem("user_info", JSON.stringify(user));

// ✅ DO
// Decode from JWT when needed
const decoded = decodeJWT(accessToken);
const userEmail = decoded.sub; // Use in memory only
```

### 3. Trusting Client-Side Checks

```typescript
// ❌ DON'T (client-side only)
if (localStorage.getItem("role") === "ROLE_ADMIN") {
  // Show admin UI
}

// ✅ DO (verify server-side too)
// Client: Check role for UI rendering
// Server: Verify role in middleware/API
```

### 4. Exposing Errors

```typescript
// ❌ DON'T
catch (error) {
  console.log("Full error:", error);
  // Might contain tokens in error.config
}

// ✅ DO
catch (error) {
  safeLog.error("Error occurred", error);
  // Auto-redacts sensitive fields
}
```

---

## 🧪 Testing Security

### Quick Security Check:

```bash
# 1. Open DevTools Console
# 2. Login as admin
# 3. Check console output

# Should see:
✅ "Login state: { hasToken: true, role: 'ROLE_ADMIN' }"

# Should NOT see:
❌ Full token values
❌ Email addresses
❌ Decoded JWT payloads
❌ Cookie values
```

### LocalStorage Audit:

```javascript
// Open DevTools Console
Object.keys(localStorage).forEach((key) => {
  console.log(key, localStorage.getItem(key).substring(0, 50));
});

// Should only see:
// - access_token: "eyJhbGci..."
// - token_expires_at: "1760420878602"
// - user_role: "ROLE_ADMIN"

// Should NOT see:
// - user_info (removed for security)
// - email
// - password
```

### Production Readiness:

```bash
# Check NODE_ENV is set
echo $NODE_ENV  # Should be 'production'

# Verify no debug logs in console
# (Open production site, check DevTools Console)
# Should be empty or only show security warnings
```

---

## 📋 Code Review Checklist

Before merging code, verify:

- [ ] No `console.log(token)` or similar
- [ ] No `console.log(decoded)` with JWT
- [ ] No `console.log({ email })` or PII
- [ ] Uses `safeLog.*` helpers
- [ ] Wrapped in `if (DEBUG.*)` if needed
- [ ] No sensitive data in localStorage
- [ ] Server-side validation for roles
- [ ] Error messages don't leak info

---

## 🚀 Quick Start for Developers

### 1. Understanding the Security Files:

```
src/lib/
  ├── debug-config.ts       # Safe logging configuration
  └── security-cleanup.ts   # Auto-cleanup sensitive data

docs/
  ├── SECURITY.md                    # Security improvements explained
  ├── SECURITY_AUDIT_REPORT.md       # Detailed audit findings
  ├── SECURITY_CHECKLIST.md          # Complete security checklist
  └── SECURITY_IMPLEMENTATION.md     # This file (you are here)
```

### 2. Add a New Feature (Securely):

```typescript
// Import safe logging
import { safeLog, DEBUG } from "@/lib/debug-config";

function myFeature() {
  const { accessToken, user, role } = useAuthStore();

  // ✅ Log safely
  if (DEBUG.AUTH) {
    safeLog.authState("Feature state", {
      hasToken: !!accessToken,
      role: role,
    });
  }

  // ✅ Use token for API
  const response = await fetch("/api/data", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // ✅ Handle errors safely
  try {
    // ... code
  } catch (error) {
    safeLog.error("Feature error", error);
  }
}
```

### 3. Review Existing Code:

```bash
# Search for dangerous patterns
grep -r "console.log.*token" src/
grep -r "console.log.*decoded" src/
grep -r "console.log.*email" src/
grep -r "localStorage.setItem.*user" src/

# Should return minimal or no results
```

---

## 📞 Need Help?

### Questions about security?

1. Check `SECURITY_CHECKLIST.md` for guidelines
2. Review `SECURITY_AUDIT_REPORT.md` for examples
3. Search existing code for patterns
4. Ask team lead for code review

### Found a security issue?

1. **Don't commit** the vulnerable code
2. **Report immediately** to team lead
3. **Document** the issue and proposed fix
4. **Review** similar code for same issue

### Want to add new logging?

1. Use `safeLog.*` helpers (never `console.log`)
2. Wrap in `if (DEBUG.*)` checks
3. Verify no sensitive data logged
4. Test in both dev and production modes

---

## 🎓 Learning Resources

### Internal Docs:

- `SECURITY.md` - Why we made these changes
- `SECURITY_AUDIT_REPORT.md` - What issues we found
- `SECURITY_CHECKLIST.md` - Complete security status

### External Resources:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Web Security Academy](https://portswigger.net/web-security)

---

## ✅ Summary

**Key Takeaways**:

1. 🔒 Never log tokens, emails, or decoded JWTs
2. 🛡️ Store minimum data in localStorage
3. 🔍 Use `safeLog.*` helpers for all logging
4. ✅ Test security before merging code
5. 📚 Keep this guide updated

**Remember**: Security is everyone's responsibility! 🛡️

---

**Version**: 1.0  
**Last Updated**: 2025-01-14  
**Maintainer**: GitHub Copilot  
**Status**: ACTIVE ✅

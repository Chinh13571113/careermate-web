# API Services

This directory contains API service implementations and configurations.

## Structure

```
services/
  ├── api.ts           # Base API configuration
  ├── auth.service.ts  # Authentication API endpoints
  ├── user.service.ts  # User-related API endpoints
  └── http.ts         # HTTP client configuration
```

## Usage

```typescript
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'

// Making API calls
await authService.login(credentials)
await userService.getProfile()
```

## Adding New Services

1. Create a new service file: `[feature].service.ts`
2. Export service methods
3. Use the base API configuration
4. Document API endpoints and parameters

## Error Handling

All services should use the standard error handling pattern:
```typescript
try {
  const response = await api.get('/endpoint')
  return response.data
} catch (error) {
  throw new APIError(error)
}
```
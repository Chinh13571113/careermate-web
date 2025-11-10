# Types and Interfaces

This directory contains TypeScript types, interfaces, and type definitions for the application.

## Structure

```
types/
  ├── api.types.ts     # API response and request types
  ├── auth.types.ts    # Authentication related types
  ├── models.ts        # Data model types
  └── common.ts        # Shared type definitions
```

## Usage

Import types in your components and functions:

```typescript
import type { User } from '@/types/models'
import type { APIResponse } from '@/types/api.types'

// Using types
const user: User = {
  id: 1,
  name: 'John'
}

// Generic API responses
const response: APIResponse<User> = {
  data: user,
  status: 'success'
}
```

## Type Guidelines

1. Use interfaces for object types
2. Use type aliases for unions and complex types
3. Export all types from index.ts
4. Document complex types with JSDoc comments
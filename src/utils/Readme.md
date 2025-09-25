# Utilities

This directory contains helper functions, constants, and utility classes used throughout the application.

## Structure

```
utils/
  ├── constants.ts     # Application constants
  ├── formatters.ts    # Data formatting utilities
  ├── validators.ts    # Validation functions
  └── helpers.ts      # General helper functions
```

## Usage

Import utilities as needed:

```typescript
import { formatDate } from '@/utils/formatters'
import { validateEmail } from '@/utils/validators'
import { APP_CONFIG } from '@/utils/constants'

// Using utilities
const formattedDate = formatDate(new Date())
const isValid = validateEmail('user@example.com')
```

## Guidelines

1. Keep functions pure and stateless
2. Write unit tests for utility functions
3. Document function parameters and return types
4. Use meaningful constant names
5. Group related utilities in separate files
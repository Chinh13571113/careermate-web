# Custom Hooks

This directory contains reusable custom hooks that encapsulate common logic patterns.

## Structure

```
hooks/
  ├── useAuth.ts         # Authentication related hooks
  ├── useForm.ts        # Form handling hooks
  ├── useAPI.ts         # API interaction hooks
  └── useTheme.ts       # Theme management hooks
```

## Usage

Import and use hooks in your components:

```tsx
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'

// In your component
const { user, login, logout } = useAuth()
const { formData, handleChange } = useForm(initialValues)
```

## Creating New Hooks

1. Create a new file in this directory
2. Follow the naming convention: `use[Feature].ts`
3. Export the hook as the default export
4. Document the hook's parameters and return values
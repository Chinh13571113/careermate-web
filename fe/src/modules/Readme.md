# Modules (Features)

This directory contains feature modules, each representing a distinct functionality in the application.

## Structure

```
modules/
  ├── auth/            # Authentication module
  │   ├── components/  # Module-specific components
  │   ├── hooks/       # Module-specific hooks
  │   ├── services/    # Module-specific API services
  │   └── types/       # Module-specific types
  │
  ├── profile/         # User profile module
  └── dashboard/       # Dashboard module
```

## Guidelines

1. Each module should be self-contained
2. Keep module-specific components within the module
3. Share common components via the global components directory
4. Use index.ts to export public module features

## Creating New Modules

1. Create a new directory for your feature
2. Add necessary subdirectories (components, hooks, etc.)
3. Export public API through index.ts
4. Document module configuration and usage
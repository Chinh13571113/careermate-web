# UI Components

This directory contains reusable UI components built with:
- Tailwind CSS for styling
- [shadcn/ui](https://ui.shadcn.com/) component library
- Radix UI for accessible primitives

## Usage

Import components as needed:

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Use in your components
<Button>Click me</Button>
```

## Adding New Components

1. Use the shadcn-ui CLI to add new components:
```bash
npx shadcn-ui@latest add button
```

2. The component will be added to this directory automatically
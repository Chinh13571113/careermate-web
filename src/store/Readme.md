# Store Management

This directory contains state management logic using Redux Toolkit:

## Structure

```
store/
  ├── slices/        # Redux slices for different features
  ├── middleware/    # Custom Redux middleware
  └── index.ts      # Store configuration and exports
```

## Usage

1. Create new slices in the `slices` directory
2. Import and use in components:

```tsx
import { useSelector, useDispatch } from 'react-redux'
import { someAction } from '@/store/slices/featureSlice'

// In your component
const data = useSelector((state) => state.feature.data)
const dispatch = useDispatch()

// Dispatch actions
dispatch(someAction())
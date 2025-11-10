# Provider Components

This directory contains provider components that manage global state and themes:

- `active-theme`: Manages the current active theme state
- `theme-provider`: Provides theme context to the application

## Usage

1. Import the providers in your app layout:
```tsx
import { ThemeProvider } from './theme-provider'
import { ActiveThemeProvider } from './active-theme'

// Wrap your app with the providers
<ThemeProvider>
  <ActiveThemeProvider>
    {children}
  </ActiveThemeProvider>
</ThemeProvider>
```
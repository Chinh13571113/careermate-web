# Client Module (Candidate)

This module contains all client/candidate-related functionality for the AI-integrated web application.

## Structure

```
client/
├── auth/          # Authentication components and hooks
├── components/    # Client-specific UI components
├── hooks/         # Custom React hooks for client features
├── services/      # API services for client operations
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── index.ts       # Module exports
```

## Features

- **Authentication**: Sign in/up functionality
- **Profile Management**: Client profile creation and editing
- **Job Applications**: Apply to jobs and track application status
- **AI Recommendations**: AI-powered job recommendations
- **Skills Management**: Manage skills and certifications
- **Resume Builder**: AI-assisted resume creation
- **Interview Preparation**: AI-powered interview prep tools
- **Job Search**: Search and filter job opportunities

## Usage

```typescript
import { ClientProfile, JobApplicationService, SignInForm } from '@/modules/client';
```

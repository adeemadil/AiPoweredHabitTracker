# Habitual - Development Guidelines

## Project Overview

Habitual is a modern habit tracking application built with React, TypeScript, and Tailwind CSS v4, featuring Supabase backend integration for authentication, data persistence, and real-time analytics. The app combines the clean aesthetics of Notion with the motivational elements of Duolingo to create an engaging habit-building experience.

## Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Animations**: Motion React (formerly Framer Motion)
- **State Management**: React hooks with local state
- **Icons**: Lucide React

### Backend Stack
- **Database**: Supabase PostgreSQL with KV store
- **Authentication**: Supabase Auth with email/password and social login
- **Edge Functions**: Deno-based Supabase Edge Functions
- **Storage**: Supabase Storage for file uploads
- **Real-time**: Supabase real-time subscriptions

## Design System

### Color Palette
- **Primary**: #6EC1E4 (Pastel Blue)
- **Secondary**: #7ED6A5 (Pastel Green)
- **Background Light**: #f8f9fa
- **Background Dark**: #1a1b23
- **Card Light**: #ffffff
- **Card Dark**: #252631

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Base Size**: 14px (root font-size)

### Component Standards

#### Buttons
- Use gradient backgrounds for primary actions: `bg-gradient-to-r from-primary to-secondary`
- Include icons with 4px spacing: `<Icon className="h-4 w-4 mr-2" />`
- Maintain consistent padding and hover states

#### Cards
- Standard padding: `p-6`
- Hover effects: `hover:shadow-lg transition-all duration-200`
- Border radius: `rounded-lg` (1rem)

#### Forms
- Always use labels with proper accessibility
- Include loading states and error handling
- Validate inputs with visual feedback

## File Structure Standards

```
/components
  /ui               # shadcn/ui components only
  /figma           # Figma-specific components
  AuthScreen.tsx   # Full-screen auth experience
  HabitCard.tsx    # Individual habit display
  Navigation.tsx   # Main navigation component
  Sidebar.tsx      # Dashboard sidebar
  
/services
  habitService.ts  # All habit-related API calls
  
/utils
  /supabase
    client.tsx     # Singleton Supabase client
    info.tsx       # Project configuration
    
/styles
  globals.css      # Tailwind v4 custom properties
```

## Component Development Rules

### 1. TypeScript Requirements
- Always define proper interfaces for props
- Use proper typing for all state variables
- Import types from services when available
- Avoid `any` types - use proper typing or `unknown`

### 2. State Management
- Use useState for local component state
- Use useEffect sparingly and clean up subscriptions
- Implement loading states for all async operations
- Handle error states with user-friendly messages

### 3. Accessibility
- All interactive elements must be keyboard accessible
- Use proper ARIA labels and roles
- Maintain proper color contrast (WCAG 2.1 AA)
- Include screen reader support

### 4. Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid inline function creation in render loops
- Use lazy loading for heavy components

## Supabase Integration Standards

### 1. Client Management
- Always use the singleton client from `/utils/supabase/client.tsx`
- Never create multiple Supabase client instances
- Configure proper auth settings with session persistence

### 2. Authentication Flow
```typescript
// Proper session checking
const checkSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
  } catch (error) {
    console.error('Session error:', error);
  }
};
```

### 3. API Calls
- All backend calls should go through the habitService
- Use proper error handling with try/catch blocks
- Include loading states for user feedback
- Pass access tokens in Authorization headers

### 4. Real-time Features
- Use Supabase real-time subscriptions sparingly
- Clean up subscriptions in useEffect cleanup
- Handle connection errors gracefully

## UI/UX Guidelines

### 1. Animation Standards
- Use Motion React for all animations
- Keep animations under 300ms for interactions
- Use easing functions: `ease-out` for entrances, `ease-in` for exits
- Implement layout animations for dynamic content

### 2. Responsive Design
- Mobile-first approach with breakpoints
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`
- Ensure touch targets are minimum 44px
- Test on mobile devices regularly

### 3. Loading States
- Show skeleton loaders for content
- Use spinners for actions
- Implement progress bars for multi-step processes
- Never leave users without feedback

### 4. Error Handling
- Use Toast notifications for success/error messages
- Include retry mechanisms for failed operations
- Provide clear, actionable error messages
- Log errors to console for debugging

## Code Style

### 1. Naming Conventions
- Components: PascalCase (e.g., `HabitCard`)
- Functions: camelCase (e.g., `handleAddHabit`)
- Files: PascalCase for components, camelCase for utilities
- CSS classes: Follow Tailwind conventions

### 2. Import Organization
```typescript
// External libraries
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

// Internal imports
import { habitService } from '../services/habitService';
import { supabase } from '../utils/supabase/client';
```

### 3. Function Organization
- Keep components under 200 lines
- Extract complex logic into custom hooks
- Use early returns to reduce nesting
- Comment complex business logic

## Testing Standards

### 1. Component Testing
- Test user interactions and state changes
- Mock external dependencies
- Test error states and edge cases
- Ensure accessibility compliance

### 2. Integration Testing
- Test authentication flows
- Verify data persistence
- Test real-time features
- Check responsive behavior

## Security Guidelines

### 1. Authentication
- Never store passwords in localStorage
- Use httpOnly cookies when possible
- Implement proper session timeout
- Validate all user inputs

### 2. Data Protection
- Sanitize all user inputs
- Use parameterized queries
- Implement proper CORS headers
- Never expose sensitive data in client

## Performance Guidelines

### 1. Bundle Size
- Use dynamic imports for heavy components
- Implement code splitting by route
- Optimize images and assets
- Remove unused dependencies

### 2. Runtime Performance
- Avoid unnecessary re-renders
- Use proper React keys
- Implement virtualization for large lists
- Monitor Core Web Vitals

## Deployment

### 1. Environment Variables
```typescript
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Build Process
- Run TypeScript type checking
- Execute linting and formatting
- Run test suites
- Build optimized production bundle

## Maintenance

### 1. Dependencies
- Keep dependencies updated monthly
- Test major version upgrades carefully
- Document breaking changes
- Use exact versions for critical packages

### 2. Monitoring
- Monitor error rates and performance
- Track user engagement metrics
- Monitor Supabase usage and costs
- Implement proper logging

This document should be updated as the project evolves and new patterns emerge.
# Implementation File

## Overview
This document outlines the step-by-step implementation plan for the AI-Powered Habit Tracker app improvements, focusing on UI/UX redesign, AI feature integration, backend enhancements, and modularity.

---

## 1. UI/UX Redesign & Modularity

### 1.1 Dashboard Layout
- Implement a persistent sidebar with navigation links:
  - Habits
  - Friends
  - (Future: Notifications, Analytics, AI Suggestions, Settings)
- Use React components with Tailwind CSS for responsive styling.
- Sidebar navigation is always visible for easy access to main features.
- Ensure accessibility (ARIA roles, keyboard navigation).

### 1.2 Habit & Friends Cards
- Redesign habit and friends cards with:
  - Color-coded avatars (initials)
  - Name/email and action buttons
  - Current streak and completion button (for habits)
  - "View/Send Cheers" button with modal (for habits)
- Add animations for streak updates and cheers received.
- Use modular components: `components/habits/`, `components/friends/`

### 1.3 Friends & Cheers UI
- Create a Friends page:
  - List current friends and pending requests
  - Buttons to accept/decline/remove friends
  - Use `FriendsList` and other modular components from `components/friends/`
- Cheers modal:
  - List cheers with sender, message, timestamp
  - Input for sending cheers (disabled if not friend or self)

### 1.4 UI Primitives
- Create and maintain reusable, low-level UI components in `components/ui/` (e.g., Button, Input, Modal, Avatar)
- Use these primitives throughout the app for consistency (Habits, Friends, etc.)
- All UI primitives follow cursor and accessibility rules

### 1.5 Analytics Page
- Implement charts (e.g., line, bar) using a library like Recharts or Chart.js.
- Display:
  - Habit completion trends
  - Streak milestones and badges
  - Mood tracking overview (if implemented)

---

## 2. AI Feature Integration

### 2.1 Habit Suggestions
- Backend:
  - Create API endpoint `/ai/suggestions` to fetch personalized habit suggestions.
  - Use OpenAI API with user data (habits, goals, social trends) as prompt context.
- Frontend:
  - Add AI Suggestions page displaying recommended habits.
  - Allow users to add suggested habits with one click.

### 2.2 Motivational Messaging
- Backend:
  - Endpoint `/ai/motivation` to generate motivational messages based on user progress and mood.
- Frontend:
  - Display motivational messages on dashboard or habit completion confirmation.

### 2.3 Adaptive Reminders (Planned)
- Design reminder system that triggers notifications based on AI predictions.
- Integrate with calendar/time APIs for context-aware nudges.

---

## 3. Backend Enhancements

### 3.1 Database Schema Updates
- Add `HabitCompletion.mood` and `notes` fields.
- Add `AIRecommendation` table for storing AI-generated suggestions.
- Add `Notification` model (UI implementation planned)

### 3.2 API Updates (tRPC)
- Extend existing habit routes for mood and notes.
- Add new AI routes for suggestions and motivational messages.
- Enhance friend and cheer routes for modularity.

---

## 4. Modularity & Consistency
- Maintain modular folder structure for all features (habits, friends, etc.)
- Use UI primitives from `components/ui/` throughout the app
- Ensure all new UI (Friends, Habits, sidebar, etc.) follows cursor and accessibility rules
- Plan for future modularization of notifications and analytics

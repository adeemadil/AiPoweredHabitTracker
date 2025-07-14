# Backend Structure

## Database (PostgreSQL via Prisma ORM)

- User: id, email, name, profile, settings
- Habit: id, userId, name, emoji, frequency, streak, createdAt, updatedAt
- HabitCompletion: id, habitId, date, mood, notes
- Friendship: id, userId, friendId, status (pending, accepted, declined)
- Cheer: id, senderId, receiverId, habitId, message, createdAt
- Notification: id, userId, type, message, isRead, relatedEntityId, createdAt, updatedAt
- AIRecommendation: id, userId, habitSuggestion, reason, createdAt

## API (tRPC)

- Auth: signUp, signIn, signOut
- Habits: create, read, update, delete, complete, getHistory
- Friends: sendRequest, acceptRequest, declineRequest, removeFriend, listFriends, listPendingRequests
- Cheers: sendCheer, listCheers
- Notification: (planned) listNotifications, markAsRead
- AI: getSuggestions, getMotivationalMessage, analyzeProgress

## Integrations

- OpenAI API (for AI-powered suggestions, motivational messages, sentiment analysis)
- (Optional) Calendar/weather API for contextual nudges

## Structure & Modularity

- Modular tRPC routers for habits, friends, cheers, and (planned) notifications
- Backend and frontend use a modular folder structure for maintainability
- UI primitives (Button, etc.) are maintained in `components/ui/` and used throughout the frontend for consistency, accessibility, and cursor rules
- Friends and Cheers features are fully supported in both backend and UI
- Notification model is present in backend, UI implementation is planned
- Toast notifications, disabled states, and the Spinner UI primitive are used for all user feedback and error handling in the frontend, tightly integrated with backend responses. Skeleton loaders are used for lists, and Spinner is used for focused loading (e.g., buttons, modals).

# Backend Structure

## Database (PostgreSQL via Prisma ORM)
- User: id, email, name, profile, settings
- Habit: id, userId, name, emoji, frequency, streak, createdAt, updatedAt
- HabitCompletion: id, habitId, date, mood, notes
- Friendship: id, userId, friendId, status (pending, accepted, declined)
- Cheer: id, fromUserId, toUserId, habitId, message, createdAt
- AIRecommendation: id, userId, habitSuggestion, reason, createdAt

## API (tRPC)
- Auth: signUp, signIn, signOut
- Habits: create, read, update, delete, complete, getHistory
- Friends: sendRequest, acceptRequest, declineRequest, removeFriend, listFriends
- Cheers: sendCheer, listCheers
- AI: getSuggestions, getMotivationalMessage, analyzeProgress

## Integrations
- OpenAI API (for AI-powered suggestions, motivational messages, sentiment analysis)
- (Optional) Calendar/weather API for contextual nudges

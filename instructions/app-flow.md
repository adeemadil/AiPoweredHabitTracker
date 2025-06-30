# App Flow

1. **User Authentication**
   - Sign up / Sign in (Clerk)
   - Redirect to Dashboard upon authentication

2. **Main Dashboard**
   - Persistent sidebar navigation: Habits | Friends (and future: Notifications, Analytics, AI Suggestions, Settings)
   - Habit List: View, add, edit, delete habits
   - Mark habits as complete (streak updates)
   - View habit details (history, mood, cheers)
   - Friends List: View, add, remove friends; manage requests
   - All main features are accessible from the sidebar for easy navigation

3. **Friends & Cheers**
   - Add/search friends by email
   - Accept/decline friend requests
   - View friends list, pending requests
   - Send/receive cheers (with restrictions)
   - Friends UI is modularized in `components/friends/` and uses UI primitives from `components/ui/`

4. **Analytics/Progress**
   - View streaks, completion rates, badges, and graphs

5. **AI Features**
   - Receive personalized habit suggestions
   - Get adaptive reminders and motivational messages
   - View AI-powered progress summaries and insights

6. **Settings/Profile**
   - Manage account, notification preferences, and theme (light/dark)

7. **UI Primitives**
   - Reusable, low-level UI components (Button, Input, etc.) are maintained in `components/ui/` and used throughout the app for consistency.

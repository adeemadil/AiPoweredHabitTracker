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
   - **All feature UIs use atomic UI primitives from `components/ui/` for consistency, accessibility, and cursor/click states.**
   - **Toast notifications** are used for all feedback (success, error, info), replacing blocking alerts.
   - **Disabled states** and tooltips are used for restricted actions (e.g., sending cheers to self).

3. **Friends & Cheers**
   - Add/search friends by email
   - Accept/decline friend requests
   - View friends list, pending requests
   - Send/receive cheers (with restrictions)
   - Friends UI is modularized in `components/friends/` and uses UI primitives from `components/ui/`
   - **All actions follow cursor and accessibility rules.**

4. **Analytics/Progress**
   - View streaks, completion rates, badges, and graphs

5. **AI Features**
   - Receive personalized habit suggestions
   - Get adaptive reminders and motivational messages
   - View AI-powered progress summaries and insights

6. **Settings/Profile**
   - Manage account, notification preferences, and theme (light/dark)

7. **UI Primitives**
   - Reusable, low-level UI components (Button, Input, etc.) are maintained in `components/ui/` and used throughout the app for consistency, accessibility, and cursor rules.
   - **All feature components (Habits, Friends, Cheers, Sidebar, etc.) are built using these primitives for a unified UX.**

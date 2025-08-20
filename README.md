# AI-Powered Habit Tracker

A modern, full-stack habit tracking application built with Next.js, tRPC, and OpenAI integration. Track your habits, get AI-powered suggestions, and stay motivated with personalized messages. Now with comprehensive social features, settings management, and AI-powered challenges!

## Features

- 🔐 **Secure authentication** with Clerk
- 📊 **Track daily habits and streaks** with visual progress indicators
- ➕ **Add, view, and complete habits** (daily/weekly/monthly)
- 👫 **Social features:**
  - Send, accept, and decline friend requests
  - View your friends and pending requests
  - Remove friends
- 🎉 **Cheers system:**
  - Send and receive cheers (encouraging messages) on friends' habits
  - View all cheers for a habit in a modal
  - Cannot send cheers to yourself (button is disabled and tooltip explains why)
  - Error and success messages are shown as modern toast popups
- ⚙️ **Settings & Preferences:**
  - Theme switching (Light/Dark/System)
  - Notification preferences
  - Privacy settings
  - Regional settings (timezone, language)
- 🔔 **Notification System:**
  - In-app notifications for friend requests, cheers, and milestones
  - Email and push notification support (placeholder)
  - Mark as read, delete, and bulk management
  - Real-time unread count
- 🏆 **AI-Powered Challenges System:**
  - Create and join habit challenges
  - AI-generated challenge suggestions based on user habits
  - Leaderboards and progress tracking
  - Challenge rewards and achievements
  - Social competition features
- 🤖 **AI Integration:**
  - OpenAI-powered habit suggestions
  - AI-generated motivational messages
  - Smart challenge recommendations
  - Personalized insights and analytics
- 🌙 **Dark mode support** with system preference detection
- 📱 **Responsive design** with mobile-optimized navigation
- ⚡ **Modern UI/UX:**
  - Toast popups for feedback
  - Disabled buttons and tooltips for restricted actions
  - Clean, mobile-friendly dashboard
  - Horizontal scrolling for habit cards
  - Keyboard navigation support

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TailwindCSS, next-themes
- **Backend:** tRPC, Prisma ORM
- **Database:** PostgreSQL (Railway)
- **Authentication:** Clerk
- **AI Integration:** OpenAI API
- **Data Fetching:** TanStack Query
- **State Management:** React hooks with tRPC
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Clerk account and API keys
- PostgreSQL database (Railway recommended)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-powered-habit-tracker.git
cd ai-powered-habit-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

- `OPENAI_API_KEY` - Your OpenAI API key for AI features
- `CLERK_SECRET_KEY` - Clerk secret key for authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `DATABASE_URL` - PostgreSQL connection string

4. Initialize the database:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── api/trpc/        # tRPC API routes
├── (auth)/          # Authentication pages
├── (dashboard)/     # Main app pages (habits, friends, settings, challenges)
├── components/      # React components
│   ├── ui/         # Reusable UI primitives
│   ├── habits/     # Habit-related components
│   └── friends/    # Friend-related components
├── lib/             # Utility functions and services
│   ├── trpc/       # tRPC configuration and routers
│   └── prisma.ts   # Database client
└── styles/          # Global styles
```

## User Experience & Flow

1. **Sign in** (or sign up) securely with Clerk
2. **Add habits** you want to track (with emoji and frequency)
3. **Mark habits as complete** each day to build your streak
4. **Add friends** by email, accept/decline requests, and manage your friend list
5. **Send and receive cheers** to/from friends for extra motivation
6. **Customize settings** including theme, notifications, and privacy preferences
7. **Join AI-powered challenges** for extra motivation and social competition
8. **Receive smart notifications** for important events and milestones
9. **All feedback** (errors, successes) is shown as modern toast popups
10. **Navigate seamlessly** with keyboard shortcuts and responsive design

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Troubleshooting

- SSR error: `ReferenceError: window is not defined`
  - Ensure Supabase client is SSR-safe. Use `typeof window !== 'undefined'` checks and pass `storage: window.localStorage` only in the browser.

- Next.js warnings: Unsupported metadata `viewport`/`themeColor`
  - Move these to a dedicated `export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#...' }` in `app/layout.tsx`.

- Module not found for `class-variance-authority@0.7.1`
  - Import without version suffix: `import { cva } from 'class-variance-authority'`.

- Versioned imports in shadcn/ui
  - Replace imports like `@radix-ui/react-accordion@1.2.3` with `@radix-ui/react-accordion`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

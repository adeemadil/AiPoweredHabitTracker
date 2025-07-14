# AI-Powered Habit Tracker

A modern, full-stack habit tracking application built with Next.js, tRPC, and OpenAI integration. Track your habits, get AI-powered suggestions, and stay motivated with personalized messages. Now with social features: add friends, send cheers, and encourage each other!

## Features

- 🔐 **Secure authentication** with Clerk
- 📊 **Track daily habits and streaks**
- ➕ **Add, view, and complete habits** (daily/weekly)
- 👫 **Social features:**
  - Send, accept, and decline friend requests
  - View your friends and pending requests
  - Remove friends
- 🎉 **Cheers system:**
  - Send and receive cheers (encouraging messages) on friends' habits
  - View all cheers for a habit in a modal
  - Cannot send cheers to yourself (button is disabled and tooltip explains why)
  - Error and success messages are shown as modern toast popups
- 🤖 **AI-powered habit suggestions** (planned/partial)
- 💪 **Motivational messages** (planned/partial)
- 🌙 **Dark mode support**
- 📱 **Responsive design**
- ⚡ **Modern UI/UX:**
  - Toast popups for feedback
  - Disabled buttons and tooltips for restricted actions
  - Clean, mobile-friendly dashboard

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TailwindCSS
- **Backend:** tRPC, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** Clerk
- **AI Integration:** OpenAI API
- **Data Fetching:** TanStack Query
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Clerk account and API keys

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

- `OPENAI_API_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

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
├── (dashboard)/     # Main app pages
├── components/      # React components
├── lib/             # Utility functions
└── styles/          # Global styles
```

## User Experience & Flow

1. **Sign in** (or sign up) securely with Clerk.
2. **Add habits** you want to track (with emoji and frequency).
3. **Mark habits as complete** each day to build your streak.
4. **Add friends** by email, accept/decline requests, and manage your friend list.
5. **Send and receive cheers** to/from friends for extra motivation. View all cheers for a habit in a modal.
6. **Cannot send cheers to yourself** (button is disabled and a tooltip explains why).
7. **All feedback** (errors, successes) is shown as a modern toast popup, not a blocking alert.
8. **See all your habits, friends, and cheers** in a clean, modern dashboard.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

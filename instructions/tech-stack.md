# Tech Stack

- **Frontend:** React (Next.js), Tailwind CSS, TypeScript
- **State Management:** React Query, Zustand (if needed)
- **UI Library:** Custom components + Headless UI, Radix UI
- **UI Primitives:** Button, Input, etc. in `components/ui/` (used throughout the app for consistency, accessibility, and cursor rules)
- **Navigation:** Persistent sidebar navigation for Habits, Friends, etc. (built with UI primitives)
- **Feature Structure:** Modular folders for features (e.g., `components/habits/`, `components/friends/`)
- **All feature UIs (Habits, Friends, Cheers, Sidebar, etc.) use atomic UI primitives for a unified, accessible, and consistent experience.**
- **All user feedback (success, error, info) is provided via toast notifications and tooltips, not blocking alerts.**
- **Authentication:** Clerk
- **Backend:** tRPC (type-safe API)
- **Database:** PostgreSQL (via Prisma ORM)
- **AI Integration:** OpenAI API (habit suggestions, motivation, sentiment analysis)
- **Notifications:** Toast popups (react-hot-toast or similar)
- **Testing:** Vitest, Playwright, Jest, React Testing Library
- **CI/CD:** GitHub Actions, Vercel (deployment)
- **Design:** Figma (UI kit, prototyping)
- **Accessibility:** All UI primitives and navigation follow accessibility and cursor rules

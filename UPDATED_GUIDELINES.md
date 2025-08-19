# Habitual - Updated Development Guidelines (Next.js + tRPC Edition)

## Project Overview

Habitual is a modern habit tracking application built with **Next.js, tRPC, TypeScript, and Tailwind CSS v4**, with planned **Supabase integration** for data persistence and real-time features. The app combines clean design with engaging social features (friend requests, cheers system) to create a motivating habit-building experience.

## Current Architecture

### Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **API Layer**: tRPC for type-safe API calls
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Animations**: Motion React (formerly Framer Motion)
- **State Management**: React hooks + tRPC queries
- **Icons**: Lucide React

### Backend Stack (Current + Planned)
- **Authentication**: Clerk (keep) OR migrate to Supabase Auth
- **API**: tRPC procedures + Next.js API routes
- **Database**: **Supabase PostgreSQL** (to be integrated)
- **Real-time**: **Supabase real-time subscriptions** (planned)
- **AI**: OpenAI API integration (planned)
- **File Storage**: Supabase Storage (planned)

## Integration Strategy: tRPC + Supabase Hybrid

### 1. **Keep tRPC for Complex Operations**
```typescript
// /server/api/routers/habits.ts
export const habitsRouter = createTRPCRouter({
  // Complex operations with multiple steps
  createWithAIAnalysis: protectedProcedure
    .input(z.object({ name: z.string(), frequency: z.enum(['daily', 'weekly']) }))
    .mutation(async ({ input, ctx }) => {
      // 1. Create habit in Supabase
      const { data: habit } = await supabase
        .from('habits')
        .insert({ ...input, user_id: ctx.userId })
        .select()
        .single();
      
      // 2. Get AI suggestions
      const aiSuggestions = await openai.suggestions.create({
        habitName: input.name
      });
      
      // 3. Update habit with AI data
      return await supabase
        .from('habits')
        .update({ ai_suggestions: aiSuggestions })
        .eq('id', habit.id);
    }),

  // Social features (your unique strength)
  sendCheer: protectedProcedure
    .input(z.object({ habitId: z.string(), message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Complex social logic here
    }),
});
```

### 2. **Use Direct Supabase for Simple Operations**
```typescript
// /hooks/useHabits.ts
export function useHabits() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);
      return data;
    },
  });
}

// For real-time updates
export function useRealtimeHabits() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel('habits')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'habits'
      }, (payload) => {
        // Update local state
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
}
```

## File Structure (Updated for Next.js)

```
/app                    # Next.js App Router
  /api                 # API routes (if needed beyond tRPC)
  /dashboard           # Dashboard page
  /onboarding          # Onboarding flow
  layout.tsx           # Root layout
  page.tsx             # Home page

/components
  /ui                  # shadcn/ui components
  /features           # Feature-specific components
    /habits           # Habit-related components
    /social           # Social features (cheers, friends)
    /auth             # Auth components
  
/server                # tRPC server
  /api
    /routers
      habits.ts        # Habit operations
      social.ts        # Social features
      analytics.ts     # AI insights
    root.ts            # Root router
    trpc.ts           # tRPC setup

/lib
  /supabase
    client.ts         # Supabase client
    types.ts          # Database types
  /auth
    clerk.ts          # Clerk configuration
  /ai
    openai.ts         # OpenAI integration

/hooks                # Custom React hooks
/utils                # Utility functions
/styles
  globals.css         # Tailwind + custom CSS
```

## Component Development Standards

### 1. **Next.js Specific Patterns**
```typescript
// Use Next.js dynamic imports for code splitting
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <HabitCardSkeleton />,
  ssr: false, // If component uses browser-only features
});

// Use Next.js Image component for optimized images
import Image from 'next/image';

export function HabitCard({ habit }: { habit: Habit }) {
  return (
    <Card>
      <Image
        src={habit.imageUrl}
        alt={habit.name}
        width={300}
        height={200}
        className="rounded-lg"
        priority={false} // Set to true for above-fold images
      />
    </Card>
  );
}
```

### 2. **tRPC Integration Patterns**
```typescript
// Use tRPC hooks in components
import { api } from '~/utils/api';

export function HabitList() {
  const { data: habits, isLoading } = api.habits.getAll.useQuery();
  const createHabit = api.habits.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch habits
      utils.habits.getAll.invalidate();
    },
  });

  if (isLoading) return <HabitListSkeleton />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {habits?.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
```

### 3. **Social Features (Your Strength)**
```typescript
// Build on your existing cheers system
export function CheersButton({ habitId, canCheer }: CheersButtonProps) {
  const sendCheer = api.social.sendCheer.useMutation();
  
  return (
    <Button
      disabled={!canCheer}
      onClick={() => sendCheer.mutate({ habitId, message: '🎉 Great job!' })}
      className="bg-gradient-to-r from-primary to-secondary"
    >
      {canCheer ? '🎉 Send Cheer' : '🎉 Cheered!'}
    </Button>
  );
}

// Friend system enhancement
export function FriendsList() {
  const { data: friends } = api.social.getFriends.useQuery();
  const { data: pendingRequests } = api.social.getPendingRequests.useQuery();
  
  return (
    <div className="space-y-4">
      {pendingRequests?.map(request => (
        <FriendRequestCard key={request.id} request={request} />
      ))}
      {friends?.map(friend => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
```

## Database Schema (Supabase Integration)

### Core Tables
```sql
-- Users (handled by Clerk, but store additional data)
CREATE TABLE user_profiles (
  id uuid primary key,
  clerk_user_id text unique not null,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Habits
CREATE TABLE habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  name text not null,
  emoji text default '✨',
  frequency text default 'daily',
  category text,
  current_streak integer default 0,
  best_streak integer default 0,
  completion_rate numeric default 0,
  created_at timestamp with time zone default now(),
  archived boolean default false
);

-- Habit Completions
CREATE TABLE habit_completions (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references habits(id) on delete cascade,
  user_id uuid references user_profiles(id) on delete cascade,
  completed_at timestamp with time zone default now(),
  skipped boolean default false,
  notes text
);

-- Social Features (Your Unique Value)
CREATE TABLE friendships (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references user_profiles(id) on delete cascade,
  addressee_id uuid references user_profiles(id) on delete cascade,
  status text default 'pending', -- pending, accepted, declined
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

CREATE TABLE cheers (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references habits(id) on delete cascade,
  from_user_id uuid references user_profiles(id) on delete cascade,
  to_user_id uuid references user_profiles(id) on delete cascade,
  message text default '🎉',
  created_at timestamp with time zone default now()
);
```

### Row Level Security (RLS) Policies
```sql
-- Users can only see their own profile data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Users can only see their own habits
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (user_id IN (
    SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
  ));

-- Friends can see each other's habits for cheering
CREATE POLICY "Friends can view habits for cheering" ON habits
  FOR SELECT USING (
    user_id IN (
      SELECT addressee_id FROM friendships 
      WHERE requester_id IN (
        SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
      ) AND status = 'accepted'
      UNION
      SELECT requester_id FROM friendships 
      WHERE addressee_id IN (
        SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
      ) AND status = 'accepted'
    )
  );
```

## AI Integration Strategy

### 1. **Habit Suggestions**
```typescript
// /lib/ai/suggestions.ts
export async function generateHabitSuggestions(userProfile: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a habit-building expert. Suggest 3 realistic habits based on user preferences."
      },
      {
        role: "user",
        content: `User profile: ${JSON.stringify(userProfile)}`
      }
    ],
  });
  
  return parseHabitSuggestions(response.choices[0].message.content);
}
```

### 2. **Progress Insights**
```typescript
// /server/api/routers/analytics.ts
export const analyticsRouter = createTRPCRouter({
  getInsights: protectedProcedure
    .query(async ({ ctx }) => {
      const completions = await getRecentCompletions(ctx.userId);
      const aiInsights = await generateInsights(completions);
      return aiInsights;
    }),
});
```

## Performance Optimization

### 1. **Next.js Optimizations**
```typescript
// app/layout.tsx
export const metadata = {
  title: 'Habitual - Smart Habit Tracker',
  description: 'Build lasting habits with AI insights and social motivation',
};

// Use loading.tsx files for instant loading states
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// Use error.tsx files for error boundaries
// app/dashboard/error.tsx
export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorBoundary error={error} onReset={reset} />;
}
```

### 2. **tRPC Performance**
```typescript
// Use tRPC's built-in caching
const { data: habits } = api.habits.getAll.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// Implement optimistic updates
const utils = api.useContext();
const completeHabit = api.habits.complete.useMutation({
  onMutate: async ({ habitId }) => {
    // Cancel outgoing refetches
    await utils.habits.getAll.cancel();
    
    // Snapshot previous value
    const previousHabits = utils.habits.getAll.getData();
    
    // Optimistically update
    utils.habits.getAll.setData(undefined, (old) =>
      old?.map(habit => 
        habit.id === habitId 
          ? { ...habit, completedToday: true, currentStreak: habit.currentStreak + 1 }
          : habit
      )
    );
    
    return { previousHabits };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    utils.habits.getAll.setData(undefined, context?.previousHabits);
  },
});
```

## Immediate Implementation Priority

### Week 1: Supabase Foundation
1. Set up Supabase project and database
2. Create database schema with RLS policies
3. Update habitService to use Supabase
4. Test Clerk + Supabase integration

### Week 2: Enhanced Features
1. Add AI insights widget
2. Implement basic analytics
3. Enhance your existing social features
4. Add data persistence

### Week 3: Polish & Performance
1. Add loading states and error boundaries
2. Implement optimistic updates
3. Add onboarding flow
4. Performance optimization

This approach lets you keep your solid foundation while adding the missing pieces for a complete, competitive habit tracking app.
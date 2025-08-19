import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to get user ID from authorization token
async function getUserId(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  
  return user.id;
}

// Auth Routes
app.post('/make-server-b25eddda/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Account created successfully' 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Habit Routes
app.get('/make-server-b25eddda/habits', async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habits = await kv.getByPrefix(`habit:${userId}:`);
    return c.json({ habits: habits || [] });
  } catch (error) {
    console.log('Get habits error:', error);
    return c.json({ error: 'Failed to fetch habits' }, 500);
  }
});

app.post('/make-server-b25eddda/habits', async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, emoji, frequency } = await c.req.json();
    
    const habitId = crypto.randomUUID();
    const habit = {
      id: habitId,
      name,
      emoji,
      frequency,
      completed: false,
      streak: 0,
      progress: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
      userId
    };

    await kv.set(`habit:${userId}:${habitId}`, habit);
    
    return c.json({ success: true, habit });
  } catch (error) {
    console.log('Create habit error:', error);
    return c.json({ error: 'Failed to create habit' }, 500);
  }
});

app.put('/make-server-b25eddda/habits/:id/complete', async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    const habitKey = `habit:${userId}:${habitId}`;
    
    const habit = await kv.get(habitKey);
    if (!habit) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    // Update habit with completion
    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompletedDate || '';
    
    let newStreak = habit.streak || 0;
    if (lastCompleted !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompleted === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const updatedHabit = {
      ...habit,
      completedToday: true,
      progress: 100,
      streak: newStreak,
      lastCompletedDate: today
    };

    await kv.set(habitKey, updatedHabit);
    
    // Track completion in history
    const completionKey = `completion:${userId}:${habitId}:${today}`;
    await kv.set(completionKey, {
      habitId,
      userId,
      date: today,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true, habit: updatedHabit });
  } catch (error) {
    console.log('Complete habit error:', error);
    return c.json({ error: 'Failed to complete habit' }, 500);
  }
});

app.put('/make-server-b25eddda/habits/:id/skip', async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    const habitKey = `habit:${userId}:${habitId}`;
    
    const habit = await kv.get(habitKey);
    if (!habit) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    const updatedHabit = {
      ...habit,
      progress: 0,
      streak: 0,
      lastSkippedDate: new Date().toDateString()
    };

    await kv.set(habitKey, updatedHabit);
    
    return c.json({ success: true, habit: updatedHabit });
  } catch (error) {
    console.log('Skip habit error:', error);
    return c.json({ error: 'Failed to skip habit' }, 500);
  }
});

app.delete('/make-server-b25eddda/habits/:id', async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    await kv.del(`habit:${userId}:${habitId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete habit error:', error);
    return c.json({ error: 'Failed to delete habit' }, 500);
  }
});

// Analytics Routes
app.get('/make-server-b25eddda/analytics', async (c) => {
  try {
    const userId = await getUserId(c.req.raw);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get completion history for the last 7 days
    const completions = await kv.getByPrefix(`completion:${userId}:`);
    
    // Calculate weekly stats
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayCompletions = completions.filter(c => c.date === dateString);
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateString,
        completed: dayCompletions.length,
        completionRate: 0 // Will be calculated based on total habits
      });
    }

    // Get total habits for completion rate calculation
    const habits = await kv.getByPrefix(`habit:${userId}:`);
    const totalHabits = habits.length;
    
    // Update completion rates
    last7Days.forEach(day => {
      day.completionRate = totalHabits > 0 ? Math.round((day.completed / totalHabits) * 100) : 0;
    });

    return c.json({
      weeklyData: last7Days,
      totalHabits,
      weeklyAverage: last7Days.reduce((sum, day) => sum + day.completionRate, 0) / 7
    });
  } catch (error) {
    console.log('Analytics error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Health check
app.get('/make-server-b25eddda/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
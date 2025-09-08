import { auth } from '@clerk/nextjs';

export interface Habit {
  isFavorite: unknown;
  completionRate: number;
  id: string;
  name: string;
  emoji: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  currentStreak: number;
  bestStreak: number;
  progress: number;
  completedToday?: boolean;
  createdAt: string;
  userId: string;
  // Legacy support for existing components
  streak: number;
  // New fields for iterative completion
  targetQuantity?: number;
  currentQuantity?: number;
  unit?: string;
  isQuantifiable?: boolean;
}

class HabitService {
  private async fetchJSON(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Request failed');
    return data;
  }

  async getCurrentSession() {
    try {
      const res = await this.fetchJSON('/api/session');
      return res.session;
    } catch {
      return null;
    }
  }

  async signOut() {
    // Clerk handles sign out via UI; no-op here
  }

  async getHabits(): Promise<Habit[]> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const result = await this.fetchJSON('/api/habits');
      return result.habits || [];
    } catch (error) {
      console.error('Get habits error:', error);
      throw error;
    }
  }

  async createHabit(habitData: { name: string; emoji: string; frequency: string }): Promise<Habit> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const result = await this.fetchJSON('/api/habits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(habitData) });
      return result.habit;
    } catch (error) {
      console.error('Create habit error:', error);
      throw error;
    }
  }

  async completeHabit(habitId: string): Promise<Habit> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const result = await this.fetchJSON(`/api/habits/${habitId}/complete`, { method: 'PUT' });
      return result.habit;
    } catch (error) {
      console.error('Complete habit error:', error);
      throw error;
    }
  }

  async skipHabit(habitId: string): Promise<Habit> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const result = await this.fetchJSON(`/api/habits/${habitId}/skip`, { method: 'PUT' });
      return result.habit;
    } catch (error) {
      console.error('Skip habit error:', error);
      throw error;
    }
  }

  async deleteHabit(habitId: string): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      await this.fetchJSON(`/api/habits/${habitId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Delete habit error:', error);
      throw error;
    }
  }

  async getAnalytics() {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Placeholder: compute simple analytics client-side or add /api/analytics
      const habits = await this.getHabits();
      return { total: habits.length };
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }

  async updateHabitQuantity(habitId: string, currentQuantity: number): Promise<Habit> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const result = await this.fetchJSON(`/api/habits/${habitId}/quantity`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentQuantity })
      });
      return result.habit;
    } catch (error) {
      console.error('Update habit quantity error:', error);
      throw error;
    }
  }

  async incrementHabitQuantity(habitId: string, increment: number = 1): Promise<Habit> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const result = await this.fetchJSON(`/api/habits/${habitId}/increment`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment })
      });
      return result.habit;
    } catch (error) {
      console.error('Increment habit quantity error:', error);
      throw error;
    }
  }
}

export const habitService = new HabitService();
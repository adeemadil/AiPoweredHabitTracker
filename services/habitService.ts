import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
}

class HabitService {
  // Using shared Supabase client instance

  private getAuthHeaders(accessToken?: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || publicAnonKey}`
    };
  }

  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('Session error:', error);
      return null;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  async getHabits(): Promise<Habit[]> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b25eddda/habits`, {
        method: 'GET',
        headers: this.getAuthHeaders(session.access_token)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch habits');
      }

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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b25eddda/habits`, {
        method: 'POST',
        headers: this.getAuthHeaders(session.access_token),
        body: JSON.stringify(habitData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create habit');
      }

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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b25eddda/habits/${habitId}/complete`, {
        method: 'PUT',
        headers: this.getAuthHeaders(session.access_token)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete habit');
      }

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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b25eddda/habits/${habitId}/skip`, {
        method: 'PUT',
        headers: this.getAuthHeaders(session.access_token)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to skip habit');
      }

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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b25eddda/habits/${habitId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(session.access_token)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete habit');
      }
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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b25eddda/analytics`, {
        method: 'GET',
        headers: this.getAuthHeaders(session.access_token)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch analytics');
      }

      return result;
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }
}

export const habitService = new HabitService();
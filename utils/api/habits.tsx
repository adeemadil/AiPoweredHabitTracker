import { projectId, publicAnonKey } from '../supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b25eddda`;

// Get auth token from session
const getAuthToken = () => {
  return localStorage.getItem('supabase_session_token') || publicAnonKey;
};

export const habitService = {
  async getHabits() {
    try {
      const response = await fetch(`${baseUrl}/habits`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch habits');
      }

      return { habits: data, error: null };
    } catch (error) {
      console.error('Fetch habits error:', error);
      return { habits: [], error: error instanceof Error ? error.message : 'Failed to fetch habits' };
    }
  },

  async addHabit(name: string, frequency: string, emoji: string) {
    try {
      const response = await fetch(`${baseUrl}/habits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, frequency, emoji })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add habit');
      }

      return { habit: data, error: null };
    } catch (error) {
      console.error('Add habit error:', error);
      return { habit: null, error: error instanceof Error ? error.message : 'Failed to add habit' };
    }
  },

  async completeHabit(habitId: string) {
    try {
      const response = await fetch(`${baseUrl}/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete habit');
      }

      return { habit: data, error: null };
    } catch (error) {
      console.error('Complete habit error:', error);
      return { habit: null, error: error instanceof Error ? error.message : 'Failed to complete habit' };
    }
  },

  async skipHabit(habitId: string) {
    try {
      const response = await fetch(`${baseUrl}/habits/${habitId}/skip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to skip habit');
      }

      return { habit: data, error: null };
    } catch (error) {
      console.error('Skip habit error:', error);
      return { habit: null, error: error instanceof Error ? error.message : 'Failed to skip habit' };
    }
  },

  async deleteHabit(habitId: string) {
    try {
      const response = await fetch(`${baseUrl}/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete habit');
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Delete habit error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete habit' };
    }
  },

  async getInsights() {
    try {
      const response = await fetch(`${baseUrl}/insights`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch insights');
      }

      return { insights: data, error: null };
    } catch (error) {
      console.error('Fetch insights error:', error);
      return { insights: null, error: error instanceof Error ? error.message : 'Failed to fetch insights' };
    }
  }
};
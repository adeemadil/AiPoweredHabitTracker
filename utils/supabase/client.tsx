import { createClient } from '@supabase/supabase-js';

// Read from environment (set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a singleton Supabase client instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    // Use noop storage on the server to avoid window access during SSR
    const isBrowser = typeof window !== 'undefined';
    const storage: Storage | undefined = isBrowser ? window.localStorage : undefined;

    supabaseInstance = createClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true,
        storage,
        autoRefreshToken: true,
        detectSessionInUrl: isBrowser,
      },
    });
  }
  return supabaseInstance;
})();

// Auth helpers
export const authService = {
  async signUp(email: string, password: string, name: string) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-b25eddda/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return { session: data.session, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { session: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error: error instanceof Error ? error.message : 'Failed to get session' };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: error instanceof Error ? error.message : 'Failed to get user' };
    }
  }
};
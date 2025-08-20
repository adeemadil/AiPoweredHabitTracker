'use client'

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { HabitCard } from './HabitCard';
import { AddHabitModal } from './AddHabitModal';
import { AIInsightsWidget } from './AIInsightsWidget';
import { NotificationPreferences } from './NotificationPreferences';
import { SocialSharing } from './SocialSharing';
import { DataManagement } from './DataManagement';
import { Onboarding } from './Onboarding';
import { AuthScreen } from './AuthScreen';
import { SyncStatus } from './SyncStatus';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, LogOut, Loader2, Bell, Share2, Database, Download, Upload, Search, Filter, Users, UserPlus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { habitService, type Habit } from '../services/habitService';

export default function App() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'streak' | 'date' | 'completion'>('streak');

  // Check for existing session on app load
  useEffect(() => {
    if (authLoaded) {
      checkSession();
    }
  }, [authLoaded]);

  // Load habits when authentication state changes
  useEffect(() => {
    if (isSignedIn && user) {
      loadHabits();
      loadAnalytics();
    } else {
      setHabits([]);
      setAnalytics(null);
    }
  }, [isSignedIn, user]);

  // Dark mode handling
  useEffect(() => {
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : systemTheme;
    
    setIsDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Check for existing session
  const checkSession = async () => {
    try {
      if (isSignedIn && user) {
        setShowOnboarding(false);
      } else {
        // Check if user has seen onboarding before
        const hasSeenOnboarding = localStorage.getItem('habitual-onboarding-completed');
        setShowOnboarding(!hasSeenOnboarding);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load habits from backend
  const loadHabits = async () => {
    try {
      const userHabits = await habitService.getHabits();
      setHabits(userHabits);
    } catch (error) {
      console.error('Load habits error:', error);
      setError('Failed to load habits. Please try refreshing the page.');
    }
  };

  // Load analytics from backend
  const loadAnalytics = async () => {
    try {
      const analyticsData = await habitService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Load analytics error:', error);
    }
  };

  // Handle authentication success
  const handleAuthSuccess = () => {
    setError('');
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      // Clerk handles sign out via UI
      setHabits([]);
      setAnalytics(null);
      // Don't show onboarding again if user has already seen it
      const hasSeenOnboarding = localStorage.getItem('habitual-onboarding-completed');
      setShowOnboarding(!hasSeenOnboarding);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Filter and sort habits
  const getFilteredAndSortedHabits = () => {
    let filtered = habits.filter(habit => {
      // Apply search filter
      if (searchQuery && !habit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Apply status filter
      switch (activeFilter) {
        case 'completed':
          return habit.completedToday;
        case 'missed':
          return !habit.completedToday && habit.frequency === 'daily';
        case 'favorites':
          return habit.isFavorite; // Assuming we add a favorites feature
        default:
          return true;
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'streak':
          return b.currentStreak - a.currentStreak;
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'completion':
          return (b.completionRate || 0) - (a.completionRate || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Calculate habit stats
  const habitStats = {
    total: habits.length,
    completed: habits.filter(h => h.completedToday).length,
    missed: habits.filter(h => !h.completedToday && h.frequency === 'daily').length,
    streaks: habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0)
  };

  // Handle habit completion
  const handleCompleteHabit = async (habitId: string) => {
    try {
      const updatedHabit = await habitService.completeHabit(habitId);
      setHabits(prev => prev.map(habit => 
        habit.id === habitId ? updatedHabit : habit
      ));
      // Reload analytics to reflect new completion
      loadAnalytics();
    } catch (error) {
      console.error('Complete habit error:', error);
      setError('Failed to complete habit. Please try again.');
    }
  };

  // Handle habit skip
  const handleSkipHabit = async (habitId: string) => {
    try {
      const updatedHabit = await habitService.skipHabit(habitId);
      setHabits(prev => prev.map(habit => 
        habit.id === habitId ? updatedHabit : habit
      ));
    } catch (error) {
      console.error('Skip habit error:', error);
      setError('Failed to skip habit. Please try again.');
    }
  };

  // Handle adding new habit
  const handleAddHabit = async (newHabit: { name: string; frequency: string; emoji: string; notes?: string }) => {
    try {
      const createdHabit = await habitService.createHabit(newHabit);
      setHabits(prev => [...prev, createdHabit]);
    } catch (error) {
      console.error('Add habit error:', error);
      setError('Failed to add habit. Please try again.');
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('habitual-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  // Handle back from auth to onboarding
  const handleBackToOnboarding = () => {
    setShowOnboarding(true);
  };

  // Handle habits updated from data management
  const handleHabitsUpdated = () => {
    loadHabits();
    loadAnalytics();
  };

  // Calculate notification count (mock for now)
  const getNotificationCount = () => {
    const notificationSettings = JSON.parse(localStorage.getItem('notification-settings') || '{}');
    return Object.values(notificationSettings).filter((setting: any) => setting?.enabled).length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="font-medium">Loading Habitual...</p>
              <p className="text-sm text-muted-foreground">Syncing your habits securely</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show onboarding first
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show auth screen if not signed in
  if (!isSignedIn) {
    return (
      <AuthScreen
        onSuccess={handleAuthSuccess}
        onBack={handleBackToOnboarding}
      />
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto">
            <NotificationPreferences habits={habits} />
          </div>
        );

      case 'social':
        return (
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="friends" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="friends">Friends</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="cheers">Cheers</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>

              <TabsContent value="friends" className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Your Friends</h3>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No friends added yet</p>
                    <p className="text-sm">Invite friends to stay motivated together!</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Friend Requests</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="cheers" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Recent Cheers</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No cheers yet</p>
                    <p className="text-sm">Friends can cheer you on when you complete habits!</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Leaderboard</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Add friends to see the leaderboard</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'insights':
        return (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1>AI Insights & Analytics</h1>
                <p className="text-muted-foreground">
                  Understand your habit patterns and get personalized suggestions
                </p>
              </div>
              <SyncStatus showText />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIInsightsWidget analytics={analytics} className="h-fit" />
              </div>
              
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Habits</span>
                      <Badge variant="secondary">{habitStats.total}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed Today</span>
                      <Badge className="bg-green-100 text-green-700">{habitStats.completed}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Streaks</span>
                      <Badge className="bg-orange-100 text-orange-700">{habitStats.streaks}</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        const filteredHabits = getFilteredAndSortedHabits();
        
        return (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header with Search and Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1>Your Habits</h1>
                    <p className="text-muted-foreground">
                      {habitStats.completed}/{habitStats.total} completed today • {habitStats.streaks} total streak days
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Habit
                  </Button>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search habits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'streak' | 'date' | 'completion')}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    >
                      <option value="streak">Sort by Streak</option>
                      <option value="date">Sort by Date</option>
                      <option value="completion">Sort by Completion</option>
                    </select>
                  </div>
                </div>

                {/* Filter Tabs */}
                <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">
                      All ({habits.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({habitStats.completed})
                    </TabsTrigger>
                    <TabsTrigger value="missed">
                      Missed ({habitStats.missed})
                    </TabsTrigger>
                    <TabsTrigger value="favorites">
                      Favorites
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Habits Grid */}
              <AnimatePresence>
                {filteredHabits.length > 0 ? (
                  <motion.div 
                    className="grid gap-4 md:grid-cols-2"
                    layout
                  >
                    {filteredHabits.map(habit => (
                      <motion.div
                        key={habit.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HabitCard
                          habit={habit}
                          onComplete={handleCompleteHabit}
                          onSkip={handleSkipHabit}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3>
                      {searchQuery 
                        ? `No habits match "${searchQuery}"` 
                        : activeFilter === 'all' 
                          ? "No habits found"
                          : `No ${activeFilter} habits to show`
                      }
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery 
                        ? "Try adjusting your search terms"
                        : activeFilter === 'all' 
                          ? "Start building your habits today!"
                          : "Try a different filter or add some habits"
                      }
                    </p>
                    {(activeFilter === 'all' || !searchQuery) && (
                      <Button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {habits.length === 0 ? 'Add Your First Habit' : 'Add Another Habit'}
                      </Button>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-6">
              <AIInsightsWidget analytics={analytics} />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2>Settings</h2>
              <SyncStatus showText />
            </div>
            
            <Card className="p-6">
              <h3 className="mb-4">Account</h3>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</p>
                </div>
                <div>
                  <Label>Name</Label>
                  <p className="text-muted-foreground">
                    {user?.fullName || 'Not set'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                  />
                </div>
              </div>
            </Card>

                         {/* Data Management Section */}
             <DataManagement habits={habits} onHabitsUpdated={handleHabitsUpdated} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSignOut={handleSignOut}
                      user={user}
        notificationCount={getNotificationCount()}
      />

      <div className="flex">
        {/* Sidebar - Only show on dashboard */}
        {currentView === 'dashboard' && (
          <div className="hidden lg:block">
            <Sidebar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              habitStats={habitStats}
            />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 sm:p-6 ${currentView === 'dashboard' ? 'lg:ml-0' : 'max-w-full'} pb-20 md:pb-6`}>
          <div className={currentView === 'dashboard' ? 'max-w-7xl mx-auto' : ''}>
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {error}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setError('')}
                    className="ml-2"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddHabit}
      />

      {/* Mobile Bottom Padding for Navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
}

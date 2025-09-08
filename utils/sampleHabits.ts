import { Habit } from '../services/habitService';

export const sampleQuantifiableHabits: Partial<Habit>[] = [
  {
    id: 'sample-water',
    name: 'Drink 8 Glasses of Water',
    emoji: '💧',
    frequency: 'daily',
    targetQuantity: 8,
    currentQuantity: 3, // Start with some progress
    unit: 'glasses',
    isQuantifiable: true,
    completedToday: false,
    currentStreak: 2,
    bestStreak: 5,
    completionRate: 75,
    progress: 37.5, // 3/8 = 37.5%
    streak: 2,
    isFavorite: false,
    completed: false,
    createdAt: new Date().toISOString(),
    userId: 'sample-user'
  },
  {
    id: 'sample-reading',
    name: 'Read 30 Pages',
    emoji: '📚',
    frequency: 'daily',
    targetQuantity: 30,
    currentQuantity: 0,
    unit: 'pages',
    isQuantifiable: true,
    completedToday: false,
    currentStreak: 0,
    bestStreak: 0,
    completionRate: 0,
    progress: 0,
    streak: 0,
    isFavorite: false,
    completed: false,
    createdAt: new Date().toISOString(),
    userId: 'sample-user'
  },
  {
    id: 'sample-pushups',
    name: 'Do 50 Push-ups',
    emoji: '💪',
    frequency: 'daily',
    targetQuantity: 50,
    currentQuantity: 25, // Halfway there
    unit: 'push-ups',
    isQuantifiable: true,
    completedToday: false,
    currentStreak: 1,
    bestStreak: 3,
    completionRate: 60,
    progress: 50, // 25/50 = 50%
    streak: 1,
    isFavorite: false,
    completed: false,
    createdAt: new Date().toISOString(),
    userId: 'sample-user'
  },
  {
    id: 'sample-steps',
    name: 'Walk 10,000 Steps',
    emoji: '🚶',
    frequency: 'daily',
    targetQuantity: 10000,
    currentQuantity: 7500, // Almost there
    unit: 'steps',
    isQuantifiable: true,
    completedToday: false,
    currentStreak: 4,
    bestStreak: 7,
    completionRate: 85,
    progress: 75, // 7500/10000 = 75%
    streak: 4,
    isFavorite: false,
    completed: false,
    createdAt: new Date().toISOString(),
    userId: 'sample-user'
  },
  {
    id: 'sample-meditation',
    name: 'Meditate for 20 Minutes',
    emoji: '🧘',
    frequency: 'daily',
    targetQuantity: 20,
    currentQuantity: 20, // Completed!
    unit: 'minutes',
    isQuantifiable: true,
    completedToday: true,
    currentStreak: 3,
    bestStreak: 10,
    completionRate: 90,
    progress: 100, // 20/20 = 100%
    streak: 3,
    isFavorite: true,
    completed: true,
    createdAt: new Date().toISOString(),
    userId: 'sample-user'
  }
];

export interface Habit {
  id: string;
  name: string;
  emoji?: string | null;
  streak: number;
  lastCompleted?: Date | null;
  userId: string;
  frequency?: string;
  backgroundSvgUrl?: string; // URL for SVG background image
} 
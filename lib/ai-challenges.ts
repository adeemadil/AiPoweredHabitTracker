import OpenAI from 'openai';
import { Habit } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChallengeSuggestion {
  title: string;
  description: string;
  type: 'STREAK_BASED' | 'FREQUENCY_BASED' | 'TIME_BASED' | 'SOCIAL_BASED' | 'MIXED';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  duration: number; // days
  aiPrompt: string;
}

export interface UserHabitProfile {
  habits: Habit[];
  totalHabits: number;
  dailyHabits: number;
  weeklyHabits: number;
  monthlyHabits: number;
  averageStreak: number;
  mostSuccessfulHabit?: Habit;
  strugglingHabit?: Habit;
}

export class AIChallengeService {
  static async generatePersonalizedChallenges(
    userHabits: Habit[],
    count: number = 3
  ): Promise<ChallengeSuggestion[]> {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not found, using fallback challenges');
        return this.getFallbackChallenges(userHabits, count);
      }

      const habitProfile = this.analyzeUserHabits(userHabits);
      
      const prompt = this.buildChallengePrompt(habitProfile, count);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert habit coach and challenge designer. Create personalized, engaging challenges that help users build better habits and stay motivated. 
            
            Always respond with valid JSON in this exact format:
            {
              "challenges": [
                {
                  "title": "Challenge title (max 50 chars)",
                  "description": "Detailed description explaining the challenge and its benefits (max 200 chars)",
                  "type": "STREAK_BASED|FREQUENCY_BASED|TIME_BASED|SOCIAL_BASED|MIXED",
                  "difficulty": "EASY|MEDIUM|HARD|EXPERT",
                  "duration": number_of_days,
                  "aiPrompt": "The original prompt used to generate this challenge"
                }
              ]
            }
            
            Guidelines:
            - Make challenges specific to the user's current habits
            - Vary difficulty levels and durations
            - Focus on building sustainable habits
            - Include social elements when appropriate
            - Keep titles catchy and descriptions motivating
            - Duration should be 7-30 days for most challenges
            - Consider the user's current habit patterns and success rates`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(response);
      return parsed.challenges || [];
    } catch (error) {
      console.error('Error generating AI challenges:', error);
      return this.getFallbackChallenges(userHabits, count);
    }
  }

  private static analyzeUserHabits(habits: Habit[]): UserHabitProfile {
    const totalHabits = habits.length;
    const dailyHabits = habits.filter(h => h.frequency === 'daily').length;
    const weeklyHabits = habits.filter(h => h.frequency === 'weekly').length;
    const monthlyHabits = habits.filter(h => h.frequency === 'monthly').length;
    
    // Calculate average streak (this would need to be enhanced with actual completion data)
    const averageStreak = habits.length > 0 ? Math.floor(Math.random() * 5) + 1 : 0;
    
    // Find most successful and struggling habits (placeholder logic)
    const mostSuccessfulHabit = habits.length > 0 ? habits[0] : undefined;
    const strugglingHabit = habits.length > 1 ? habits[1] : undefined;

    return {
      habits,
      totalHabits,
      dailyHabits,
      weeklyHabits,
      monthlyHabits,
      averageStreak,
      mostSuccessfulHabit,
      strugglingHabit,
    };
  }

  private static buildChallengePrompt(profile: UserHabitProfile, count: number): string {
    const habitNames = profile.habits.map(h => `${h.name} (${h.frequency})`).join(', ');
    
    return `Generate ${count} personalized habit challenges for a user with the following profile:

User's Current Habits: ${habitNames || 'No habits yet'}
Total Habits: ${profile.totalHabits}
Daily Habits: ${profile.dailyHabits}
Weekly Habits: ${profile.weeklyHabits}
Monthly Habits: ${profile.monthlyHabits}
Average Streak: ${profile.averageStreak} days

Most Successful Habit: ${profile.mostSuccessfulHabit?.name || 'None'}
Struggling Habit: ${profile.strugglingHabit?.name || 'None'}

Create challenges that:
1. Build upon their existing habits
2. Help them improve areas where they're struggling
3. Introduce new healthy habits gradually
4. Include social elements to increase motivation
5. Vary in difficulty and duration
6. Are specific and actionable

Focus on creating challenges that feel achievable but challenging, and that will help them build lasting habits.`;
  }

  private static getFallbackChallenges(habits: Habit[], count: number): ChallengeSuggestion[] {
    const habitNames = habits.map(h => h.name).join(', ');
    const dailyHabits = habits.filter(h => h.frequency === 'daily').length;
    const weeklyHabits = habits.filter(h => h.frequency === 'weekly').length;
    
    const fallbackChallenges: ChallengeSuggestion[] = [
      {
        title: "7-Day Habit Streak Challenge",
        description: `Complete all your daily habits for 7 consecutive days. Build momentum and consistency!`,
        type: "STREAK_BASED",
        difficulty: "EASY",
        duration: 7,
        aiPrompt: "Fallback challenge for building consistency"
      },
      {
        title: "Social Motivation Boost",
        description: "Send cheers to 3 friends this week and encourage their habit progress. Spread positivity!",
        type: "SOCIAL_BASED",
        difficulty: "EASY",
        duration: 7,
        aiPrompt: "Fallback challenge for social engagement"
      },
      {
        title: "Habit Variety Challenge",
        description: `Try adding one new healthy habit to your routine and maintain it for 14 days.`,
        type: "MIXED",
        difficulty: "MEDIUM",
        duration: 14,
        aiPrompt: "Fallback challenge for habit expansion"
      },
      {
        title: "Weekly Habit Mastery",
        description: `Focus on your ${weeklyHabits} weekly habit${weeklyHabits > 1 ? 's' : ''} and complete them consistently for 21 days.`,
        type: "FREQUENCY_BASED",
        difficulty: "MEDIUM",
        duration: 21,
        aiPrompt: "Fallback challenge for weekly habit focus"
      },
      {
        title: "Daily Habit Excellence",
        description: `Perfect your daily routine by completing all daily habits for 30 consecutive days.`,
        type: "STREAK_BASED",
        difficulty: "HARD",
        duration: 30,
        aiPrompt: "Fallback challenge for daily habit excellence"
      }
    ];

    // Personalize based on user's habits
    if (habits.length > 0) {
      const firstHabit = habits[0];
      fallbackChallenges[0].description = `Complete your "${firstHabit.name}" habit for 7 consecutive days. Build momentum and consistency!`;
      
      if (dailyHabits > 0) {
        fallbackChallenges[2].description = `Add one new daily habit to your routine and maintain it for 14 days alongside your existing ${dailyHabits} daily habit${dailyHabits > 1 ? 's' : ''}.`;
      }
      
      if (weeklyHabits > 0) {
        fallbackChallenges[3].description = `Focus on your ${weeklyHabits} weekly habit${weeklyHabits > 1 ? 's' : ''} and complete them consistently for 21 days.`;
      }
    }

    return fallbackChallenges.slice(0, count);
  }

  static async generateChallengeInsights(challengeId: string, participantData: any): Promise<string> {
    try {
      const prompt = `Analyze this challenge participation data and provide personalized insights and encouragement:

Challenge Data: ${JSON.stringify(participantData, null, 2)}

Provide 2-3 specific insights about their progress, 1-2 actionable tips for improvement, and an encouraging message. Keep it concise and motivating.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a supportive habit coach providing personalized insights and encouragement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content || "Keep up the great work on your challenge!";
    } catch (error) {
      console.error('Error generating challenge insights:', error);
      return "You're doing great! Keep pushing forward with your challenge goals.";
    }
  }
}

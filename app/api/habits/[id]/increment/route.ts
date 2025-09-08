import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  
  const habitId = params.id;
  const { increment = 1 } = await req.json();

  try {
    // First get the current habit to calculate new quantity
    const currentHabit = await prisma.habit.findUnique({
      where: { 
        id: habitId,
        userId
      }
    });

    if (!currentHabit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    const newQuantity = Math.max(0, (currentHabit.currentQuantity || 0) + increment);

    const habit = await prisma.habit.update({
      where: { 
        id: habitId,
        userId
      },
      data: { 
        currentQuantity: newQuantity
      },
      include: {
        completions: true
      }
    });

    // Calculate computed fields
    const today = new Date();
    const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const completedToday = habit.completions.some(completion => 
      completion.date >= todayStart && completion.date < todayEnd
    );

    // Calculate current streak
    const sortedCompletions = habit.completions
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let currentStreak = 0;
    let checkDate = todayStart;
    
    for (const completion of sortedCompletions) {
      const completionDate = new Date(Date.UTC(
        completion.date.getUTCFullYear(), 
        completion.date.getUTCMonth(), 
        completion.date.getUTCDate()
      ));
      
      if (completionDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    // Check if target is reached for quantifiable habits
    const isCompleted = habit.isQuantifiable && habit.targetQuantity 
      ? habit.currentQuantity >= habit.targetQuantity 
      : completedToday;

    const habitWithComputedFields = {
      ...habit,
      completedToday: isCompleted,
      currentStreak,
      bestStreak: currentStreak,
      completionRate: habit.completions.length > 0 ? (habit.completions.length / 30) * 100 : 0,
      progress: habit.isQuantifiable && habit.targetQuantity 
        ? Math.min(100, (habit.currentQuantity / habit.targetQuantity) * 100)
        : (isCompleted ? 100 : 0),
      streak: currentStreak,
      isFavorite: false,
      completed: isCompleted
    };

    return NextResponse.json({ habit: habitWithComputedFields });
  } catch (error) {
    console.error('Increment habit quantity error:', error);
    return NextResponse.json({ error: 'Failed to increment habit quantity' }, { status: 500 });
  }
}

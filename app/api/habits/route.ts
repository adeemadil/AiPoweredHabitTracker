import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  
  const habits = await prisma.habit.findMany({ 
    where: { userId },
    include: {
      completions: true
    }
  })

  // Calculate completedToday and other fields for each habit
  const today = new Date()
  const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  const habitsWithComputedFields = habits.map(habit => {
    const completedToday = habit.completions.some(completion => 
      completion.date >= todayStart && completion.date < todayEnd
    )

    // Calculate current streak (simplified)
    const sortedCompletions = habit.completions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    
    let currentStreak = 0
    let checkDate = todayStart
    
    for (const completion of sortedCompletions) {
      const completionDate = new Date(Date.UTC(
        completion.date.getUTCFullYear(), 
        completion.date.getUTCMonth(), 
        completion.date.getUTCDate()
      ))
      
      if (completionDate.getTime() === checkDate.getTime()) {
        currentStreak++
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000) // Previous day
      } else {
        break
      }
    }

    // Check if target is reached for quantifiable habits
    const isCompleted = habit.isQuantifiable && habit.targetQuantity 
      ? (habit.currentQuantity || 0) >= habit.targetQuantity 
      : completedToday;

    return {
      ...habit,
      completedToday: isCompleted,
      currentStreak,
      bestStreak: currentStreak, // Use currentStreak as bestStreak for now
      completionRate: habit.completions.length > 0 ? (habit.completions.length / 30) * 100 : 0, // Simplified
      progress: habit.isQuantifiable && habit.targetQuantity 
        ? Math.min(100, ((habit.currentQuantity || 0) / habit.targetQuantity) * 100)
        : (isCompleted ? 100 : 0),
      streak: currentStreak, // Legacy support
      isFavorite: false, // Default value
      completed: isCompleted
    }
  })

  return NextResponse.json({ habits: habitsWithComputedFields })
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const body = await req.json()
  const habit = await prisma.habit.create({ 
    data: { 
      name: body.name, 
      emoji: body.emoji ?? '✨', 
      frequency: body.frequency, 
      userId 
    },
    include: {
      completions: true
    }
  })
  
  // Add computed fields for new habit
  const habitWithComputedFields = {
    ...habit,
    completedToday: false,
    currentStreak: 0,
    bestStreak: 0,
    completionRate: 0,
    progress: 0,
    streak: 0,
    isFavorite: false,
    completed: false
  }
  
  return NextResponse.json({ habit: habitWithComputedFields })
}



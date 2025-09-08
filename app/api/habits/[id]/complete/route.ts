import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const habitId = params.id
  
  // Mark completion today
  const today = new Date()
  const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  
  await prisma.habitCompletion.upsert({
    where: { habitId_date: { habitId, date } },
    update: {},
    create: { habitId, date },
  })
  
  // Get the habit with completions to calculate computed fields
  const habit = await prisma.habit.findUnique({ 
    where: { id: habitId },
    include: {
      completions: true
    }
  })
  
  if (!habit) {
    return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
  }
  
  // Calculate computed fields
  const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
  
  const completedToday = habit.completions.some(completion => 
    completion.date >= todayStart && completion.date < todayEnd
  )
  
  // Calculate current streak
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
  
  const habitWithComputedFields = {
    ...habit,
    completedToday,
    currentStreak,
    bestStreak: currentStreak,
    completionRate: habit.completions.length > 0 ? (habit.completions.length / 30) * 100 : 0,
    progress: completedToday ? 100 : 0,
    streak: currentStreak,
    isFavorite: false,
    completed: completedToday
  }
  
  return NextResponse.json({ habit: habitWithComputedFields })
}



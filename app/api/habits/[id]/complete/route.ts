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
  const habit = await prisma.habit.findUnique({ where: { id: habitId } })
  return NextResponse.json({ habit })
}



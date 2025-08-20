import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const habitId = params.id
  // For skip, we simply avoid adding a completion; could log a skipped record if desired
  const habit = await prisma.habit.findUnique({ where: { id: habitId } })
  return NextResponse.json({ habit })
}



import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const habits = await prisma.habit.findMany({ where: { userId } })
  return NextResponse.json({ habits })
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const body = await req.json()
  const habit = await prisma.habit.create({ data: { name: body.name, emoji: body.emoji ?? '✨', frequency: body.frequency, userId } })
  return NextResponse.json({ habit })
}



import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId, sessionId } = auth()
  if (!userId) return NextResponse.json({ session: null })
  return NextResponse.json({ session: { userId, sessionId } })
}



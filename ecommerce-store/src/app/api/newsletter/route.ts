import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Check if email already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }

    // Create new subscriber
    await prisma.emailSubscriber.create({
      data: { email },
    })

    return NextResponse.json({ message: 'Successfully subscribed' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
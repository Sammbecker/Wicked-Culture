import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
    })

    const count = cartItems.reduce((total, item) => total + item.quantity, 0)

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}
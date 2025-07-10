import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quantity } = await request.json()

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 })
    }

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: { product: true },
    })

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      return NextResponse.json({ error: 'Not enough stock' }, { status: 400 })
    }

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: { product: true },
    })

    return NextResponse.json(updatedCartItem)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
    })

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Cart item removed' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
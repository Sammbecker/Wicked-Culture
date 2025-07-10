import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cartItems, discountCode, discountAmount } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate total
    let total = 0
    for (const item of cartItems) {
      total += item.price * item.quantity
    }

    // Apply discount
    if (discountAmount) {
      total = Math.max(0, total - discountAmount)
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        discountCode: discountCode || null,
        discountAmount: discountAmount || 0,
        status: 'PENDING',
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update product stock
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    // Update discount code usage if applicable
    if (discountCode) {
      await prisma.discountCode.update({
        where: { code: discountCode.toUpperCase() },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      })
    }

    // In a real application, you would integrate with Stripe here
    // For demo purposes, we'll simulate a successful payment
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROCESSING' },
    })

    // Return success with order details
    return NextResponse.json({
      success: true,
      orderId: order.id,
      total,
      message: 'Order placed successfully!',
      // In real app: url: stripeSession.url
      url: `/orders/${order.id}`, // Redirect to order confirmation
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
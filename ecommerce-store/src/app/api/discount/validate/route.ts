import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json()

    if (!code || orderTotal == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!discountCode) {
      return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 })
    }

    // Check if discount is active
    if (!discountCode.active) {
      return NextResponse.json({ error: 'Discount code is inactive' }, { status: 400 })
    }

    // Check if discount is expired
    if (discountCode.expiresAt && discountCode.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Discount code has expired' }, { status: 400 })
    }

    // Check usage limit
    if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
      return NextResponse.json({ error: 'Discount code usage limit reached' }, { status: 400 })
    }

    // Check minimum amount
    if (discountCode.minimumAmount && orderTotal < discountCode.minimumAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of $${discountCode.minimumAmount.toFixed(2)} required` 
      }, { status: 400 })
    }

    // Calculate discount amount
    let discountAmount = 0
    if (discountCode.discountType === 'PERCENTAGE') {
      discountAmount = orderTotal * (discountCode.discountValue / 100)
    } else if (discountCode.discountType === 'FIXED_AMOUNT') {
      discountAmount = discountCode.discountValue
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal)

    return NextResponse.json({
      valid: true,
      discountAmount,
      discountType: discountCode.discountType,
      discountValue: discountCode.discountValue,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
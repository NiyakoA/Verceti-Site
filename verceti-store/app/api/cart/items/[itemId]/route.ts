import { NextRequest, NextResponse } from 'next/server'
import { cartService } from '@/lib/services/cart'
import { cookies } from 'next/headers'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { quantity } = body

    const cart = await cartService.updateItemQuantity(sessionId, params.itemId, quantity)
    const totals = await cartService.calculateTotals(sessionId)

    return NextResponse.json({ cart, totals })
  } catch (error: any) {
    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 400 }
      )
    }

    const cart = await cartService.removeItem(sessionId, params.itemId)
    const totals = await cartService.calculateTotals(sessionId)

    return NextResponse.json({ cart, totals })
  } catch (error: any) {
    console.error('Remove cart item error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}

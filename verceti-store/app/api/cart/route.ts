import { NextRequest, NextResponse } from 'next/server'
import { cartService } from '@/lib/services/cart'
import { cookies } from 'next/headers'

function getSessionId(req: NextRequest): string {
  const cookieStore = cookies()
  let sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  return sessionId
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = getSessionId(req)
    const cart = await cartService.getOrCreateCart(sessionId)
    const totals = await cartService.calculateTotals(sessionId)

    const response = NextResponse.json({ cart, totals })
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = getSessionId(req)
    const body = await req.json()
    const { variantId, quantity } = body

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: 'Variant ID and quantity are required' },
        { status: 400 }
      )
    }

    const cart = await cartService.addItem(sessionId, variantId, quantity)
    const totals = await cartService.calculateTotals(sessionId)

    const response = NextResponse.json({ cart, totals })
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

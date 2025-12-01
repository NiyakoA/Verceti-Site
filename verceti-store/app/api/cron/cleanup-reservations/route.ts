import { NextRequest, NextResponse } from 'next/server'
import { inventoryService } from '@/lib/services/inventory'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const count = await inventoryService.cleanupExpiredReservations()

    return NextResponse.json({
      success: true,
      cleaned: count,
    })
  } catch (error: any) {
    console.error('Cleanup reservations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cleanup reservations' },
      { status: 500 }
    )
  }
}

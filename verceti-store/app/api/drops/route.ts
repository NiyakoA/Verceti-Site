import { NextRequest, NextResponse } from 'next/server'
import { dropService } from '@/lib/services/drop'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const type = searchParams.get('type')

    let drops

    if (type === 'upcoming') {
      drops = await dropService.getUpcomingDrops()
    } else if (type === 'live') {
      drops = await dropService.getLiveDrops()
    } else {
      drops = await dropService.getAllDrops(status)
    }

    return NextResponse.json(drops)
  } catch (error: any) {
    console.error('Get drops error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch drops' },
      { status: 500 }
    )
  }
}

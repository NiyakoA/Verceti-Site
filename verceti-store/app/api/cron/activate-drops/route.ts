import { NextRequest, NextResponse } from 'next/server'
import { dropService } from '@/lib/services/drop'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await dropService.activateDrops()
    await dropService.checkAndUpdateSoldOut()

    return NextResponse.json({
      success: true,
      activated: result.activated,
      earlyAccess: result.earlyAccess,
    })
  } catch (error: any) {
    console.error('Activate drops error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to activate drops' },
      { status: 500 }
    )
  }
}

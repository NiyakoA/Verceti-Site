import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/services/product'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const tags = searchParams.get('tags')?.split(',') || undefined

    const products = await productService.getAllProducts({
      category,
      search,
      tags,
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

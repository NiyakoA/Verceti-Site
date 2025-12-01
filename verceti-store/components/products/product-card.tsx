import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: any
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]
  const minPrice = Math.min(
    ...product.variants.map((v: any) =>
      parseFloat(product.basePrice) + parseFloat(v.priceAdjustment)
    )
  )

  const totalInventory = product.variants.reduce(
    (sum: number, v: any) => sum + v.inventory,
    0
  )

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-square relative bg-gray-100 mb-3 overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {totalInventory === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">SOLD OUT</span>
          </div>
        )}
        {product.drop && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-semibold">
            DROP
          </div>
        )}
      </div>
      <h3 className="font-semibold mb-1 group-hover:underline">{product.name}</h3>
      <p className="text-sm text-gray-600">{formatPrice(minPrice)}</p>
    </Link>
  )
}

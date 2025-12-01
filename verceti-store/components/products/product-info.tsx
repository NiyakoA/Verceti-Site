'use client'

import { useState } from 'react'
import { formatPrice, getStockStatus } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface ProductInfoProps {
  product: any
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const price =
    parseFloat(product.basePrice) + parseFloat(selectedVariant.priceAdjustment)
  const stockStatus = getStockStatus(
    selectedVariant.inventory,
    selectedVariant.lowStockThreshold
  )

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to add to cart')
        return
      }

      router.push('/cart')
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  // Group variants by size and color
  const sizes = [...new Set(product.variants.map((v: any) => v.size))]
  const colors = [...new Set(product.variants.map((v: any) => v.color))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold">{formatPrice(price)}</p>
      </div>

      <p className="text-gray-600">{product.description}</p>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2">Size</label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const variant = product.variants.find(
              (v: any) => v.size === size && v.color === selectedVariant.color
            )
            const isAvailable = variant && variant.inventory > 0
            const isSelected = selectedVariant.size === size

            return (
              <button
                key={size}
                onClick={() => variant && setSelectedVariant(variant)}
                disabled={!isAvailable}
                className={`px-4 py-2 border ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : isAvailable
                    ? 'border-gray-300 hover:border-black'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Selection */}
      {colors.length > 1 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = product.variants.find(
                (v: any) => v.color === color && v.size === selectedVariant.size
              )
              const isAvailable = variant && variant.inventory > 0
              const isSelected = selectedVariant.color === color

              return (
                <button
                  key={color}
                  onClick={() => variant && setSelectedVariant(variant)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 border ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : isAvailable
                      ? 'border-gray-300 hover:border-black'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div>
        {stockStatus === 'out_of_stock' && (
          <p className="text-red-600 font-semibold">Out of Stock</p>
        )}
        {stockStatus === 'low_stock' && (
          <p className="text-orange-600 font-semibold">
            Only {selectedVariant.inventory} left!
          </p>
        )}
        {stockStatus === 'in_stock' && (
          <p className="text-green-600 font-semibold">In Stock</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold mb-2">Quantity</label>
        <input
          type="number"
          min="1"
          max={selectedVariant.inventory}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-20 px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={stockStatus === 'out_of_stock' || loading}
        className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {/* Product Details */}
      <div className="border-t pt-6 space-y-2 text-sm">
        <p>
          <span className="font-semibold">SKU:</span> {selectedVariant.sku}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {product.category}
        </p>
        {product.tags.length > 0 && (
          <p>
            <span className="font-semibold">Tags:</span> {product.tags.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}

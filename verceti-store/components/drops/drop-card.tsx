'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface DropCardProps {
  drop: any
}

export function DropCard({ drop }: DropCardProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  })

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const launchDate = new Date(drop.launchDate)
      const diff = launchDate.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds, isLive: false })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [drop.launchDate])

  const image = drop.product.images[0]
  const minPrice = Math.min(
    ...drop.product.variants.map((v: any) =>
      parseFloat(drop.product.basePrice) + parseFloat(v.priceAdjustment)
    )
  )

  return (
    <Link href={`/products/${drop.product.slug}`} className="group">
      <div className="aspect-square relative bg-gray-100 mb-4 overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={drop.product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {drop.status === 'live' && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 font-semibold">
            LIVE NOW
          </div>
        )}

        {drop.status === 'sold_out' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">SOLD OUT</span>
          </div>
        )}
      </div>

      <h3 className="font-bold text-lg mb-2 group-hover:underline">
        {drop.product.name}
      </h3>
      <p className="text-gray-600 mb-3">{formatPrice(minPrice)}</p>

      {drop.status === 'scheduled' && !countdown.isLive && (
        <div className="bg-black text-white p-4 text-center">
          <p className="text-sm mb-2">Drops in</p>
          <div className="flex justify-center gap-4">
            {countdown.days > 0 && (
              <div>
                <div className="text-2xl font-bold">{countdown.days}</div>
                <div className="text-xs">DAYS</div>
              </div>
            )}
            <div>
              <div className="text-2xl font-bold">{countdown.hours}</div>
              <div className="text-xs">HRS</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{countdown.minutes}</div>
              <div className="text-xs">MIN</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{countdown.seconds}</div>
              <div className="text-xs">SEC</div>
            </div>
          </div>
        </div>
      )}

      {drop.status === 'live' && (
        <div className="bg-green-500 text-white p-4 text-center font-semibold">
          SHOP NOW
        </div>
      )}
    </Link>
  )
}

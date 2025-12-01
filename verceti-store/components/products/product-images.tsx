'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImagesProps {
  images: Array<{ id: string; url: string; altText: string }>
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].altText || productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative bg-gray-100 overflow-hidden border-2 ${
                selectedImage === index ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || productName}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

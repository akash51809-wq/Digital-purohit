'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CategoryImagesProps {
  category: string
  className?: string
  imageClassName?: string
  limit?: number
}

export default function CategoryImages({ 
  category, 
  className = "grid grid-cols-2 md:grid-cols-3 gap-4", 
  imageClassName = "aspect-square rounded-lg overflow-hidden",
  limit 
}: CategoryImagesProps) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/media/category/${category}`)
      .then(res => res.json())
      .then(data => {
        const limitedData = limit ? data.slice(0, limit) : data
        setImages(limitedData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, limit])

  if (loading) {
    return <div className="text-center py-4">Loading images...</div>
  }

  if (images.length === 0) {
    return null // Don't show anything if no images
  }

  return (
    <div className={className}>
      {images.map((image) => (
        <div key={image.id} className={imageClassName}>
          <Image
            src={image.url}
            alt={image.originalName || 'Image'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  )
}
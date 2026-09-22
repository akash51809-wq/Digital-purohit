'use client'

import { useState, useRef } from 'react'
import { X, ZoomIn, ZoomOut, Move } from 'lucide-react'

interface ImageCropperProps {
  imageUrl: string
  onSave: (position: { x: number; y: number; zoom: number }) => void
  onClose: () => void
  initialPosition?: { x: number; y: number; zoom: number }
}

export default function ImageCropper({ imageUrl, onSave, onClose, initialPosition }: ImageCropperProps) {
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50, zoom: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = (e.clientX - dragStart.x) / 3
    const deltaY = (e.clientY - dragStart.y) / 3
    
    setPosition(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, prev.x + deltaX)),
      y: Math.max(0, Math.min(100, prev.y + deltaY))
    }))
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (delta: number) => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.max(50, Math.min(200, prev.zoom + delta))
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Adjust Image Position</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div 
            ref={containerRef}
            className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${position.zoom}%`,
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%'
              }}
            />
            <div className="absolute inset-0 border-2 border-dashed border-white/50 pointer-events-none" />
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Zoom: {position.zoom}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleZoom(-10)}
                  className="p-2 border rounded hover:bg-gray-50"
                  type="button"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleZoom(10)}
                  className="p-2 border rounded hover:bg-gray-50"
                  type="button"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Move className="w-4 h-4" />
              <span>Click and drag to reposition the image</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(position)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

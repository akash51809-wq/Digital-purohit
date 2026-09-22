'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

interface AnimatedLogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  variant?: 'full' | 'icon-only'
}

export default function AnimatedLogo({
  className = '',
  width = 170,
  height = 42,
  showText = true,
  variant = 'full',
}: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'icon-only') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Glow Aura */}
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.25, 1.1] : [1, 1.1, 1],
            opacity: isHovered ? [0.6, 0.9, 0.7] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 -m-1.5 bg-gradient-to-tr from-[#F15A24] via-orange-400 to-[#1D3557] rounded-full blur-md"
        />

        {/* 360 Flip / 3D Turn Container */}
        <motion.div
          animate={{
            rotateY: isHovered ? 360 : 0,
            y: [0, -2, 0],
          }}
          transition={{
            rotateY: { duration: 0.85, ease: [0.34, 1.56, 0.64, 1] },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative z-10 w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-gray-100 flex items-center justify-center"
        >
          <Image
            src="/dp-icon.png"
            alt="Digital Purohit Emblem"
            width={40}
            height={40}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className={`relative inline-flex items-center cursor-pointer select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Background Subtle Ambient Glow on Hover */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.35 : 0,
          scale: isHovered ? 1.05 : 0.95,
        }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-2 bg-gradient-to-r from-[#F15A24]/30 via-orange-300/20 to-[#1D3557]/30 rounded-xl blur-lg pointer-events-none"
      />

      {/* Emblem with 360 Turn Animation */}
      <div className="relative flex items-center space-x-2.5">
        <motion.div
          animate={{
            rotateY: isHovered ? 360 : 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative flex-shrink-0"
        >
          <Image
            src="/logo.jpg"
            alt="Digital Purohit Logo"
            width={width}
            height={height}
            className="h-9 sm:h-11 w-auto object-contain transition-transform"
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

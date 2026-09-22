'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  Code2, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Laptop,
  TrendingUp,
  Cpu
} from 'lucide-react'
import Image from 'next/image'

export default function HeroDeviceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-9, 9]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Typewriter Code Animation
  const codeLines = [
    'import { DigitalPurohit } from "@dp/tech";',
    'const agency = new DigitalPurohit();',
    'agency.build({',
    '  apps: ["Web", "Mobile", "Cloud"],',
    '  speed: "Ultra Fast",',
    '  quality: "100% Guaranteed",',
    '});',
    'await agency.launchSuccess(); 🚀'
  ]

  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [displayedCode, setDisplayedCode] = useState<string[]>([])
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    if (currentLineIndex < codeLines.length) {
      const line = codeLines[currentLineIndex]
      if (currentCharIndex < line.length) {
        const timeout = setTimeout(() => {
          setDisplayedCode((prev) => {
            const next = [...prev]
            if (!next[currentLineIndex]) next[currentLineIndex] = ''
            next[currentLineIndex] = line.slice(0, currentCharIndex + 1)
            return next
          })
          setCurrentCharIndex((prev) => prev + 1)
        }, 22)
        return () => clearTimeout(timeout)
      } else {
        const lineTimeout = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1)
          setCurrentCharIndex(0)
        }, 120)
        return () => clearTimeout(lineTimeout)
      }
    } else {
      setIsTypingComplete(true)
      const restartTimeout = setTimeout(() => {
        setDisplayedCode([])
        setCurrentLineIndex(0)
        setCurrentCharIndex(0)
        setIsTypingComplete(false)
      }, 7000)
      return () => clearTimeout(restartTimeout)
    }
  }, [currentLineIndex, currentCharIndex])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[580px] mx-auto select-none perspective-[1200px]"
    >
      {/* Ambient Radial Backdrop Glow */}
      <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-[#F15A24]/20 via-orange-300/10 to-[#1D3557]/25 rounded-3xl blur-2xl pointer-events-none -z-10" />

      {/* Main 3D Container with Parallax Response */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 0.88, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* ========================================================
            LAPTOP CONTAINER (MacBook Style)
            ======================================================== */}
        <div className="relative mx-auto w-full max-w-[480px] sm:max-w-[520px]">
          {/* Laptop Lid / Screen Bezel */}
          <div className="relative rounded-2xl bg-gradient-to-b from-gray-800 via-gray-900 to-black p-2.5 sm:p-3 shadow-2xl border border-gray-700/80">
            {/* Webcam dot */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-700/80 ring-1 ring-gray-950" />

            {/* Laptop Screen Display */}
            <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-gray-800 text-left shadow-inner">
              {/* Window Header Bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-gray-800">
                {/* macOS traffic light buttons */}
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>

                {/* Editor File Tab */}
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#0d1117] border border-gray-800/80 text-[10px] sm:text-xs text-gray-300 font-mono">
                  <Code2 className="w-3 h-3 text-[#F15A24]" />
                  <span>DigitalPurohit.tsx</span>
                </div>

                {/* Live Build Indicator */}
                <div className="flex items-center space-x-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono hidden sm:inline">LIVE</span>
                </div>
              </div>

              {/* Code Typing Area */}
              <div className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs leading-relaxed min-h-[175px] sm:min-h-[200px] bg-[#0d1117]/95">
                {displayedCode.map((line, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="w-5 text-gray-600 select-none text-[9px] sm:text-[10px] text-right mr-2.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-200 break-all">
                      {/* Keyword highlighting simulation */}
                      {line.startsWith('import') ? (
                        <>
                          <span className="text-purple-400">import</span> {line.replace('import', '')}
                        </>
                      ) : line.startsWith('const') ? (
                        <>
                          <span className="text-blue-400">const</span>{' '}
                          <span className="text-[#F15A24] font-semibold">agency</span> ={' '}
                          <span className="text-yellow-300">new</span> DigitalPurohit();
                        </>
                      ) : line.includes('await') ? (
                        <>
                          <span className="text-purple-400">await</span>{' '}
                          <span className="text-emerald-400 font-medium">{line.replace('await', '')}</span>
                        </>
                      ) : line.includes('apps:') || line.includes('speed:') || line.includes('quality:') ? (
                        <>
                          <span className="text-cyan-300">{line.split(':')[0]}:</span>
                          <span className="text-amber-300">{line.split(':')[1]}</span>
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </div>
                ))}

                {/* Blinking Typing Cursor */}
                {!isTypingComplete && (
                  <div className="flex items-center mt-0.5">
                    <span className="w-5 text-gray-600 text-[9px] sm:text-[10px] text-right mr-2.5 flex-shrink-0">
                      {displayedCode.length + 1}
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-1.5 h-3.5 bg-[#F15A24] rounded-sm ml-0.5"
                    />
                  </div>
                )}

                {/* Terminal Status Output Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: isTypingComplete ? 1 : 0.8, y: 0 }}
                  className="mt-3 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400"
                >
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Compiled successfully in 240ms</span>
                  </div>
                  <span className="text-gray-500 font-mono hidden sm:inline">v2.4.0</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Laptop Base (Lower Chassis & Trackpad) */}
          <div className="relative -mt-1 h-3.5 sm:h-4 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-800 rounded-b-xl shadow-xl flex justify-center items-start">
            {/* Display notch opener */}
            <div className="w-16 sm:w-20 h-1 bg-gray-500 rounded-b-md" />
          </div>

          {/* Laptop Table Shadow */}
          <div className="w-[90%] mx-auto h-3 bg-black/40 blur-md rounded-full mt-1" />
        </div>

        {/* ========================================================
            SMARTPHONE CONTAINER (iPhone Style Floating on Right)
            ======================================================== */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-6 sm:-bottom-8 -right-2 sm:right-2 w-[140px] sm:w-[170px] z-30"
          style={{
            transform: 'translateZ(40px)',
          }}
        >
          {/* Phone Body with Chrome Border */}
          <div className="relative rounded-[28px] bg-gradient-to-b from-gray-900 via-black to-gray-900 p-2 shadow-2xl border-2 border-gray-700/70">
            {/* Screen Glass */}
            <div className="rounded-[22px] overflow-hidden bg-gradient-to-b from-slate-900 to-indigo-950 p-2 sm:p-2.5 text-left border border-indigo-900/50">
              {/* Dynamic Island */}
              <div className="w-12 h-3 mx-auto bg-black rounded-full mb-2 flex items-center justify-center space-x-1">
                <div className="w-1 h-1 rounded-full bg-blue-900" />
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Mini App UI Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center shadow-sm">
                  <Image
                    src="/dp-icon.png"
                    alt="DP Icon"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold text-white tracking-wide">
                  Digital Purohit
                </span>
                <span className="text-[7px] bg-[#F15A24] text-white px-1 py-0.2 rounded font-bold">
                  PRO
                </span>
              </div>

              {/* Mini Live Metric Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-1.5 mb-1.5 border border-white/10">
                <div className="flex items-center justify-between text-[7px] sm:text-[8px] text-gray-300 mb-0.5">
                  <span>Growth Metric</span>
                  <span className="text-emerald-400 font-bold flex items-center">
                    <TrendingUp className="w-2 h-2 mr-0.5" /> +99.4%
                  </span>
                </div>
                {/* Mini animated progress bar */}
                <div className="w-full bg-gray-700/60 rounded-full h-1 overflow-hidden">
                  <motion.div
                    animate={{ width: ['20%', '85%', '95%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    className="h-full bg-gradient-to-r from-[#F15A24] to-amber-400 rounded-full"
                  />
                </div>
              </div>

              {/* Mini Service Chips */}
              <div className="space-y-1 text-[7px] sm:text-[8px]">
                <div className="flex items-center justify-between bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                  <span className="text-gray-300">Web & Cloud</span>
                  <span className="text-emerald-400">Active ✓</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                  <span className="text-gray-300">Mobile Apps</span>
                  <span className="text-emerald-400">Ready ✓</span>
                </div>
              </div>

              {/* Bottom Home Bar */}
              <div className="w-10 h-0.5 bg-white/50 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            FLOATING 3D GLASS BADGES
            ======================================================== */}
        {/* Floating Top-Left Badge */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -1, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-4 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl border border-gray-100 flex items-center space-x-2 z-20"
        >
          <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#F15A24] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] sm:text-xs font-bold text-dark-800">Ultra-Fast</div>
            <div className="text-[8px] sm:text-[9px] text-dark-500">Next.js 14 Stack</div>
          </div>
        </motion.div>

        {/* Floating Top-Right Badge */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 1.5, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className="absolute -top-3 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl border border-gray-100 flex items-center space-x-2 z-20 hidden xs:flex"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] sm:text-xs font-bold text-dark-800">100% Reliable</div>
            <div className="text-[8px] sm:text-[9px] text-dark-500">Cloud Scalable</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

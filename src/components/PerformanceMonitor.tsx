'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics
        const value = (entry as any).value || entry.duration || 0
        console.log(`${entry.name}: ${value}ms`)
        
        // You can send these to analytics service
        // analytics.track('performance', {
        //   metric: entry.name,
        //   value: value,
        //   url: window.location.pathname
        // })
      }
    })

    // Observe Core Web Vitals
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] })
    } catch (e) {
      // Fallback for older browsers
      console.log('Performance Observer not supported')
    }

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}
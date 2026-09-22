'use client'

import { motion } from 'framer-motion'
import {
  Code, Globe, Smartphone, Cloud, Database, Shield,
  ArrowRight, CheckCircle2, ChevronLeft,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
const iconMap: any = { Code, Globe, Smartphone, Cloud, Database, Shield }

const gradients = [
  'from-yellow-400 via-primary-500 to-accent-500',
  'from-accent-500 via-orange-400 to-yellow-400',
  'from-primary-400 via-yellow-300 to-accent-400',
  'from-orange-500 via-accent-500 to-primary-500',
  'from-yellow-500 via-primary-400 to-orange-400',
  'from-accent-400 via-primary-500 to-yellow-500',
]

// ── Main Component ─────────────────────────────────────────────────────────────
const Services = () => {
  const [mounted, setMounted] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMounted(true)
    fetch('/api/services', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json() })
      .then(data => {
        if (Array.isArray(data)) setServices(data.filter((s: any) => s.isActive !== false))
        else setServices([])
        setLoading(false)
      })
      .catch(() => { setServices([]); setLoading(false) })
  }, [])

  const toggleFlip = (id: string) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }))

  if (!mounted) {
    return (
      <section id="services" className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-800 mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-dark-500">Loading services...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="services" className="section-padding bg-gray-50 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-14 sm:mb-16 lg:mb-20"
          >
            <span className="inline-block text-xs font-bold text-primary-600 uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full border border-primary-500/40 bg-primary-500/10">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-5">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-base sm:text-lg text-dark-500 max-w-2xl mx-auto leading-relaxed">
              Comprehensive technology solutions tailored to your business needs.
            </p>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-dark-500">No services available yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Code
                const grad = gradients[index % gradients.length]
                const isFlipped = flipped[service.id] || false

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-80 service-glow rounded-3xl"
                    style={{ perspective: '1200px' }}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-700"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* ── FRONT ── */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-md flex flex-col items-center justify-center p-7 text-center"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${grad} rounded-t-3xl`} />

                        {/* Glowing icon */}
                        <div className="relative mb-5">
                          <div className={`absolute inset-0 bg-gradient-to-br ${grad} rounded-2xl blur-xl opacity-30 scale-125`} />
                          <div className={`relative w-20 h-20 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center shadow-xl`}>
                            <IconComponent className="w-10 h-10 text-white drop-shadow" />
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-display font-bold text-dark-800 mb-5 leading-snug">
                          {service.title}
                        </h3>

                        {/* Two buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleFlip(service.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r ${grad} px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity`}
                          >
                            Details <ArrowRight className="w-3 h-3" />
                          </button>
                          <Link
                            href="/contact"
                            className="flex items-center gap-1.5 text-xs font-bold text-dark-700 border border-gray-300 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                          >
                            Contact Me
                          </Link>
                        </div>
                      </div>

                      {/* ── BACK ── */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col justify-between p-6 bg-white border border-gray-100 shadow-md"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${grad} rounded-t-3xl`} />
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${grad} rounded-full blur-2xl opacity-10`} />

                        {/* Header row */}
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <button
                              onClick={() => toggleFlip(service.id)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                            >
                              <ChevronLeft className="w-4 h-4 text-dark-600" />
                            </button>
                            <div className={`w-8 h-8 bg-gradient-to-br ${grad} rounded-lg flex items-center justify-center shrink-0`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-display font-bold text-dark-800 leading-tight truncate">
                              {service.title}
                            </h3>
                          </div>

                          <div className={`h-px bg-gradient-to-r ${grad} opacity-50 mb-3`} />

                          {service.features?.length > 0 && (
                            <ul className="space-y-1.5">
                              {service.features.slice(0, 4).map((feature: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                                  <span className="text-xs text-dark-600 leading-snug">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          {service.price && (
                            <div>
                              <p className="text-[10px] text-dark-400 uppercase tracking-widest">Starting at</p>
                              <p className="text-base font-bold text-primary-600">{service.price}</p>
                            </div>
                          )}
                          <Link
                            href="/contact"
                            className={`flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r ${grad} px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity ml-auto`}
                          >
                            Contact Me
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-14 sm:mt-16 lg:mt-20 px-4"
          >
            <p className="text-base sm:text-lg text-dark-500 mb-6">
              Ready to transform your business with our technology solutions?
            </p>
            <Link
              href="/contact"
              className="btn-primary text-sm sm:text-base px-8 py-3.5 inline-flex items-center gap-2"
            >
              Get Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

    </>
  )
}

export default Services

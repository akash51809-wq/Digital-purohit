'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ projects: 0, articles: 0, services: 0 })
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})

    fetch('/api/media/category/hero')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setHeroImage(data[0].url)
      })
      .catch(() => {})
  }, [])

  const features = [
    'Enterprise-grade solutions',
    'Scalable architecture',
    '24/7 dedicated support'
  ]

  // Prevent hydration mismatch by not rendering animations until mounted
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-primary-50 overflow-hidden pt-20 sm:pt-0">
        <div className="container-custom relative z-10 py-8 sm:py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-primary-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500" />
                <span className="text-xs sm:text-sm font-medium text-dark-700">Trusted by Industry Leaders</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-dark-800 mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
                Transform Your Business with{' '}
                <span className="gradient-text">Intelligent Technology</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-dark-600 mb-5 sm:mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                We build scalable, intelligent digital solutions that drive growth, enhance efficiency, and position your business for long-term success.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-dark-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
                <Link href="/contact" className="btn-primary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl">
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link href="/portfolio" className="btn-outline w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                  View Our Work
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1">0+</div>
                  <div className="text-xs sm:text-sm text-dark-600">Projects</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1">0+</div>
                  <div className="text-xs sm:text-sm text-dark-600">Articles</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-dark-600">Support</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative order-1 lg:order-2 px-4 sm:px-0">
              <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl sm:rounded-3xl transform rotate-3 shadow-2xl"></div>
                <div className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 via-accent-50 to-primary-50">
                    <div className="text-center p-4 sm:p-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 shadow-xl">
                        <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">V</span>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold gradient-text mb-2 sm:mb-3">Veliora TechWorks</h3>
                      <p className="text-dark-600 text-xs sm:text-sm mb-2 sm:mb-4">Upload hero image in Admin → Media</p>
                      <p className="text-xs text-dark-500">Category: hero</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-primary-50 overflow-hidden pt-20 sm:pt-0">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-60 h-60 sm:w-80 sm:h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 -left-20 sm:-left-40 w-60 h-60 sm:w-80 sm:h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 sm:w-60 sm:h-60 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container-custom relative z-10 py-8 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-primary-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 shadow-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500" />
              <span className="text-xs sm:text-sm font-medium text-dark-700">Trusted by Industry Leaders</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-dark-800 mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
            >
              Transform Your Business with{' '}
              <span className="gradient-text">Intelligent Technology</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-dark-600 mb-5 sm:mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0"
            >
              We build scalable, intelligent digital solutions that drive growth, enhance efficiency, and position your business for long-term success.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 mb-5 sm:mb-6"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-dark-700">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0"
            >
              <Link href="/contact" className="btn-primary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/portfolio" className="btn-outline w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                View Our Work
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1">{stats.projects}+</div>
                <div className="text-xs sm:text-sm text-dark-600">Projects</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1">{stats.articles}+</div>
                <div className="text-xs sm:text-sm text-dark-600">Articles</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-dark-600">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2 px-4 sm:px-0"
          >
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
              {/* Decorative Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl sm:rounded-3xl transform rotate-3 shadow-2xl"></div>
              <div className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="Veliora TechWorks - Professional Technology Solutions"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 via-accent-50 to-primary-50">
                    <div className="text-center p-4 sm:p-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 shadow-xl">
                        <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">V</span>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold gradient-text mb-2 sm:mb-3">Veliora TechWorks</h3>
                      <p className="text-dark-600 text-xs sm:text-sm mb-2 sm:mb-4">Upload hero image in Admin → Media</p>
                      <p className="text-xs text-dark-500">Category: hero</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 hidden md:block"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-dark-800">{stats.services}+</div>
                    <div className="text-xs sm:text-sm text-dark-600">Services Offered</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-xl hidden lg:block"
              >
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-semibold">Premium Quality</div>
                  <div className="text-xs opacity-90">Guaranteed</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Portfolio = ({ showAll = false, limit = 6 }: { showAll?: boolean; limit?: number }) => {
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Add a small delay to prioritize above-the-fold content
    const timer = setTimeout(() => {
      const timestamp = Date.now()
      fetch(`/api/projects/public?t=${timestamp}`, { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch projects')
          }
          return res.json()
        })
        .then(data => {
          if (Array.isArray(data)) {
            setProjects(showAll ? data : data.slice(0, limit))
          } else {
            console.error('Invalid projects data:', data)
            setProjects([])
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching projects:', error)
          setProjects([])
          setLoading(false)
        })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section id="portfolio" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6 px-4">
              Our <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-dark-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Explore our latest projects and see how we've helped businesses transform 
              their digital presence.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-dark-600">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6 px-4">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-dark-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Explore our latest projects and see how we've helped businesses transform 
            their digital presence.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48 sm:h-56 md:h-64"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-600">No projects yet. Create one in Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16 px-4">
            {projects.map((project, index) => {
              const imgSrc = project.gallery?.[0] || project.image
              const initials = project.title?.split(' ').map((w: string) => w[0]).join('') || 'P'
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* ── MOBILE card: full-width banner with text overlay (visible only < sm) ── */}
                  <div className="flex sm:hidden group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-56">
                    {/* Full background image */}
                    {imgSrc ? (
                      <Image src={imgSrc} alt={project.title || 'Project'} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-primary-500">{initials}</span>
                      </div>
                    )}

                    {/* Dark gradient overlay always visible at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/40 to-transparent" />

                    {/* Featured badge */}
                    {project.isFeatured && (
                      <span className="absolute top-3 left-3 text-xs font-bold text-dark-900 bg-primary-500 px-2 py-0.5 rounded-full z-10">Featured</span>
                    )}

                    {/* Bottom text content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                      <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{project.category || 'Project'}</span>
                      <h3 className="text-base font-display font-bold text-white leading-snug mt-0.5 mb-2">{project.title || 'Untitled Project'}</h3>
                      <div className="flex items-center gap-2">
                        <Link href={`/portfolio/${project.id}`} className="flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors">
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-primary-500 to-accent-500 px-2.5 py-1 rounded-full shadow-md">
                            <ExternalLink className="w-2.5 h-2.5" /> Live Preview
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── TABLET card: image top + slide-up content banner (visible sm–lg) ── */}
                  <div className="hidden sm:flex lg:hidden group relative flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                    {/* Image with slide-up overlay */}
                    <div className="relative h-56 overflow-hidden bg-gray-50">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={project.title || 'Project'} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
                          <span className="text-4xl font-display font-bold text-primary-500">{initials}</span>
                        </div>
                      )}
                      {/* Slide-up content banner */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-in-out bg-gradient-to-t from-dark-900 via-dark-800/95 to-dark-800/80 p-4">
                        <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Tech Stack</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies?.map((tech: string, i: number) => (
                            <span key={i} className="text-xs text-white bg-white/15 border border-white/20 px-2 py-0.5 rounded-md">{tech}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Link href={`/portfolio/${project.id}`} className="flex items-center gap-1 text-sm font-semibold text-white hover:text-primary-300 transition-colors">
                            View Details <ArrowRight className="w-4 h-4" />
                          </Link>
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 px-3 py-1.5 rounded-full shadow-md">
                              <ExternalLink className="w-3 h-3" /> Live Preview
                            </a>
                          )}
                        </div>
                      </div>
                      {project.isFeatured && (
                        <span className="absolute top-3 right-3 text-xs font-semibold text-dark-900 bg-primary-500 px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                    {/* Category + title strip */}
                    <div className="px-4 py-3 border-t-2 border-primary-500/30">
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{project.category || 'Project'}</span>
                      <h3 className="text-base font-display font-bold text-dark-800 leading-snug mt-0.5">{project.title || 'Untitled Project'}</h3>
                    </div>
                  </div>

                  {/* ── DESKTOP card: vertical with hover tech overlay (visible lg+) ── */}
                  <div className="hidden lg:flex group relative flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                    <div className="relative h-52 overflow-hidden bg-gray-50">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={project.title || 'Project'} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
                          <span className="text-3xl font-display font-bold text-primary-500">{initials}</span>
                        </div>
                      )}
                      {project.technologies?.length > 0 && (
                        <div className="absolute inset-0 bg-dark-800/85 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                          <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1">Tech Stack</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {project.technologies.map((tech: string, i: number) => (
                              <span key={i} className="text-xs text-white bg-white/10 border border-white/20 px-2 py-1 rounded-md">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.isFeatured && (
                        <span className="absolute top-3 right-3 text-xs font-semibold text-dark-900 bg-primary-500 px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                    <div className="flex flex-col flex-1 p-5">
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">{project.category || 'Project'}</span>
                      <h3 className="text-lg font-display font-bold text-dark-800 mb-2 leading-snug">{project.title || 'Untitled Project'}</h3>
                      <p className="text-sm text-dark-500 leading-relaxed line-clamp-2 flex-1">{project.description || 'No description available'}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <Link href={`/portfolio/${project.id}`} className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors group/link">
                          View Details
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                        </Link>
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                            <ExternalLink className="w-3 h-3" /> Live Preview
                          </a>
                        )}
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
          className="text-center px-4"
        >
          <p className="text-base sm:text-lg text-dark-600 mb-6 sm:mb-8">
            Want to see more of our work or discuss your project?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio" className="btn-primary w-full sm:w-auto">
              View All Projects
            </Link>
            <Link href="/contact" className="btn-outline w-full sm:w-auto">
              Start Your Project
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Portfolio
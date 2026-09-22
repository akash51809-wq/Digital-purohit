'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ImageModal from '@/components/ui/ImageModal'
import { ExternalLink, Github, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch(`/api/projects/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        console.log('Project data:', data)
        console.log('Features:', data.features)
        console.log('Content:', data.content)
        setProject(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <main>
        <Header />
        <div className="pt-32 pb-16 text-center">Loading...</div>
        <Footer />
      </main>
    )
  }

  if (!project) {
    return (
      <main>
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <Link href="/portfolio" className="btn-primary">Back to Portfolio</Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Header />
      
      <section className="pt-32 pb-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <Link href="/portfolio" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Portfolio
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
                {project.category}
              </span>
              {project.isFeatured && (
                <span className="text-xs font-medium text-accent-500 bg-accent-50 px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4">
              {project.title}
            </h1>

            <p className="text-xl text-dark-600 mb-6">{project.description}</p>

            {project.client && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 inline-block">
                <span className="text-sm font-medium text-gray-500">Client:</span>
                <span className="text-dark-800 font-semibold ml-2">{project.client}</span>
              </div>
            )}

            {(project.gallery && project.gallery.length > 0) ? (
              <div className="mb-8">
                <div className="w-full cursor-pointer" onClick={() => setShowModal(true)}>
                  <img
                    src={project.gallery[currentImage]}
                    alt={`${project.title} - Image ${currentImage + 1}`}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                {project.gallery.length > 1 && (
                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={() => setCurrentImage((currentImage - 1 + project.gallery.length) % project.gallery.length)}
                      className="btn-outline flex items-center px-4 py-2"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </button>
                    <div className="flex gap-2">
                      {project.gallery.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImage ? 'bg-primary-500 w-8' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentImage((currentImage + 1) % project.gallery.length)}
                      className="btn-outline flex items-center px-4 py-2"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            ) : project.image && (
              <div className="mb-8">
                <div className="w-full cursor-pointer" onClick={() => setShowModal(true)}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-dark-800 mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {project.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-500 mr-3 mt-1">✓</span>
                      <span className="text-dark-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-dark-800 mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-sm font-medium text-dark-700 bg-gray-100 px-4 py-2 rounded-lg flex items-center"
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {project.content && (
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-dark-800 mb-6">Project Details</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="prose prose-lg max-w-none text-dark-600">
                  {project.content.split('\n').map((paragraph: string, idx: number) => (
                    paragraph.trim() ? (
                      <p key={idx} className="mb-4 last:mb-0 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Project
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center"
              >
                <Github className="w-5 h-5 mr-2" />
                View Source Code
              </a>
            )}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Image Modal */}
      <ImageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        images={project?.gallery || (project?.image ? [project.image] : [])}
        currentIndex={currentImage}
        onPrevious={() => {
          const images = project?.gallery || (project?.image ? [project.image] : [])
          setCurrentImage((currentImage - 1 + images.length) % images.length)
        }}
        onNext={() => {
          const images = project?.gallery || (project?.image ? [project.image] : [])
          setCurrentImage((currentImage + 1) % images.length)
        }}
        title={project?.title}
      />
    </main>
  )
}

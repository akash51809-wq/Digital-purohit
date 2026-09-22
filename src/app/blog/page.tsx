'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, User, ArrowRight } from 'lucide-react'
import { formatFirebaseDate } from '@/lib/dateUtils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function BlogPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    fetch('/api/posts/public')
      .then(res => {
        console.log('Response status:', res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log('Public posts received:', data)
        if (Array.isArray(data)) {
          setPosts(data)
          setError(null)
        } else {
          console.error('Invalid data format:', data)
          setPosts([])
          setError('Invalid data format')
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Fetch error:', error)
        setError(error.message)
        setPosts([])
        setLoading(false)
      })
  }, [])

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  console.log('Render state:', { mounted, loading, postsCount: posts.length, filteredCount: filteredPosts.length })

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return null
  }

  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-dark-800 mb-4">
              Insights & <span className="gradient-text">Innovation</span>
            </h1>
            <p className="text-xl text-dark-600 mb-6">
              Stay updated with the latest trends, best practices, and insights from our technology experts.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-dark-600 hover:bg-primary-100 hover:text-primary-600 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading articles: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 btn-primary"
              >
                Retry
              </button>
            </div>
          )}
          {!error && loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !error && filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-600 text-lg">No published articles yet.</p>
              <p className="text-dark-500 text-sm mt-2">Articles created by admin will appear here once published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="card overflow-hidden group hover:scale-105 transition-all duration-300">
                  {/* Post Image */}
                  <div className="relative h-56 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
                    {post.image ? (
                      <div
                        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${post.image})`,
                          backgroundSize: post.imagePosition?.zoom ? `${post.imagePosition.zoom}%` : 'cover',
                          backgroundPosition: post.imagePosition 
                            ? `${post.imagePosition.x}% ${post.imagePosition.y}%` 
                            : 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                        onLoad={() => console.log('Post image loaded:', post.id, 'imagePosition:', post.imagePosition)}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl font-display font-bold text-white/30">
                            {post.title?.split(' ').slice(0, 2).map((word: string) => word[0]).join('')}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime || 5} min read</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-display font-semibold text-dark-800 mb-3 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-dark-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author?.name || 'Admin'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatFirebaseDate(post.createdAt)}
                        </div>
                      </div>
                      <a
                        href={post.tags?.[0] || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-500 font-medium hover:text-primary-600 transition-colors duration-200 group"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
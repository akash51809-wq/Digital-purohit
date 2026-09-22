'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, Calendar, User, ArrowRight } from 'lucide-react'
import { formatFirebaseDate } from '@/lib/dateUtils'

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    
    fetch('/api/posts/public', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoading(false)
      })
    
    return () => controller.abort()
  }, [])

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))],
    [articles]
  )

  const filteredArticles = useMemo(() => {
    const search = searchTerm.toLowerCase()
    return articles.filter(article => {
      const matchesSearch = !search || 
        article.title?.toLowerCase().includes(search) ||
        article.excerpt?.toLowerCase().includes(search)
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [articles, searchTerm, selectedCategory])

  return (
    <main>
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-dark-800 mb-6">
              Articles & <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-xl text-dark-600 mb-8">
              Stay updated with the latest trends, best practices, and insights from our technology experts.
            </p>
            
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-dark-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-600">No published articles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article key={article.id} className="card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {article.image ? (
                      <div 
                        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${article.image})`,
                          backgroundSize: article.imagePosition?.zoom ? `${article.imagePosition.zoom}%` : 'cover',
                          backgroundPosition: article.imagePosition 
                            ? `${article.imagePosition.x}% ${article.imagePosition.y}%` 
                            : 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-900/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl font-display font-bold text-gray-700/30">
                            {article.title.split(' ').slice(0, 2).map((word: string) => word[0]).join('')}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500">{article.readTime} min read</span>
                    </div>

                    <h2 className="text-xl font-display font-semibold text-dark-800 mb-3 line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-dark-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.author?.name || 'Admin'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatFirebaseDate(article.createdAt)}
                        </div>
                      </div>
                      <a
                        href={article.tags?.[0] || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200 group"
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
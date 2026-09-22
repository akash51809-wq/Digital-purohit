'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check if user is logged in (check localStorage or session)
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      setIsLoggedIn(!!token)
    }
    checkAuth()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Articles', href: '/articles' },
    { name: 'Contact', href: '/contact' },
  ]

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Favicon.jpg"
                alt="Veliora TechWorks Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-display font-bold text-xl text-dark-800">
                Veliora TechWorks
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-dark-700 hover:text-primary-500 font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-dark-800">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Favicon.jpg"
              alt="Veliora TechWorks Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-display font-bold text-xl text-dark-800">
              Veliora TechWorks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-dark-700 hover:text-primary-500 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link href="/admin" className="text-dark-700 hover:text-primary-500 font-medium transition-colors duration-200">
                  Admin
                </Link>
                <button onClick={handleLogout} className="btn-secondary flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-dark-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-dark-700 hover:text-primary-500 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {isLoggedIn && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-dark-700 hover:text-primary-500 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                {isLoggedIn && (
                  <div className="px-4">
                    <button onClick={handleLogout} className="btn-secondary w-full text-center flex items-center justify-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header
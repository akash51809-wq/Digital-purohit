'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  Image,
  BarChart3,
  Menu,
  X,
  LogOut,
  Globe
} from 'lucide-react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Services', href: '/admin/services', icon: BarChart3 },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const primaryNav = navigation.slice(0, 3)
  const secondaryNav = navigation.slice(3)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar - Hidden on mobile, valid on lg+ */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 flex-col transition-all duration-300">
        <div className="flex items-center h-16 px-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-white font-display font-semibold">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 mt-6 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info - Desktop */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div className="overflow-hidden">
              <div className="text-white font-medium truncate">Admin User</div>
              <div className="text-gray-400 text-sm truncate">admin@veliora.com</div>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 w-full px-2 py-2 rounded-lg hover:bg-gray-800">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar - Mobile & Desktop */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-gray-900 font-display font-semibold">Admin</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 ml-auto">
              <Link
                href="/"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-sm hover:shadow-md hover:from-primary-600 hover:to-accent-600 transition-all duration-300 lg:hidden"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Site</span>
              </Link>

              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors duration-200 hidden lg:block"
              >
                View Site
              </Link>

              <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full hover:bg-red-100 hover:text-red-700 transition-all duration-300 lg:hidden">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* More Menu Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[-1]"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* More Menu Popup */}
        {mobileMenuOpen && (
          <div className="absolute bottom-full right-4 mb-4 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="py-2">
              {secondaryNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isActive ? 'text-primary-500 bg-primary-50' : 'text-gray-700'
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe-area">
          <nav className="flex items-center justify-around px-2 py-3">
            {/* Primary Nav Items */}
            {primaryNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex flex-col items-center justify-center w-16 p-1 space-y-1 rounded-lg transition-colors ${isActive ? 'text-primary-500' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary-50' : ''}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium truncate max-w-full text-center">
                    {item.name}
                  </span>
                </Link>
              )
            })}

            {/* More Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center justify-center w-16 p-1 space-y-1 rounded-lg transition-colors ${mobileMenuOpen ? 'text-primary-500' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <div className={`p-1.5 rounded-full ${mobileMenuOpen ? 'bg-primary-50' : ''}`}>
                <Menu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium truncate max-w-full text-center">
                More
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
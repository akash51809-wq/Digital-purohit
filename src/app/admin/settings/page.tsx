'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Save, Globe, Mail, Trash2, RefreshCw, AlertTriangle, HardDrive } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [clearing, setClearing] = useState(false)
  const [cacheInfo, setCacheInfo] = useState({ sizeMB: '0', warning: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCacheInfo()
  }, [])

  const fetchCacheInfo = async () => {
    try {
      const res = await fetch('/api/cache/clear')
      const data = await res.json()
      setCacheInfo(data)
    } catch (error) {
      console.error('Error fetching cache info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = async () => {
    setClearing(true)
    try {
      const res = await fetch('/api/cache/clear', { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        toast.success('Cache cleared successfully!')
        fetchCacheInfo()
      } else {
        toast.error('Failed to clear cache')
      }
    } catch (error) {
      toast.error('Error clearing cache')
    } finally {
      setClearing(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your site configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cache Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Cache Management
            </h2>
            
            {/* Cache Size Display */}
            <div className={`mb-4 p-4 rounded-lg border-2 ${
              cacheInfo.warning 
                ? 'bg-red-50 border-red-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HardDrive className={`w-6 h-6 ${
                    cacheInfo.warning ? 'text-red-600' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cache Size</p>
                    <p className={`text-2xl font-bold ${
                      cacheInfo.warning ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {loading ? '...' : `${cacheInfo.sizeMB} MB`}
                    </p>
                  </div>
                </div>
                {cacheInfo.warning && (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>

            {/* Warning Message */}
            {cacheInfo.warning && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High Cache Usage</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Cache size exceeds 100 MB. Consider clearing to improve performance.
                  </p>
                </div>
              </div>
            )}

            <p className="text-gray-600 mb-4">Clear site cache to see latest content updates immediately.</p>
            <button 
              onClick={handleClearCache}
              disabled={clearing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{clearing ? 'Clearing...' : 'Clear Cache'}</span>
            </button>
          </div>

          {/* Site Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Site Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                <input
                  type="text"
                  defaultValue="Veliora TechWorks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  rows={3}
                  defaultValue="Building intelligent, scalable digital solutions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
              <button className="btn-primary flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="hello@veliora-techworks.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  defaultValue="San Francisco, CA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
              <button className="btn-primary flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
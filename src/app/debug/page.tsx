'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [postsData, setPostsData] = useState<any>(null)
  const [projectsData, setProjectsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting debug data fetch...')
        
        // Test posts API
        const postsResponse = await fetch('/api/posts/public')
        console.log('Posts response status:', postsResponse.status)
        const postsResult = await postsResponse.json()
        console.log('Posts data:', postsResult)
        setPostsData(postsResult)

        // Test projects API
        const projectsResponse = await fetch('/api/projects/public')
        console.log('Projects response status:', projectsResponse.status)
        const projectsResult = await projectsResponse.json()
        console.log('Projects data:', projectsResult)
        setProjectsData(projectsResult)

      } catch (err: any) {
        console.error('Debug fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Loading debug data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Posts Debug */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Posts API Debug</h2>
          <div className="mb-4">
            <strong>API Endpoint:</strong> /api/posts/public
          </div>
          <div className="mb-4">
            <strong>Data Type:</strong> {typeof postsData}
          </div>
          <div className="mb-4">
            <strong>Is Array:</strong> {Array.isArray(postsData) ? 'Yes' : 'No'}
          </div>
          <div className="mb-4">
            <strong>Length:</strong> {Array.isArray(postsData) ? postsData.length : 'N/A'}
          </div>
          <div className="mb-4">
            <strong>Raw Data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
              {JSON.stringify(postsData, null, 2)}
            </pre>
          </div>
          {Array.isArray(postsData) && postsData.length > 0 && (
            <div>
              <strong>Sample Post:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
                {JSON.stringify(postsData[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Projects Debug */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Projects API Debug</h2>
          <div className="mb-4">
            <strong>API Endpoint:</strong> /api/projects/public
          </div>
          <div className="mb-4">
            <strong>Data Type:</strong> {typeof projectsData}
          </div>
          <div className="mb-4">
            <strong>Is Array:</strong> {Array.isArray(projectsData) ? 'Yes' : 'No'}
          </div>
          <div className="mb-4">
            <strong>Length:</strong> {Array.isArray(projectsData) ? projectsData.length : 'N/A'}
          </div>
          <div className="mb-4">
            <strong>Raw Data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
              {JSON.stringify(projectsData, null, 2)}
            </pre>
          </div>
          {Array.isArray(projectsData) && projectsData.length > 0 && (
            <div>
              <strong>Sample Project:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
                {JSON.stringify(projectsData[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Environment Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Environment Info</h2>
          <div className="mb-2">
            <strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Timestamp:</strong> {new Date().toISOString()}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function UploadTest() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [configTest, setConfigTest] = useState<any>(null)

  const testCloudinaryConfig = async () => {
    try {
      const res = await fetch('/api/test-cloudinary')
      const data = await res.json()
      setConfigTest(data)
      
      if (data.success) {
        toast.success('Cloudinary config valid')
      } else {
        toast.error('Cloudinary config invalid')
      }
    } catch (error) {
      toast.error('Config test failed')
      setConfigTest({ error: 'Request failed' })
    }
  }

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)
    toast.loading('Testing upload...', { id: 'upload-test' })

    try {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('category', 'test')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setResult(data)

      if (res.ok && data.success) {
        toast.success('Upload successful!', { id: 'upload-test' })
      } else {
        toast.error(`Upload failed: ${data.error}`, { id: 'upload-test' })
      }
    } catch (error: any) {
      const errorData = { error: 'Network error', details: error.message }
      setResult(errorData)
      toast.error('Upload failed', { id: 'upload-test' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testCloudinaryConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Cloudinary Config
        </button>
        
        <div>
          <label className="block text-sm font-medium mb-2">Test Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={testUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {configTest && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Config Test Result:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(configTest, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Upload Result:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          {result.files?.[0]?.url && (
            <div className="mt-4">
              <p className="font-medium">Uploaded Image:</p>
              <img src={result.files[0].url} alt="Uploaded" className="mt-2 max-w-xs rounded" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
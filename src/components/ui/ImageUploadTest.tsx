'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Upload } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'checking'
  details: string[]
}

export default function ImageUploadTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results: TestResult[] = []

    // Test 1: Environment Variables
    try {
      const envTest: TestResult = {
        name: 'Environment Variables',
        status: 'checking',
        details: []
      }
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const hasCloudinary = !!cloudName
      
      envTest.details.push(`Cloudinary Cloud Name: ${hasCloudinary ? '✓' : '✗'}`)
      envTest.status = hasCloudinary ? 'pass' : 'fail'
      
      results.push(envTest)
    } catch (error) {
      results.push({
        name: 'Environment Variables',
        status: 'fail',
        details: [`Error: ${error}`]
      })
    }

    // Test 2: Upload API Endpoint
    try {
      const apiTest: TestResult = {
        name: 'Upload API Endpoint',
        status: 'checking',
        details: []
      }

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('files', testFile)
      formData.append('category', 'test')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      apiTest.details.push(`Response Status: ${response.status}`)
      
      if (response.ok) {
        const result = await response.json()
        apiTest.details.push(`Files Uploaded: ${result.files?.length || 0}`)
        apiTest.status = 'pass'
      } else {
        const error = await response.text()
        apiTest.details.push(`Error: ${error}`)
        apiTest.status = 'fail'
      }

      results.push(apiTest)
    } catch (error) {
      results.push({
        name: 'Upload API Endpoint',
        status: 'fail',
        details: [`Network Error: ${error}`]
      })
    }

    // Test 3: Firebase Connection
    try {
      const firebaseTest: TestResult = {
        name: 'Firebase Connection',
        status: 'checking',
        details: []
      }

      const response = await fetch('/api/media')
      firebaseTest.details.push(`Response Status: ${response.status}`)
      
      if (response.ok) {
        const media = await response.json()
        firebaseTest.details.push(`Media Count: ${media.length}`)
        firebaseTest.status = 'pass'
      } else {
        firebaseTest.status = 'fail'
        firebaseTest.details.push('Failed to fetch media')
      }

      results.push(firebaseTest)
    } catch (error) {
      results.push({
        name: 'Firebase Connection',
        status: 'fail',
        details: [`Error: ${error}`]
      })
    }

    setTestResults(results)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'fail': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Image Upload Deployment Test</h2>
      
      <button
        onClick={runTests}
        disabled={testing}
        className="mb-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        {testing ? 'Running Tests...' : 'Run Upload Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="space-y-4">
          {testResults.map((test, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(test.status)}
                <h3 className="font-semibold">{test.name}</h3>
              </div>
              <div className="ml-8 space-y-1">
                {test.details.map((detail: string, i: number) => (
                  <p key={i} className="text-sm text-gray-600">{detail}</p>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Test Summary</h4>
            <p className="text-sm">
              Passed: {testResults.filter(t => t.status === 'pass').length} / {testResults.length}
            </p>
            {testResults.every(t => t.status === 'pass') ? (
              <p className="text-green-600 font-medium mt-2">✓ All tests passed! Image upload is working correctly.</p>
            ) : (
              <p className="text-red-600 font-medium mt-2">✗ Some tests failed. Check the details above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
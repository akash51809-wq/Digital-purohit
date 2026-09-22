'use client'

import React, { useState, useCallback } from 'react'
import { uploadMultipleToCloudinaryDirect, saveMediaToFirebase } from '@/lib/cloudinary-client'

interface UploadProgress {
  fileIndex: number
  progress: number
  fileName: string
}

interface CloudinaryUploadProps {
  onUploadComplete?: (results: any[]) => void
  onUploadError?: (error: Error) => void
  category?: string
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
}

export default function CloudinaryUpload({
  onUploadComplete,
  onUploadError,
  category = 'general',
  maxFiles = 5,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  className = ''
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (files.length > maxFiles) {
      onUploadError?.(new Error(`Maximum ${maxFiles} files allowed`))
      return
    }

    // Validate file types
    const invalidFiles = files.filter(file => {
      return !acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type.replace('*', '.*'))
      })
    })

    if (invalidFiles.length > 0) {
      onUploadError?.(new Error(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`))
      return
    }

    setSelectedFiles(files)
    setUploadProgress(files.map((file, index) => ({
      fileIndex: index,
      progress: 0,
      fileName: file.name
    })))
  }, [maxFiles, acceptedTypes, onUploadError])

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    
    try {
      // Upload files directly to Cloudinary
      const uploadResults = await uploadMultipleToCloudinaryDirect(
        selectedFiles,
        category,
        (fileIndex, progress) => {
          setUploadProgress(prev => 
            prev.map(item => 
              item.fileIndex === fileIndex 
                ? { ...item, progress }
                : item
            )
          )
        },
        (fileIndex, result) => {
          console.log(`File ${fileIndex} uploaded:`, result.secure_url)
        }
      )

      // Save media info to Firebase
      await saveMediaToFirebase(uploadResults, category)

      // Reset state
      setSelectedFiles([])
      setUploadProgress([])
      
      onUploadComplete?.(uploadResults)
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.(error as Error)
    } finally {
      setIsUploading(false)
    }
  }, [selectedFiles, category, onUploadComplete, onUploadError])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setUploadProgress(prev => prev.filter(item => item.fileIndex !== index))
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="cloudinary-upload"
        />
        <label
          htmlFor="cloudinary-upload"
          className="cursor-pointer block"
        >
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.join(', ')} up to {maxFiles} files
            </p>
          </div>
        </label>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && uploadProgress.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Upload Progress:</h4>
          {uploadProgress.map((item) => (
            <div key={item.fileIndex} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{item.fileName}</span>
                <span>{Math.round(item.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}
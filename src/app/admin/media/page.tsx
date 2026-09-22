'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import FileDropzone from '@/components/ui/FileDropzone'
import UploadProgress from '@/components/ui/UploadProgress'
import ImageCropper from '@/components/ui/ImageCropper'
import { Upload, Search, Image as ImageIcon, Trash2, Edit, Copy, Crop } from 'lucide-react'
import { useState, useEffect } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  category: string | null
  size: number
  createdAt: string
  imagePosition?: { x: number; y: number; zoom: number }
}

export default function MediaPage() {
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState('')
  const [cropperImage, setCropperImage] = useState<{ url: string; id: string } | null>(null)
  const [showDropzone, setShowDropzone] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])

  const categories = ['all', 'hero', 'about', 'portfolio', 'blog', 'team', 'culture', 'general']

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media')
      const data = await res.json()
      console.log('Fetched media:', data)
      setMedia(data)
    } catch (error) {
      console.error('Fetch media error:', error)
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return

    if (selectedCategory === 'all') {
      toast.error('Please select a specific category first')
      return
    }

    setUploading(true)
    setUploadingFiles(files)
    
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      formData.append('category', selectedCategory)

      console.log(`Uploading ${files.length} files to category:`, selectedCategory)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      console.log('Upload response:', result)

      if (!res.ok) {
        throw new Error(result.details || result.error || 'Upload failed')
      }
      
      // Add the new media files to state immediately
      if (result.files) {
        setMedia(prev => [...prev, ...result.files])
        toast.success(`${result.count} files uploaded to ${selectedCategory} category!`)
      }
      
      await fetchMedia()
      setShowDropzone(false)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      toast.error(`Upload failed: ${errorMessage}`)
    } finally {
      setUploading(false)
      setUploadingFiles([])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return

    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' })
      toast.success('File deleted')
      fetchMedia()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleUpdateCategory = async (id: string, category: string, imagePosition?: { x: number; y: number; zoom: number }) => {
    try {
      await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, imagePosition })
      })
      toast.success('Updated successfully')
      setEditingId(null)
      fetchMedia()
    } catch (error) {
      toast.error('Update failed')
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied!')
  }

  const filteredMedia = selectedCategory === 'all' 
    ? media 
    : media.filter(m => m.category === selectedCategory)

  // Debug logging
  useEffect(() => {
    console.log('Media data:', media)
    console.log('Selected category:', selectedCategory)
    console.log('Filtered media:', filteredMedia)
  }, [media, selectedCategory, filteredMedia])

  return (
    <AdminLayout>
      <UploadProgress 
        isUploading={uploading} 
        filesCount={uploadingFiles.length}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-2">Manage website images</p>
            {selectedCategory !== 'all' && (
              <p className="text-sm text-primary-500 mt-1">Uploading to: {selectedCategory}</p>
            )}
          </div>
          <button
            onClick={() => setShowDropzone(!showDropzone)}
            disabled={selectedCategory === 'all'}
            className={`btn-primary flex items-center space-x-2 ${
              selectedCategory === 'all' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>{uploading ? 'Uploading...' : showDropzone ? 'Hide Upload' : 'Upload Images'}</span>
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat} {cat !== 'all' && selectedCategory === cat && '(Upload here)'}
            </button>
          ))}
        </div>

        {showDropzone && selectedCategory !== 'all' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              disabled={uploading}
              multiple={true}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Total images: {media.length} | Filtered: {filteredMedia.length} | Selected: {selectedCategory}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No images in {selectedCategory} category
                </div>
              ) : (
                filteredMedia.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                    <div className="aspect-square relative bg-gray-100">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${item.url})`,
                          backgroundSize: item.imagePosition ? `${item.imagePosition.zoom}%` : 'cover',
                          backgroundPosition: item.imagePosition 
                            ? `${item.imagePosition.x}% ${item.imagePosition.y}%` 
                            : 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      <button
                        onClick={() => setCropperImage({ url: item.url, id: item.id })}
                        className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Adjust position"
                      >
                        <Crop className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.originalName}</p>
                      {editingId === item.id ? (
                        <div className="flex gap-1 mt-1">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="text-xs flex-1 border rounded px-2 py-1"
                          >
                            {categories.filter(c => c !== 'all').map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateCategory(item.id, editCategory)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">{item.category || 'general'}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id)
                            setEditCategory(item.category || 'general')
                          }}
                          className="flex-1 p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs"
                        >
                          <Edit className="w-3 h-3 mx-auto" />
                        </button>
                        <button
                          onClick={() => copyUrl(item.url)}
                          className="flex-1 p-1.5 text-green-600 hover:bg-green-50 rounded text-xs"
                        >
                          <Copy className="w-3 h-3 mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 p-1.5 text-red-600 hover:bg-red-50 rounded text-xs"
                        >
                          <Trash2 className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {cropperImage && (
          <ImageCropper
            imageUrl={cropperImage.url}
            initialPosition={media.find(m => m.id === cropperImage.id)?.imagePosition}
            onSave={(position) => {
              const item = media.find(m => m.id === cropperImage.id)
              if (item) {
                handleUpdateCategory(item.id, item.category || 'general', position)
              }
              setCropperImage(null)
            }}
            onClose={() => setCropperImage(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
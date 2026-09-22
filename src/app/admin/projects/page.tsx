'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import ImageCropper from '@/components/ui/ImageCropper'
import { Plus, Edit, Trash2, X, Crop } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [cropperImage, setCropperImage] = useState<{ url: string; index: number } | null>(null)
  const [imagePositions, setImagePositions] = useState<Record<number, { x: number; y: number; zoom: number }>>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    gallery: [] as string[],
    imagePositions: {} as Record<number, { x: number; y: number; zoom: number }>,
    technologies: '',
    features: '',
    content: '',
    liveUrl: '',
    githubUrl: '',
    client: '',
    isActive: true,
    isFeatured: false
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error('API error response:', errorData)
        toast.error(errorData.error || `Failed to load projects (${res.status})`)
        setProjects([])
        return
      }
      
      const data = await res.json()
      console.log('Projects data:', data)
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data)
        toast.error('Invalid data format received')
        setProjects([])
        return
      }
      
      setProjects(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Get or create default author
      let authorId = localStorage.getItem('authorId')
      
      if (!authorId) {
        const usersRes = await fetch('/api/users')
        const users = await usersRes.json()
        if (users.length > 0) {
          authorId = users[0].id
          if (authorId) {
            localStorage.setItem('authorId', authorId)
          }
        } else {
          toast.error('No users found. Please create a user first.')
          return
        }
      }

      if (!authorId) {
        toast.error('Unable to get user ID. Please refresh and try again.')
        return
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: formData.gallery[0] || formData.image,
        gallery: formData.gallery,
        imagePositions: imagePositions || {},
        technologies: formData.technologies.split(',').map(t => t.trim()),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        content: formData.content || null,
        liveUrl: formData.liveUrl || null,
        githubUrl: formData.githubUrl || null,
        client: formData.client || null,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        authorId: authorId
      }

      console.log('Submitting payload:', payload)
      console.log('Image positions being saved:', imagePositions)

      if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await res.json()
        console.log('Update result:', result)
        toast.success('Project updated')
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await res.json()
        console.log('Create result:', result)
        if (!res.ok) {
          throw new Error(result.error || 'Failed to create')
        }
        toast.success('Project created')
      }
      setShowModal(false)
      setEditingProject(null)
      resetForm()
      fetchProjects()
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      toast.success('Project deleted')
      fetchProjects()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleEdit = (project: any) => {
    setEditingProject(project)
    const positions = project.imagePositions || {}
    setImagePositions(positions)
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image || '',
      gallery: project.gallery || [],
      imagePositions: positions,
      technologies: project.technologies?.join(', ') || '',
      features: project.features?.join(', ') || '',
      content: project.content || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      client: project.client || '',
      isActive: project.isActive,
      isFeatured: project.isFeatured
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      gallery: [],
      imagePositions: {},
      technologies: '',
      features: '',
      content: '',
      liveUrl: '',
      githubUrl: '',
      client: '',
      isActive: true,
      isFeatured: false
    })
    setImagePositions({})
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    toast.loading(`Uploading ${files.length} image(s)...`, { id: 'upload' })
    
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      formData.append('category', 'portfolio')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const result = await res.json()
      const uploadedUrls = result.files.map((file: any) => file.url)
      
      setFormData(prev => ({ 
        ...prev, 
        gallery: [...prev.gallery, ...uploadedUrls],
        image: prev.gallery.length === 0 ? uploadedUrls[0] : prev.image
      }))
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`, { id: 'upload' })
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error('Upload failed', { id: 'upload' })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage portfolio projects</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                          {project.image || project.gallery?.[0] ? (
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundImage: `url(${project.image || project.gallery[0]})`,
                                backgroundSize: project.imagePositions?.[0]?.zoom ? `${project.imagePositions[0].zoom}%` : 'cover',
                                backgroundPosition: project.imagePositions?.[0]
                                  ? `${project.imagePositions[0].x}% ${project.imagePositions[0].y}%` 
                                  : 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.client || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(project)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 flex-shrink-0">
                      {project.image || project.gallery?.[0] ? (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${project.image || project.gallery[0]})`,
                            backgroundSize: project.imagePositions?.[0]?.zoom ? `${project.imagePositions[0].zoom}%` : 'cover',
                            backgroundPosition: project.imagePositions?.[0]
                              ? `${project.imagePositions[0].x}% ${project.imagePositions[0].y}%` 
                              : 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{project.category}</p>
                      {project.client && <p className="text-sm text-gray-500 mb-2 truncate">Client: {project.client}</p>}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(project)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => { setShowModal(false); setEditingProject(null) }} className="p-2 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Images (First image will be cover)
                  </label>
                  <label className="btn-outline px-4 py-2 cursor-pointer flex items-center justify-center w-full">
                    {uploading ? 'Uploading...' : 'Upload Images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {formData.gallery.length > 0 && (
                    <div className="mt-3 space-y-3">
                      <div className="text-sm font-medium text-gray-700">Preview (as they will appear on portfolio page):</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formData.gallery.map((url, index) => (
                          <div key={index} className="relative group">
                            <div 
                              className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
                              style={{
                                backgroundImage: `url(${url})`,
                                backgroundSize: imagePositions[index] ? `${imagePositions[index].zoom}%` : 'cover',
                                backgroundPosition: imagePositions[index] 
                                  ? `${imagePositions[index].x}% ${imagePositions[index].y}%` 
                                  : 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                            {index === 0 && (
                              <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded shadow-lg font-medium">
                                Cover Image
                              </span>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => setCropperImage({ url, index })}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow-lg flex items-center gap-1 text-xs font-medium transition-colors"
                                title="Adjust position"
                              >
                                <Crop className="w-3 h-3" />
                                Adjust
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow-lg text-xs font-medium transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                            {imagePositions[index] && (
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                Zoom: {imagePositions[index].zoom}% | Pos: {Math.round(imagePositions[index].x)}%, {Math.round(imagePositions[index].y)}%
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Key Features (comma separated)"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Project Details"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
                <input
                  type="text"
                  placeholder="Live URL"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span>Featured</span>
                  </label>
                </div>
                <button type="submit" className="btn-primary w-full">
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
              </form>
            </div>
          </div>
        )}

        {cropperImage && (
          <ImageCropper
            imageUrl={cropperImage.url}
            initialPosition={imagePositions[cropperImage.index]}
            onSave={(position) => {
              setImagePositions(prev => ({ ...prev, [cropperImage.index]: position }))
              setCropperImage(null)
            }}
            onClose={() => setCropperImage(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}

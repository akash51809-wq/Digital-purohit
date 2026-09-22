'use client'

// Services management page - updated
import AdminLayout from '@/components/layout/AdminLayout'
import ImageCropper from '@/components/ui/ImageCropper'
import { Plus, Edit, Trash2, X, Upload, Crop } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [cropperImage, setCropperImage] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number; zoom: number } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    image: '',
    imagePosition: null as { x: number; y: number; zoom: number } | null,
    features: '',
    price: '',
    isActive: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error('API error response:', errorData)
        toast.error(errorData.error || `Failed to load services (${res.status})`)
        setServices([])
        return
      }
      
      const data = await res.json()
      console.log('Services data:', data)
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data)
        toast.error('Invalid data format received')
        setServices([])
        return
      }
      
      setServices(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load services')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        image: formData.image,
        imagePosition: imagePosition || null,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        price: formData.price || null,
        isActive: formData.isActive
      }

      console.log('Submitting service payload:', payload)
      console.log('Image position being saved:', imagePosition)

      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        toast.success('Service updated')
      } else {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        toast.success('Service created')
      }
      setShowModal(false)
      setEditingService(null)
      resetForm()
      fetchServices()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' })
      toast.success('Service deleted')
      fetchServices()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setImagePosition(service.imagePosition || null)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      image: service.image || '',
      imagePosition: service.imagePosition || null,
      features: service.features?.join(', ') || '',
      price: service.price || '',
      isActive: service.isActive
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      image: '',
      imagePosition: null,
      features: '',
      price: '',
      isActive: true
    })
    setImagePosition(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    toast.loading('Uploading...', { id: 'upload' })
    
    try {
      const fd = new FormData()
      fd.append('files', file)
      fd.append('category', 'services')

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')

      const result = await res.json()
      setFormData(prev => ({ ...prev, image: result.files[0].url }))
      toast.success('Uploaded', { id: 'upload' })
    } catch (error) {
      toast.error('Failed', { id: 'upload' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-2">Manage company services</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Service</span>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{service.icon}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{service.price || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(service)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(service.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
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
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600">Icon: {service.icon}</p>
                      {service.price && <p className="text-sm text-gray-600 mt-1">Price: {service.price}</p>}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                      service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(service)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg">
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
                <h2 className="text-2xl font-bold">{editingService ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={() => { setShowModal(false); setEditingService(null) }} className="p-2 hover:bg-gray-100 rounded">
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
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <label className="btn-outline px-4 py-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm font-medium text-gray-700">Preview (as it will appear on services page):</div>
                      <div className="relative group w-full max-w-sm">
                        <div 
                          className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
                          style={{
                            backgroundImage: `url(${formData.image})`,
                            backgroundSize: imagePosition ? `${imagePosition.zoom}%` : 'cover',
                            backgroundPosition: imagePosition ? `${imagePosition.x}% ${imagePosition.y}%` : 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => setCropperImage(formData.image)} 
                          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
                          title="Adjust position"
                        >
                          <Crop className="w-4 h-4" />
                          <span className="text-sm font-medium">Adjust Image</span>
                        </button>
                        {imagePosition && (
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Zoom: {imagePosition.zoom}% | Position: {Math.round(imagePosition.x)}%, {Math.round(imagePosition.y)}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Icon (e.g., Code, Smartphone, Cloud)"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Features (comma separated)"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Price (optional)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
                <button type="submit" className="btn-primary w-full">
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </form>
            </div>
          </div>
        )}

        {cropperImage && (
          <ImageCropper
            imageUrl={cropperImage}
            initialPosition={imagePosition || undefined}
            onSave={(position) => {
              setImagePosition(position)
              setFormData(prev => ({ ...prev, imagePosition: position }))
              setCropperImage(null)
            }}
            onClose={() => setCropperImage(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}

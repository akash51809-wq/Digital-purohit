export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price?: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  description: string
  content?: string
  image?: string
  gallery: string[]
  imagePositions?: Record<number, { x: number; y: number; zoom: number }>
  category: string
  tags: string[]
  client?: string
  duration?: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  isActive: boolean
  isFeatured: boolean
  order: number
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  imagePosition?: { x: number; y: number; zoom: number }
  category: string
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  views: number
  readTime: number
  authorId: string
  author: User
  seoTitle?: string
  seoDescription?: string
  seoKeywords: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  source?: string
  createdAt: Date
  updatedAt: Date
}

export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt?: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  slug: string
  title: string
  content: any
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Setting {
  id: string
  key: string
  value: any
  type: string
}

export interface DashboardStats {
  totalProjects: number
  totalPosts: number
  totalContacts: number
  newContacts: number
  publishedPosts: number
  activeProjects: number
}
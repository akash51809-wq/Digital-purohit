import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { sanitizeHtml } from '@/lib/security'

interface MediaFile {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  category: string
  type: string
  uploadMethod: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { files } = body as { files: MediaFile[] }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate and sanitize each file entry
    const sanitizedFiles = files.map(file => ({
      filename: sanitizeHtml(file.filename),
      originalName: sanitizeHtml(file.originalName),
      mimeType: sanitizeHtml(file.mimeType),
      size: Number(file.size),
      url: sanitizeHtml(file.url),
      category: sanitizeHtml(file.category || 'general'),
      type: sanitizeHtml(file.type),
      uploadMethod: sanitizeHtml(file.uploadMethod || 'cloudinary-direct'),
      uploadedBy: 'system',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    // Save all files to Firestore
    const savePromises = sanitizedFiles.map(async (file) => {
      const docRef = await adminDb.collection('media').add(file)
      return {
        id: docRef.id,
        ...file
      }
    })

    const savedFiles = await Promise.all(savePromises)

    return NextResponse.json({
      success: true,
      files: savedFiles,
      count: savedFiles.length
    })
  } catch (error: any) {
    console.error('Media save error:', error)
    return NextResponse.json(
      { error: 'Failed to save media info', details: error.message },
      { status: 500 }
    )
  }
}